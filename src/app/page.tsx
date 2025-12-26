import Link from "next/link"
import { ArrowRight, FileText, FileType, ImageIcon, FileImage, Zap, Shield, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const tools = [
  {
    href: "/pdf-to-word",
    title: "PDF to Word",
    description: "Ubah PDF menjadi dokumen Word yang bisa diedit",
    icon: FileText,
    gradient: "from-rose-500 via-red-500 to-orange-500",
    shadowColor: "shadow-rose-500/20",
    iconColor: "text-rose-500",
  },
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Konversi dokumen Word ke format PDF",
    icon: FileType,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    shadowColor: "shadow-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF",
    description: "Gabungkan gambar menjadi satu file PDF",
    icon: ImageIcon,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    href: "/pdf-to-image",
    title: "PDF to Image",
    description: "Ekspor halaman PDF sebagai gambar PNG",
    icon: FileImage,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadowColor: "shadow-violet-500/20",
    iconColor: "text-violet-500",
  },
]

const features = [
  {
    icon: Zap,
    title: "Cepat & Ringan",
    description: "Proses konversi instan tanpa antrian",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privasi Terjaga",
    description: "File tidak disimpan di server kami",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Clock,
    title: "Tanpa Batas",
    description: "Gratis tanpa batasan penggunaan",
    color: "from-blue-500 to-indigo-500",
  },
]

export default function HomePage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500/25 via-purple-500/20 to-fuchsia-500/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-3xl" />
        <div className="absolute left-0 top-2/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-rose-500/10 to-orange-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 px-5 py-2 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span>100% Gratis & Open Source</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          Tools PDF yang{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              simpel & powerful
            </span>
            <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,8 Q25,0 50,8 T100,8" fill="none" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(139 92 246)" />
                  <stop offset="50%" stopColor="rgb(168 85 247)" />
                  <stop offset="100%" stopColor="rgb(217 70 239)" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Konversi dokumen dengan mudah. Tanpa signup, tanpa watermark, langsung pakai.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5">
            <Link href="/pdf-to-word">
              Mulai Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base border-border/50 hover:bg-muted/50 transition-all hover:-translate-y-0.5">
            <Link href="/about">Pelajari Lebih Lanjut</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/30 p-6 transition-all duration-300 hover:border-border hover:shadow-2xl ${tool.shadowColor} hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg`}>
                  <tool.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                <div className={`mt-5 flex items-center text-sm font-medium ${tool.iconColor} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1`}>
                  Gunakan Tool
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-muted/50 via-background to-muted/30 p-10 sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.08),transparent_50%)]" />
          <div className="relative grid gap-10 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-xl`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-10 text-center text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(255,255,255,0.2),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Siap untuk memulai?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80 text-lg">
              Pilih tool yang kamu butuhkan dan mulai konversi dokumenmu sekarang juga.
            </p>
            <Button asChild size="lg" className="mt-8 h-14 px-10 bg-white text-violet-600 hover:bg-white/90 shadow-xl transition-all hover:-translate-y-0.5">
              <Link href="/pdf-to-word">
                Mulai Konversi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
