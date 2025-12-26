import { FileText } from "lucide-react"
import { ConverterPage } from "@/components/converter/converter-page"

const config = {
    title: "PDF to",
    highlight: "Word",
    highlightGradient: "from-blue-600 to-indigo-600",
    description: "Konversi PDF ke dokumen Word yang bisa diedit",
    accept: "application/pdf,.pdf",
    fileTypeLabel: "PDF",
    apiEndpoint: "/api/convert",
    outputExtension: ".docx",
    accentColor: "red" as const,
}

export default function PdfToWordPage() {
    return <ConverterPage config={config} icon={<FileText className="h-6 w-6" />} />
}
