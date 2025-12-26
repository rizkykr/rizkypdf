import Link from "next/link"
import { FileText, Github, Mail, Heart } from "lucide-react"

const tools = [
    { href: "/pdf-to-word", label: "PDF to Word" },
    { href: "/word-to-pdf", label: "Word to PDF" },
    { href: "/image-to-pdf", label: "Image to PDF" },
    { href: "/pdf-to-image", label: "PDF to Image" },
]

const links = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.05),transparent)]" />
            <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link href="/" className="group inline-flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">RizkyPDF</span>
                        </Link>
                        <p className="mt-5 max-w-sm text-sm text-muted-foreground leading-relaxed">
                            Tools konversi dokumen yang simpel dan powerful. Gratis, tanpa batasan, selamanya.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-500 hover:scale-105"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:me@rizkykr.xyz"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-500 hover:scale-105"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Tools</h3>
                        <ul className="mt-4 space-y-3">
                            {tools.map((tool) => (
                                <li key={tool.href}>
                                    <Link href={tool.href} className="text-sm text-muted-foreground transition-colors hover:text-violet-500">
                                        {tool.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Links</h3>
                        <ul className="mt-4 space-y-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-violet-500">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {year} RizkyPDF. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> in Medan
                    </p>
                </div>
            </div>
        </footer>
    )
}
