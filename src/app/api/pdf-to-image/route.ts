import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { writeFile, readFile, unlink, readdir, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import archiver from "archiver"

export const runtime = "nodejs"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
    const tempDir = `/tmp/pdf-to-image-${Date.now()}`

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

        if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const inputPath = path.join(tempDir, "input.pdf")
        const outputPrefix = path.join(tempDir, "page")

        await writeFile(inputPath, buffer)

        await execAsync(`pdftoppm -png -r 150 "${inputPath}" "${outputPrefix}"`)

        const files = await readdir(tempDir)
        const pngFiles = files
            .filter(f => f.endsWith(".png"))
            .sort()

        if (pngFiles.length === 0) {
            return NextResponse.json(
                { error: "PDF tidak bisa dikonversi ke gambar." },
                { status: 400 }
            )
        }

        const baseName = file.name.replace(/\.pdf$/i, "")

        if (pngFiles.length === 1) {
            const pngPath = path.join(tempDir, pngFiles[0])
            const pngBuffer = await readFile(pngPath)

            await cleanupTempDir(tempDir)

            return new Response(new Uint8Array(pngBuffer), {
                status: 200,
                headers: {
                    "Content-Type": "image/png",
                    "Content-Disposition": `attachment; filename="rizkypdf-${baseName}.png"`,
                    "Content-Length": pngBuffer.byteLength.toString(),
                },
            })
        }

        const chunks: Buffer[] = []

        await new Promise<void>((resolve, reject) => {
            const archive = archiver("zip", { zlib: { level: 9 } })

            archive.on("data", (chunk: Buffer) => chunks.push(chunk))
            archive.on("end", () => resolve())
            archive.on("error", (err: Error) => reject(err))

            pngFiles.forEach((pngFile, index) => {
                const pngPath = path.join(tempDir, pngFile)
                const pageNum = (index + 1).toString().padStart(3, "0")
                archive.file(pngPath, { name: `rizkypdf-${baseName}_page_${pageNum}.png` })
            })

            archive.finalize()
        })

        await cleanupTempDir(tempDir)

        const zipBuffer = Buffer.concat(chunks)

        return new Response(new Uint8Array(zipBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="rizkypdf-${baseName}_images.zip"`,
                "Content-Length": zipBuffer.byteLength.toString(),
            },
        })
    } catch (error) {
        console.error("PDF to Image conversion error:", error)

        try {
            await cleanupTempDir(tempDir)
        } catch {
        }

        return NextResponse.json(
            { error: "Gagal mengkonversi PDF ke gambar. Pastikan file PDF valid." },
            { status: 500 }
        )
    }
}

async function cleanupTempDir(dirPath: string) {
    try {
        const files = await readdir(dirPath)
        for (const file of files) {
            await unlink(path.join(dirPath, file))
        }
        await unlink(dirPath).catch(() => { })
    } catch {
    }
}
