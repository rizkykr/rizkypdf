"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Menu, X, ChevronDown, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const tools = [
    { href: "/pdf-to-word", label: "PDF to Word" },
    { href: "/word-to-pdf", label: "Word to PDF" },
    { href: "/image-to-pdf", label: "Image to PDF" },
    { href: "/pdf-to-image", label: "PDF to Image" },
]

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

export function Header() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [toolsOpen, setToolsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="group flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">RizkyPDF</span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <div className="relative">
                        <button
                            onClick={() => setToolsOpen(!toolsOpen)}
                            onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
                            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <Sparkles className="h-4 w-4" />
                            Tools
                            <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
                        </button>
                        {toolsOpen && (
                            <div className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-lg">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        className="block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
                                    >
                                        {tool.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {navLinks.slice(1).map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted ${pathname === link.href ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <Button asChild className="hidden md:inline-flex h-10 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40">
                    <Link href="/pdf-to-word">Get Started</Link>
                </Button>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted md:hidden transition-colors"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-border/40 bg-background/95 backdrop-blur-lg px-4 py-4 md:hidden">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-muted ${pathname === link.href ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" : "text-muted-foreground"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-border/40 pt-3 mt-3">
                            <p className="px-3.5 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</p>
                            {tools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
                                >
                                    {tool.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
