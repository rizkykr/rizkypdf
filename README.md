# RizkyPDF

**Free Document Converter** - Konversi dokumen secara gratis, cepat, dan aman.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

| Tool | Deskripsi |
|------|-----------|
| **PDF to Word** | Konversi PDF ke dokumen Word (.docx) |
| **Word to PDF** | Konversi Word (.doc/.docx) ke PDF |
| **Image to PDF** | Konversi gambar (JPG, PNG, WebP, GIF) ke PDF |
| **PDF to Image** | Konversi halaman PDF ke gambar PNG |

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **PDF Processing**: 
  - `pdf-lib` - Membuat dan memodifikasi PDF
  - `pdfjs-dist` - Render PDF ke gambar (client-side)
  - `docx` - Membuat dokumen Word
  - `mammoth` - Membaca dokumen Word
- **Image Processing**: Sharp

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/rizkykr/rizkypdf.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔧 Build

```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## ☁️ Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rizkykr/rizkypdf)

1. Push ke GitHub
2. Import project di Vercel
3. Deploy otomatis setiap push ke main branch

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── convert/          # PDF to Word API
│   │   ├── image-to-pdf/     # Image to PDF API
│   │   └── word-to-pdf/      # Word to PDF API
│   ├── pdf-to-image/         # PDF to Image (client-side)
│   └── ...
├── components/
│   ├── converter/            # Converter components
│   ├── layout/               # Header, Footer
│   └── ui/                   # UI components (shadcn)
└── lib/
    └── utils.ts
```

## 🔒 Privacy

- File diproses secara lokal atau di server sementara
- Tidak ada file yang disimpan permanen
- PDF to Image diproses langsung di browser (tidak dikirim ke server)

## 📄 License

MIT License - Rizky Kurniawan

---

**RizkyPDF** - Made with ❤️ in Medan, Indonesia
