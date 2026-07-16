# Pembukuan DSU - RAM Singkut

Aplikasi pembukuan harian berbasis Next.js + Supabase.

## Fitur

- Form input KAS (Debet/Kredit/Saldo)
- Form input Penjualan Buah (berat, harga, pencairan)
- Form input Pencairan (deposit, kekurangan bayar)
- Dashboard dengan ringkasan total + tabel per kategori
- Edit & delete langsung dari dashboard

---

## A. Jalankan di Local dengan Database Supabase

### 1. Persiapan Awal

Buka terminal di folder project:

```bash
cd /Users/ngurahindrapurnayasa/Documents/Project\ Ayi/pembukuan-dsu
```

Install dependencies:

```bash
npm install
```

### 2. Buat Project Supabase

1. Buka https://supabase.com
2. Login dengan akun Google/GitHub
3. Klik **New Project**
4. Pilih organization → beri nama project → set password database (simpan passwordnya)
5. Tunggu project ready

### 3. Buat Tabel di Supabase

1. Di dashboard Supabase, buka menu **SQL Editor**
2. Klik **New query**
3. Copy-paste isi file `supabase/schema.sql` dari project ini
4. Klik **Run**

File schema membuat 3 tabel:
- `kas`
- `penjualan`
- `pencairan`

### 4. Ambil Credential Supabase

Supabase memindahkan API URL dan key ke 2 tempat terpisah.

#### A. API URL (Data API URL)

1. Di dashboard Supabase, klik menu **Integrations** (samping kiri)
2. Pilih tab **Data API**
3. Copy **URL** → isi ke `NEXT_PUBLIC_SUPABASE_URL`

#### B. API Key (anon/public key)

1. Di dashboard Supabase, klik ikon **roda gigi / Settings** (samping kiri bawah)
2. Pilih **API Keys** di bawah bagian Project Settings
3. Copy nilai **anon public** API key → isi ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Setup Environment Variable Local

Buat file `.env.local` dari template:

```bash
cp .env.example .env.local
```

Isi file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Ganti `https://xxxx.supabase.co` dan `eyJ...` dengan credential yang sudah dicopy.

### 6. Jalankan Dev Server

```bash
npm run dev
```

Buka browser di http://localhost:3000

---

## B. Deploy ke Vercel

### 1. Push ke GitHub

Jika belum punya repo remote, buat dulu repo kosong di GitHub, lalu:

```bash
git remote add origin https://github.com/USERNAME/NAMA_REPO.git
git branch -M main
git push -u origin main
```

### 2. Import Project di Vercel

1. Buka https://vercel.com/new
2. Login dengan akun yang sama dengan GitHub
3. Pilih repo project ini
4. Klik **Import**

### 3. Konfigurasi Environment Variables

Di halaman konfigurasi Vercel, tambahkan environment variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

Pastikan semua environment variables sudah diisi sebelum klik **Deploy**.

### 4. Deploy

Klik **Deploy** dan tunggu proses selesai.

Setelah sukses, Vercel akan memberikan URL seperti `https://nama-project.vercel.app`.

### 5. Update URL Supabase (Opsional)

Jika nanti ganti Supabase project, update environment variables di Vercel:

1. Buka project di Vercel
2. Masuk ke **Settings** → **Environment Variables**
3. Edit atau tambahkan variables yang baru
4. Redeploy project

---

## Catatan

- `ponytail`: belum ada auth/RLS; tambahkan jika nanti multi-user.
- `ponytail`: saldo KAS direcompute semua saat edit; ok untuk data kecil.
