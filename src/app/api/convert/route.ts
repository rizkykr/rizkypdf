import { NextRequest, NextResponse } from "next/server"
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    ImageRun,
    PageBreak
} from "docx"
import { extractText, extractImages, getDocumentProxy } from "unpdf"
import sharp from "sharp"

export const runtime = "nodejs"

interface ExtractedImageObj {
    data: Uint8ClampedArray
    width: number
    height: number
    channels: number
}

function detectBlockType(text: string): { type: "heading" | "list" | "paragraph"; level?: number } {
    const trimmed = text.trim()

    if (/^[\u2022\u2023\u25E6\u2043\u2219•◦‣⁃]\s/.test(trimmed)) {
        return { type: "list" }
    }
    if (/^[-*]\s/.test(trimmed)) {
        return { type: "list" }
    }
    if (/^\d+[.)]\s/.test(trimmed)) {
        return { type: "list" }
    }
    if (/^[a-z][.)]\s/i.test(trimmed)) {
        return { type: "list" }
    }

    if (trimmed.length < 100 && trimmed.length > 2) {
        if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
            return { type: "heading", level: 1 }
        }
        if (/^(?:Chapter|Section|Part|BAB|BAGIAN)\s+\d*/i.test(trimmed)) {
            return { type: "heading", level: 1 }
        }
        if (/^[IVXLCDM]+[.)]\s/i.test(trimmed)) {
            return { type: "heading", level: 2 }
        }
        if (/^[A-Z][^.!?]*$/.test(trimmed) && trimmed.length < 60) {
            return { type: "heading", level: 2 }
        }
        if (/^\d+(\.\d+)*\.?\s+[A-Z]/.test(trimmed) && trimmed.length < 80) {
            return { type: "heading", level: 2 }
        }
    }

    return { type: "paragraph" }
}

async function convertRawToPng(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    channels: number
): Promise<Buffer | null> {
    try {
        const channelCount = channels === 3 ? 3 : 4

        const pngBuffer = await sharp(Buffer.from(data), {
            raw: {
                width: width,
                height: height,
                channels: channelCount as 3 | 4,
            },
        })
            .png()
            .toBuffer()

        return pngBuffer
    } catch (error) {
        console.error("Error converting raw image to PNG:", error)
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Hanya file PDF yang diperbolehkan" }, { status: 400 })
        }

        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const pdf = await getDocumentProxy(buffer)

        const { text: rawText, totalPages } = await extractText(pdf, { mergePages: false })
        const pages = Array.isArray(rawText) ? rawText : [rawText]

        const imagesByPage = new Map<number, { png: Buffer; width: number; height: number }[]>()

        try {
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const pageImages = await extractImages(pdf, pageNum) as ExtractedImageObj[]
                if (pageImages && pageImages.length > 0) {
                    const convertedImages: { png: Buffer; width: number; height: number }[] = []

                    for (const img of pageImages) {
                        if (img.data && img.width > 0 && img.height > 0) {
                            const pngBuffer = await convertRawToPng(img.data, img.width, img.height, img.channels || 4)
                            if (pngBuffer) {
                                convertedImages.push({
                                    png: pngBuffer,
                                    width: img.width,
                                    height: img.height,
                                })
                            }
                        }
                    }

                    if (convertedImages.length > 0) {
                        imagesByPage.set(pageNum, convertedImages)
                    }
                }
            }
        } catch (imgErr) {
            console.log("No images found or error extracting images:", imgErr)
        }

        const paragraphs: Paragraph[] = []

        for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
            const pageNum = pageIdx + 1
            const pageText = pages[pageIdx]

            if (pageIdx > 0) {
                paragraphs.push(
                    new Paragraph({
                        children: [new PageBreak()],
                    })
                )
            }

            const pageImgs = imagesByPage.get(pageNum)
            if (pageImgs && pageImgs.length > 0) {
                for (const img of pageImgs) {
                    try {
                        const maxWidth = 500
                        const maxHeight = 400
                        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
                        const displayWidth = Math.round(img.width * scale)
                        const displayHeight = Math.round(img.height * scale)

                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: img.png,
                                        transformation: {
                                            width: displayWidth,
                                            height: displayHeight,
                                        },
                                        type: "png",
                                    }),
                                ],
                                spacing: { before: 200, after: 200 },
                                alignment: AlignmentType.CENTER,
                            })
                        )
                    } catch (imgError) {
                        console.error("Error adding image to doc:", imgError)
                    }
                }
            }

            const lines = pageText.split("\n")
            let currentParagraph: string[] = []

            for (const line of lines) {
                const trimmedLine = line.trim()

                if (trimmedLine.length === 0) {
                    if (currentParagraph.length > 0) {
                        paragraphs.push(createParagraph(currentParagraph.join(" ")))
                        currentParagraph = []
                    }
                    continue
                }

                const blockType = detectBlockType(trimmedLine)

                if (blockType.type !== "paragraph" && currentParagraph.length > 0) {
                    paragraphs.push(createParagraph(currentParagraph.join(" ")))
                    currentParagraph = []
                }

                if (blockType.type === "heading") {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine,
                                    bold: true,
                                    size: blockType.level === 1 ? 32 : 28,
                                }),
                            ],
                            heading: blockType.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 200 },
                        })
                    )
                } else if (blockType.type === "list") {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine,
                                    size: 24,
                                }),
                            ],
                            bullet: { level: 0 },
                            spacing: { after: 80 },
                        })
                    )
                } else {
                    currentParagraph.push(trimmedLine)
                }
            }

            if (currentParagraph.length > 0) {
                paragraphs.push(createParagraph(currentParagraph.join(" ")))
            }
        }

        if (paragraphs.length === 0) {
            return NextResponse.json(
                { error: "PDF tidak mengandung content yang bisa diekstrak. Coba file PDF lain." },
                { status: 400 }
            )
        }

        const doc = new Document({
            sections: [{ properties: {}, children: paragraphs }],
        })

        const docxBuffer = await Packer.toBuffer(doc)
        const outputFileName = `rizkypdf-${file.name.replace(/\.pdf$/i, ".docx")}`

        return new Response(docxBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${outputFileName}"`,
                "Content-Length": docxBuffer.byteLength.toString(),
            },
        })
    } catch (error) {
        console.error("Conversion error:", error)
        return NextResponse.json(
            { error: "Gagal mengkonversi file. Pastikan file PDF valid dan tidak corrupt." },
            { status: 500 }
        )
    }
}

function createParagraph(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                size: 24,
            }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    })
}
