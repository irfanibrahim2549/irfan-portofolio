# 📚 Project Memory & Technical Documentation

Rangkuman lengkap mengenai spesifikasi teknis, arsitektur projek, struktur folder, skema database, optimasi performa, hingga panduan alur kerja Git (Staging & Production) untuk projek **Portofolio**.

---

## 🎯 Ringkasan Projek
- **Nama Projek**: Irfan Portfolio & Creative Works
- **Lokasi Kode**: `D:\Project\Portofolio`
- **Repository GitHub**: [irfanibrahim2549/irfan-portofolio](https://github.com/irfanibrahim2549/irfan-portofolio)
- **Tujuan**: Portofolio modern berbasis Next.js App Router dengan panel CMS Admin interaktif (*Real-Time Live Preview* & *Case Study Builder*) serta integrasi Supabase.

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components + Client Components |
| **Bahasa** | TypeScript | Type safety penuh di seluruh skema & komponen |
| **Styling & Theme** | Tailwind CSS v4 + `next-themes` | Glassmorphism, Dark Mode (`#080808`), Light Mode (`#fafafa`) |
| **Font Family** | **Plus Jakarta Sans** | Di-load via `next/font/google` di `src/app/layout.tsx` |
| **Primary Color** | **High-Contrast Blue** | Light Mode (`#2563eb`), Dark Mode (`#3b82f6`) |
| **Database & Auth** | Supabase (PostgreSQL + RLS + Storage) | Table `profiles`, `projects`, `messages`, Storage `portfolio-assets` |
| **Icon Set** | Lucide React | Ikon UI responsif |

---

## 📁 Arsitektur & Struktur Folder

```text
D:\Project\Portofolio
├── public/
│   └── profile.jpg                 # Foto profil utama bagian Hero
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Admin Login via Supabase Auth
│   │   │   ├── messages/page.tsx   # Pesan masuk dari visitor
│   │   │   ├── profile/page.tsx    # Manager Profil & Live Availability Badge
│   │   │   └── projects/page.tsx   # Admin CMS (Split-screen Live Preview & Reorderable Builder)
│   │   ├── projects/
│   │   │   ├── page.tsx            # Catalog All Works (Thumbnail 4:3)
│   │   │   └── [slug]/page.tsx     # Detail Case Study Page (< 30ms render time)
│   │   ├── globals.css             # Desain Sistem, CSS Variables & Blue Accent Tokens
│   │   ├── layout.tsx              # Root Layout dengan Plus Jakarta Sans Font & ThemeProvider
│   │   ├── page.tsx                # Visitor Landing Page (Hero, Projects, TechStack, Contact)
│   │   └── providers.tsx           # Next-themes ThemeProvider Client Wrapper
│   ├── components/
│   │   ├── ContactForm.tsx         # Form kontak visitor yang terhubung ke tabel messages
│   │   ├── Footer.tsx              # Modern footer dengan copyright & quick links
│   │   ├── Hero.tsx                # Hero section dengan foto profil, name gradient, & availability status
│   │   ├── Icons.tsx               # Ikon kustom GitHub, LinkedIn, dll
│   │   ├── MarkdownRenderer.tsx    # Component parser Markdown & multi-section renderer
│   │   ├── Navbar.tsx              # Floating Pill Navbar (Home, Work, Skills, Contact, Admin)
│   │   ├── Projects.tsx            # Featured Projects catalog grid dengan filter kategori
│   │   ├── TechStack.tsx           # Visualisasi keahlian & teknologi
│   │   └── ThemeToggle.tsx         # Toggle switch Light/Dark mode
│   ├── lib/
│   │   ├── data.ts                 # Fallback data default projek & profil
│   │   └── supabase/
│   │       ├── client.ts           # Browser Supabase client & config check
│   │       └── server.ts           # Ultra-fast createPublicClient() & authenticated server client
│   └── types/
│       └── database.ts             # Interface TypeScript (Project, CaseStudySection, Profile, Message)
├── .env.local                      # Supabase Credentials (URL & Anon Key)
├── STAGING_GUIDE.md                # Panduan alur kerja Staging & Production
└── memory.md                       # Dokumentasi arsitektur & memori teknis projek
```

---

## 💾 Database & Storage Schema (Supabase)

### 1. Tabel `projects`
- `id`: `uuid` (Primary Key)
- `title`: `text`
- `slug`: `text` (Unique)
- `category`: `text` (`Web Development`, `Design`, `Mobile App`)
- `description`: `text` (Short description)
- `content`: `text` (JSON serialized array dari `CaseStudySection[]` atau raw Markdown)
- `image_url`: `text` (Thumbnail URL 4:3)
- `tags`: `text[]`
- `demo_url`: `text` (Opsional)
- `github_url`: `text` (Opsional)
- `is_featured`: `boolean`
- `order_index`: `int4`
- `created_at`: `timestamptz`

### 2. Storage Bucket `portfolio-assets`
- Menginang file gambar thumbnail projek & aset media.
- **Storage Policy**: RLS diatur mengizinkan `SELECT`, `INSERT`, `UPDATE`, `DELETE` untuk pengunggahan file lancar dari Admin Panel.

---

## ⚡ Optimasi Performa & Aksesibilitas

1. **Lightweight Public Supabase Client (`createPublicClient`)**:
   - Memisahkan query data publik dari pembacaan cookie server `cookies()`.
   - Mengeliminasi *overhead handshake* sehingga rendering halaman detail (`/projects/[slug]`) selesai dalam **< 30ms** (instan tanpa jeda loading).
2. **Next.js Link Prefetching (`prefetch={true}`)**:
   - Card projek pada katalog secara otomatis melakukan *prefetch* data di latar belakang saat kursor mendekati card.
3. **Kontras Aksesibilitas WCAG**:
   - Kombinasi warna biru `#2563eb` (Light Mode) dan `#3b82f6` (Dark Mode) dirancang dengan kontras tinggi sehingga teks selalu jelas terbaca di segala mode latar belakang.

---

## 🌿 Panduan Branch Git & Workflow Staging

Repository GitHub: **`irfanibrahim2549/irfan-portofolio`**

### Pembagian Branch:
- **`main`**: Branch **Production** utama (Default). Digunakan untuk rilis website live publik.
- **`staging`**: Branch **Staging** untuk uji coba. Tempat mengembangkan & mengetes update baru.

### Langkah Pengembangan Fitur Baru:
```bash
# 1. Pindah ke branch staging
git checkout staging

# 2. Kerjakan update & commit perubahan
git add .
git commit -m "feat: deskripsi perubahan"

# 3. Push ke GitHub staging
git push origin staging
```

### Memindahkan Update ke Production:
Saat update di `staging` sudah 100% aman dan diuji:
```bash
# Merge staging ke main
git checkout main
git merge staging
git push origin main

# Kembali ke staging
git checkout staging
```

---
*Dokumentasi ini dibuat otomatis sebagai acuan teknis pengembangan projek Portofolio.*
