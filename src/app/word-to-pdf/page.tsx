import { FileType } from "lucide-react"
import { ConverterPage } from "@/components/converter/converter-page"

const config = {
    title: "Word to",
    highlight: "PDF",
    highlightGradient: "from-red-500 to-orange-500",
    description: "Konversi dokumen Word ke format PDF",
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileTypeLabel: "Word",
    apiEndpoint: "/api/word-to-pdf",
    outputExtension: ".pdf",
    accentColor: "blue" as const,
}

export default function WordToPdfPage() {
    return <ConverterPage config={config} icon={<FileType className="h-6 w-6" />} />
}
