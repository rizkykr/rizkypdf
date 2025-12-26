import { ImageIcon } from "lucide-react"
import { ConverterPage } from "@/components/converter/converter-page"

const config = {
    title: "Image to",
    highlight: "PDF",
    highlightGradient: "from-green-500 to-emerald-500",
    description: "Gabungkan gambar menjadi satu file PDF",
    accept: "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif",
    fileTypeLabel: "Gambar",
    apiEndpoint: "/api/image-to-pdf",
    outputExtension: ".pdf",
    accentColor: "green" as const,
}

export default function ImageToPdfPage() {
    return <ConverterPage config={config} icon={<ImageIcon className="h-6 w-6" />} />
}
