# 🚀 Staging & Production Workflow Guide

Panduan alur kerja (*workflow*) untuk menjaga agar update fitur/konten baru diuji terlebih dahulu di lingkungan **Staging** sebelum dipublikasikan ke **Production**.

---

## 🌿 Struktur Branch Git

Repository [irfan-portofolio](https://github.com/irfanibrahim2549/irfan-portofolio) memiliki 2 branch utama:

| Branch | Fungsi | Auto Deploy Trigger |
| :--- | :--- | :--- |
| **`staging`** | **Lingkungan Uji Coba (Staging)** | Generates Preview URL (misal: `*-staging.vercel.app`) |
| **`main`** | **Lingkungan Live (Production)** | Deploys to Production URL Utama |

---

## 🛠️ Alur Kerja Pengembangan (Step-by-Step)

### 1. Mengembangkan Fitur / Update di Staging
Saat Anda ingin menambah fitur baru atau mengubah desain, pastikan Anda berada di branch `staging`:

```bash
# Pastikan berada di branch staging
git checkout staging

# Buat perubahan / update kodingan Anda...

# Commit dan Push ke branch staging
git add .
git commit -m "feat: tambah fitur baru X"
git push origin staging
```

> **Hasil**: Vercel/Netlify akan otomatis membangun **Preview Link Staging**. Anda bisa mengecek dan mengetes perubahan Anda secara live tanpa mempengaruhi pengunjung di Production.

---

### 2. Memindahkan Update dari Staging ke Production
Setelah fitur di branch `staging` lulus pengujian dan siap dipublikasikan ke pengunjung umum:

#### Cara A: Lewat GitHub Pull Request (Direkomendasikan)
1. Buka [https://github.com/irfanibrahim2549/irfan-portofolio/pulls](https://github.com/irfanibrahim2549/irfan-portofolio/pulls).
2. Klik **New Pull Request**.
3. Set **base**: `main` &larr; **compare**: `staging`.
4. Klik **Create Pull Request** lalu **Merge Pull Request**.

#### Cara B: Lewat Terminal Git
```bash
# Pindah ke main
git checkout main
git pull origin main

# Merge perubahan dari staging
git merge staging

# Push ke main (Triggers Production Deployment)
git push origin main

# Kembali ke staging untuk pengerjaan berikutnya
git checkout staging
```

---

## 💡 Konfigurasi Hosting (Vercel / Netlify)

1. Import repo `irfan-portofolio` di **Vercel Dashboard**.
2. Vercel secara otomatis mendeteksi:
   - **Production Branch**: `main`
   - **Preview / Staging Branch**: `staging`
3. Tambahkan `.env.local` Supabase credentials pada bagian **Environment Variables** (pilih untuk Production, Preview, & Development).
