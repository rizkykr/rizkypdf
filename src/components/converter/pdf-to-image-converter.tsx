"use client"

import { useState, useCallback } from "react"
import { Upload, X, AlertCircle, Download, RefreshCw, Loader2, CheckCircle2, FileImage } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import JSZip from "jszip"
import { saveAs } from "file-saver"

type ConversionState = "idle" | "uploading" | "converting" | "done" | "error"

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PdfToImageConverter() {
    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<ConversionState>("idle")
    const [progress, setProgress] = useState(0)
    const [convertedImages, setConvertedImages] = useState<{ name: string; blob: Blob }[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFile = useCallback((f: File) => {
        if (f.size > 10 * 1024 * 1024) {
            setError("Ukuran file maksimal 10MB")
            return
        }
        if (f.type !== "application/pdf") {
            setError("Hanya file PDF yang diperbolehkan")
            return
        }
        setError(null)
        setFile(f)
        setState("idle")
        setProgress(0)
        setConvertedImages([])
    }, [])

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(e.type === "dragenter" || e.type === "dragover")
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
    }, [handleFile])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0])
    }, [handleFile])

    const handleRemove = useCallback(() => {
        setFile(null)
        setState("idle")
        setProgress(0)
        setConvertedImages([])
        setError(null)
    }, [])

    const handleConvert = async () => {
        if (!file) return

        setState("converting")
        setProgress(10)

        try {
            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            const numPages = pdf.numPages
            const images: { name: string; blob: Blob }[] = []
            const baseName = file.name.replace(/\.pdf$/i, "")

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i)
                const scale = 2
                const viewport = page.getViewport({ scale })

                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")!
                canvas.width = viewport.width
                canvas.height = viewport.height

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise

                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b!), "image/png", 1.0)
                })

                const pageNum = i.toString().padStart(3, "0")
                images.push({
                    name: `rizkypdf-${baseName}_page_${pageNum}.png`,
                    blob,
                })

                setProgress(10 + Math.round((i / numPages) * 80))
            }

            setConvertedImages(images)
            setProgress(100)
            setState("done")

            toast.success("Konversi berhasil!", {
                description: `${images.length} halaman siap didownload`,
            })
        } catch (err) {
            console.error("Conversion error:", err)
            setState("error")
            toast.error("Konversi gagal", {
                description: err instanceof Error ? err.message : "Terjadi kesalahan",
            })
        }
    }

    const handleDownload = async () => {
        if (convertedImages.length === 0) return

        if (convertedImages.length === 1) {
            saveAs(convertedImages[0].blob, convertedImages[0].name)
        } else {
            const zip = new JSZip()
            convertedImages.forEach((img) => {
                zip.file(img.name, img.blob)
            })
            const zipBlob = await zip.generateAsync({ type: "blob" })
            const baseName = file?.name.replace(/\.pdf$/i, "") || "images"
            saveAs(zipBlob, `rizkypdf-${baseName}_images.zip`)
        }
    }

    const handleReset = () => {
        setFile(null)
        setState("idle")
        setProgress(0)
        setConvertedImages([])
        setError(null)
    }

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        PDF to{" "}
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Image
                        </span>
                    </h1>
                    <p className="mt-3 text-muted-foreground">Konversi halaman PDF menjadi gambar PNG</p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-background/80 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8">
                    {state === "done" ? (
                        <div className="flex flex-col items-center gap-6 py-8 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold">Konversi Selesai!</h2>
                                <p className="text-muted-foreground">
                                    {convertedImages.length} halaman siap didownload
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button size="lg" onClick={handleDownload} className="h-12 px-8">
                                    <Download className="mr-2 h-4 w-4" />
                                    {convertedImages.length === 1 ? "Download PNG" : "Download ZIP"}
                                </Button>
                                <Button size="lg" variant="outline" onClick={handleReset} className="h-12">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Konversi Lagi
                                </Button>
                            </div>
                        </div>
                    ) : !file ? (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${dragActive
                                ? "border-primary bg-primary/5"
                                : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/30"
                                }`}
                        >
                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleChange}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 text-white">
                                    <FileImage className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-medium">
                                        {dragActive ? "Lepaskan file di sini" : "Drop file PDF"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">atau klik untuk pilih file</p>
                                </div>
                                <Button variant="outline" size="sm" className="pointer-events-none">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Pilih File
                                </Button>
                                <p className="text-xs text-muted-foreground">Maksimal 10MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 text-white">
                                    <FileImage className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleRemove}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {state === "converting" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Mengkonversi...</span>
                                        <span className="font-medium">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            )}

                            {state === "idle" && (
                                <Button size="lg" onClick={handleConvert} className="w-full h-12">
                                    Konversi Sekarang
                                </Button>
                            )}

                            {state === "converting" && (
                                <Button size="lg" disabled className="w-full h-12">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengkonversi...
                                </Button>
                            )}

                            {state === "error" && (
                                <div className="space-y-4">
                                    <p className="text-center text-sm text-destructive">Konversi gagal. Coba lagi.</p>
                                    <Button size="lg" onClick={handleConvert} className="w-full h-12">
                                        Coba Lagi
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    File diproses langsung di browser, tidak dikirim ke server
                </p>
            </div>
        </div>
    )
}
