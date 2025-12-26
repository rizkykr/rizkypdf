import { FileText, Zap, Shield, Heart } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />
            </div>

            <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tentang RizkyPDF</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Tools konversi dokumen yang dibuat dengan fokus pada kemudahan dan performa
                    </p>
                </div>

                <div className="mt-16 space-y-12">
                    <section>
                        <h2 className="text-xl font-semibold">Apa itu RizkyPDF?</h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            RizkyPDF adalah aplikasi web untuk konversi dokumen yang dibangun dengan teknologi modern.
                            Kami menyediakan tools untuk mengubah PDF ke Word, Word ke PDF, gambar ke PDF, dan PDF ke gambar
                            dengan proses yang cepat dan mudah.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-6">Mengapa RizkyPDF?</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
                                <Zap className="h-8 w-8 text-amber-500" />
                                <h3 className="mt-4 font-medium">Performa Tinggi</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Proses konversi dilakukan secara efisien tanpa perlu menunggu lama
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
                                <Shield className="h-8 w-8 text-green-500" />
                                <h3 className="mt-4 font-medium">Privasi Terjaga</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    File kamu tidak disimpan di server setelah proses konversi selesai
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
                                <Heart className="h-8 w-8 text-red-500" />
                                <h3 className="mt-4 font-medium">Gratis Sepenuhnya</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Semua fitur bisa digunakan tanpa biaya dan tanpa batasan
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Tech Stack</h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            Dibangun menggunakan Next.js 14 dengan App Router, React, TypeScript, dan Tailwind CSS.
                            Backend processing menggunakan library seperti pdf-lib, mammoth, sharp, dan unpdf untuk
                            memastikan kualitas konversi yang optimal.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
