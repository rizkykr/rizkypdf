import { NextRequest, NextResponse } from "next/server"
import mammoth from "mammoth"
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib"

export const runtime = "nodejs"

interface MammothImage {
    contentType: string
    read: (encoding: "base64" | "buffer") => Promise<string | Buffer>
}

interface TextBlock {
    type: "text" | "image"
    content?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    isHeading?: boolean
    headingLevel?: number
    isList?: boolean
    imageData?: Buffer
    imageType?: string
}

function parseHtmlToBlocks(html: string, images: Map<string, Buffer>): TextBlock[] {
    const blocks: TextBlock[] = []

    const cleanHtml = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")

    const blockRegex = /<(h[1-6]|p|li|ul|ol|div|table|tr|td|th|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi
    let match

    while ((match = blockRegex.exec(cleanHtml)) !== null) {
        const tagName = match[1].toLowerCase()
        let content = match[2]

        const imgMatch = content.match(/<img[^>]*src="([^"]*)"[^>]*>/i)
        if (imgMatch) {
            const src = imgMatch[1]
            if (src.startsWith("data:")) {
                const dataMatch = src.match(/data:([^;]+);base64,(.+)/)
                if (dataMatch) {
                    try {
                        const imageBuffer = Buffer.from(dataMatch[2], "base64")
                        blocks.push({
                            type: "image",
                            imageData: imageBuffer,
                            imageType: dataMatch[1],
                        })
                    } catch {
                    }
                }
            } else if (images.has(src)) {
                blocks.push({
                    type: "image",
                    imageData: images.get(src),
                    imageType: "image/png",
                })
            }
        }

        const hasBold = /<(strong|b)>/i.test(content)
        const hasItalic = /<(em|i)>/i.test(content)
        const hasUnderline = /<u>/i.test(content)

        content = content.replace(/<[^>]+>/g, "").trim()

        if (!content && !imgMatch) continue

        if (tagName.startsWith("h")) {
            const level = parseInt(tagName[1])
            blocks.push({
                type: "text",
                content,
                bold: true,
                isHeading: true,
                headingLevel: level,
            })
        } else if (tagName === "li") {
            blocks.push({
                type: "text",
                content,
                isList: true,
            })
        } else if (content) {
            blocks.push({
                type: "text",
                content,
                bold: hasBold,
                italic: hasItalic,
                underline: hasUnderline,
            })
        }
    }

    if (blocks.length === 0) {
        const simpleParaRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
        while ((match = simpleParaRegex.exec(cleanHtml)) !== null) {
            let content = match[1]
            const hasBold = /<(strong|b)>/i.test(content)
            const hasItalic = /<(em|i)>/i.test(content)
            content = content.replace(/<[^>]+>/g, "").trim()
            if (content) {
                blocks.push({
                    type: "text",
                    content,
                    bold: hasBold,
                    italic: hasItalic,
                })
            }
        }
    }

    if (blocks.length === 0) {
        const plainText = cleanHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        if (plainText) {
            blocks.push({ type: "text", content: plainText })
        }
    }

    return blocks
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
        }

        const validTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ]

        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Hanya file Word (.doc, .docx) yang diperbolehkan" },
                { status: 400 }
            )
        }

        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const extractedImages = new Map<string, Buffer>()
        let imageCounter = 0

        const result = await mammoth.convertToHtml(
            { buffer },
            {
                convertImage: mammoth.images.imgElement(async (image: MammothImage) => {
                    const imageBuffer = await image.read("buffer") as Buffer
                    const imageName = `image_${imageCounter++}`
                    extractedImages.set(imageName, imageBuffer)
                    return { src: imageName }
                }),
            }
        )

        const htmlContent = result.value

        if (!htmlContent || htmlContent.trim().length === 0) {
            return NextResponse.json(
                { error: "Dokumen Word tidak mengandung content yang bisa diekstrak." },
                { status: 400 }
            )
        }

        const textBlocks = parseHtmlToBlocks(htmlContent, extractedImages)

        const pdfDoc = await PDFDocument.create()
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
        const boldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)

        const margin = 50
        const [pageWidth, pageHeight] = PageSizes.A4
        const maxWidth = pageWidth - margin * 2
        const maxImageWidth = 400
        const maxImageHeight = 300

        let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
        let yPosition = pageHeight - margin

        for (const block of textBlocks) {
            if (block.type === "image" && block.imageData) {
                try {
                    let embedded
                    const imageType = block.imageType || "image/png"

                    if (imageType.includes("jpeg") || imageType.includes("jpg")) {
                        embedded = await pdfDoc.embedJpg(block.imageData)
                    } else {
                        embedded = await pdfDoc.embedPng(block.imageData)
                    }

                    const scale = Math.min(
                        maxImageWidth / embedded.width,
                        maxImageHeight / embedded.height,
                        1
                    )
                    const imgWidth = embedded.width * scale
                    const imgHeight = embedded.height * scale

                    if (yPosition - imgHeight < margin) {
                        currentPage = pdfDoc.addPage([pageWidth, pageHeight])
                        yPosition = pageHeight - margin
                    }

                    currentPage.drawImage(embedded, {
                        x: margin,
                        y: yPosition - imgHeight,
                        width: imgWidth,
                        height: imgHeight,
                    })

                    yPosition -= imgHeight + 20
                } catch (imgError) {
                    console.error("Error embedding image:", imgError)
                }
                continue
            }

            if (!block.content) continue

            let font = regularFont
            let fontSize = 11
            let lineHeight = fontSize * 1.5
            let spacingAfter = 12

            if (block.isHeading) {
                font = boldFont
                fontSize = block.headingLevel === 1 ? 20 : block.headingLevel === 2 ? 16 : 14
                lineHeight = fontSize * 1.4
                spacingAfter = fontSize
            } else if (block.isList) {
                fontSize = 11
                block.content = "• " + block.content
            } else {
                if (block.bold && block.italic) {
                    font = boldItalicFont
                } else if (block.bold) {
                    font = boldFont
                } else if (block.italic) {
                    font = italicFont
                }
            }

            const words = block.content.split(" ")
            let currentLine = ""
            const lines: string[] = []

            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word
                const textWidth = font.widthOfTextAtSize(testLine, fontSize)

                if (textWidth > maxWidth && currentLine) {
                    lines.push(currentLine)
                    currentLine = word
                } else {
                    currentLine = testLine
                }
            }
            if (currentLine) lines.push(currentLine)

            for (const line of lines) {
                if (yPosition < margin + lineHeight) {
                    currentPage = pdfDoc.addPage([pageWidth, pageHeight])
                    yPosition = pageHeight - margin
                }

                currentPage.drawText(line, {
                    x: margin,
                    y: yPosition,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                })
                yPosition -= lineHeight
            }

            yPosition -= spacingAfter
        }

        const pdfBytes = await pdfDoc.save()
        const outputFileName = `rizkypdf-${file.name.replace(/\.(docx?|doc)$/i, ".pdf")}`

        return new Response(pdfBytes as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFileName}"`,
                "Content-Length": pdfBytes.byteLength.toString(),
            },
        })
    } catch (error) {
        console.error("Word to PDF conversion error:", error)
        return NextResponse.json(
            { error: "Gagal mengkonversi file. Pastikan file Word valid dan tidak corrupt." },
            { status: 500 }
        )
    }
}
