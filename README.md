# Peti — Arsip Pribadi

Website arsip file pribadi: buat folder, unggah apa saja, cari, unduh, ganti nama, dan hapus.
Dibangun dengan Next.js, Supabase (Auth + Database + Storage), dan siap di-deploy ke Vercel.

Dipakai bersama oleh kamu + beberapa orang terpercaya yang kamu undang secara manual — tidak ada pendaftaran publik.

## 1. Siapkan project Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, tempel seluruh isi file `supabase/schema.sql`, lalu jalankan (Run).
   Ini akan membuat tabel `folders` & `files`, aturan keamanan (RLS), dan bucket storage `archive` (private).
3. Buka **Authentication > Providers**, pastikan **Email** aktif.
4. Buka **Authentication > Settings**, matikan opsi **"Allow new users to sign up"**.
   Ini penting supaya orang lain tidak bisa mendaftar sendiri — hanya orang yang kamu undang yang bisa punya akun.
5. Buka **Authentication > Users**, klik **Invite user**, masukkan email orang-orang terpercayamu satu per satu.
   Mereka akan menerima email undangan berisi link untuk membuat kata sandi pertama kali.

## 2. Jalankan di komputer (opsional, untuk uji coba lokal)

```bash
npm install
cp .env.local.example .env.local
```

Isi `.env.local` dengan **Project URL** dan **anon public key** dari Supabase Dashboard
(**Project Settings > API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxx
```

Lalu:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 3. Unggah ke GitHub

```bash
git init
git add .
git commit -m "Peti: arsip pribadi"
git branch -M main
git remote add origin https://github.com/USERNAME/peti.git
git push -u origin main
```

## 4. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo GitHub `peti` tadi.
2. Di bagian **Environment Variables**, tambahkan dua variabel yang sama seperti di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Klik **Deploy**.
4. Setelah selesai, salin domain Vercel-mu (misalnya `https://peti-kamu.vercel.app`).
5. Kembali ke Supabase Dashboard → **Authentication > URL Configuration**, isi:
   - **Site URL**: domain Vercel-mu
   - **Redirect URLs**: tambahkan domain Vercel-mu juga
   
   Ini supaya link undangan & login berjalan benar di domain production, bukan localhost.

## Fitur

- 🔐 Login khusus untuk orang yang diundang (tanpa pendaftaran publik)
- 📁 Folder bersarang tanpa batas kedalaman
- ⬆️ Unggah dengan drag & drop atau tombol, mendukung banyak file sekaligus
- 🔍 Pencarian real-time di seluruh arsip (nama file & folder)
- 👁️ Pratinjau langsung untuk gambar & PDF
- ⬇️ Unduh file kapan saja
- ✏️ Ganti nama file & folder
- 🗑️ Hapus file & folder (folder terhapus beserta seluruh isinya)
- 🎨 Tampilan gradient warna-warni dengan transisi halus

## Catatan tentang batas Supabase gratis

Paket gratis Supabase memberi sekitar 1 GB storage dan 500 MB database — cukup untuk arsip pribadi
skala kecil-menengah. Kalau butuh lebih besar, tinggal upgrade ke paket Pro di Supabase Dashboard,
tidak perlu ubah kode sama sekali.

## Struktur proyek

```
app/                 Halaman Next.js (login & dashboard arsip)
components/          Komponen UI (kartu folder/file, modal, dsb.)
lib/                 Klien Supabase, tipe data, dan fungsi akses data
supabase/schema.sql  Skema database + storage untuk dijalankan di Supabase
```
