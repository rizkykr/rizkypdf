"use client"

import { Mail, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, FormEvent } from "react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const text = `*Pesan dari Website RizkyPDF*

*Nama:* ${formData.name}
*Email:* ${formData.email}
*Subjek:* ${formData.subject}

*Pesan:*
${formData.message}`

        const whatsappNumber = "6287855103169"
        const encodedText = encodeURIComponent(text)
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`

        window.open(whatsappUrl, "_blank")
    }

    return (
        <div className="relative min-h-[80vh]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 blur-3xl animate-pulse" />
                <div className="absolute left-0 bottom-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-violet-500/15 to-fuchsia-500/15 blur-3xl" />
            </div>

            <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-1.5 text-sm font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Kami siap membantu
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Mari{" "}
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            Berbincang
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        Ada pertanyaan, feedback, atau ide kolaborasi? Kami senang mendengar dari kamu!
                    </p>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 text-center transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-500/20">
                                <Mail className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="mt-4 font-semibold">Email</h3>
                            <a href="mailto:me@rizkykr.xyz" className="mt-1 text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
                                me@rizkykr.xyz
                            </a>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 text-center transition-all hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 ring-1 ring-teal-500/20">
                                <MapPin className="h-6 w-6 text-teal-500" />
                            </div>
                            <h3 className="mt-4 font-semibold">Lokasi</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Medan, Indonesia</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 text-center transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/20">
                                <Clock className="h-6 w-6 text-cyan-500" />
                            </div>
                            <h3 className="mt-4 font-semibold">Respons</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Dalam 24 jam</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 relative">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-xl" />
                    <div className="relative rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm p-8 sm:p-10">
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-semibold">Kirim Pesan via WhatsApp</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Isi form di bawah dan pesan akan dikirim langsung ke WhatsApp kami
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium">Nama</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-muted-foreground/60"
                                        placeholder="Nama lengkap kamu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-muted-foreground/60"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="block text-sm font-medium">Subjek</label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-muted-foreground/60"
                                    placeholder="Tentang apa pesanmu?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium">Pesan</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none placeholder:text-muted-foreground/60"
                                    placeholder="Tulis pesanmu di sini..."
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Kirim via WhatsApp
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
