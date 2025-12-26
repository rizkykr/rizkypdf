import { FileImage } from "lucide-react"
import { ConverterPage } from "@/components/converter/converter-page"

const config = {
    title: "PDF to",
    highlight: "Image",
    highlightGradient: "from-purple-500 to-pink-500",
    description: "Konversi halaman PDF menjadi gambar PNG",
    accept: "application/pdf,.pdf",
    fileTypeLabel: "PDF",
    apiEndpoint: "/api/pdf-to-image",
    outputExtension: ".png",
    accentColor: "purple" as const,
}

export default function PdfToImagePage() {
    return <ConverterPage config={config} icon={<FileImage className="h-6 w-6" />} />
}
