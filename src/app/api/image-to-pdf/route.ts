import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import sharp from "sharp"

export const runtime = "nodejs"

const SUPPORTED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
]

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll("files") as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
        }

        const maxSize = 10 * 1024 * 1024
        for (const file of files) {
            if (!SUPPORTED_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: `Format ${file.type} tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.` },
                    { status: 400 }
                )
            }
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `File ${file.name} melebihi batas 10MB` },
                    { status: 400 }
                )
            }
        }

        const pdfDoc = await PDFDocument.create()

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            const processedBuffer = await sharp(buffer)
                .jpeg({ quality: 90 })
                .toBuffer()

            const metadata = await sharp(buffer).metadata()
            const imgWidth = metadata.width || 595
            const imgHeight = metadata.height || 842

            const maxPageWidth = 595
            const maxPageHeight = 842
            const margin = 20

            let pageWidth = imgWidth + margin * 2
            let pageHeight = imgHeight + margin * 2

            let scale = 1
            if (pageWidth > maxPageWidth) {
                scale = (maxPageWidth - margin * 2) / imgWidth
            }
            if (pageHeight * scale > maxPageHeight) {
                scale = (maxPageHeight - margin * 2) / imgHeight
            }

            const scaledWidth = imgWidth * scale
            const scaledHeight = imgHeight * scale
            pageWidth = scaledWidth + margin * 2
            pageHeight = scaledHeight + margin * 2

            const page = pdfDoc.addPage([pageWidth, pageHeight])

            const jpgImage = await pdfDoc.embedJpg(processedBuffer)
            page.drawImage(jpgImage, {
                x: margin,
                y: margin,
                width: scaledWidth,
                height: scaledHeight,
            })
        }

        const pdfBytes = await pdfDoc.save()

        const outputFileName = files.length === 1
            ? `rizkypdf-${files[0].name.replace(/\.[^.]+$/, ".pdf")}`
            : "rizkypdf-images.pdf"

        return new Response(pdfBytes as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outputFileName}"`,
                "Content-Length": pdfBytes.byteLength.toString(),
            },
        })
    } catch (error) {
        console.error("Image to PDF conversion error:", error)
        return NextResponse.json(
            { error: "Gagal mengkonversi gambar. Pastikan file gambar valid." },
            { status: 500 }
        )
    }
}
