# Panduan Deployment ke Vercel

## 📋 Prasyarat
- Akun GitHub
- Akun Vercel (daftar di [vercel.com](https://vercel.com))
- Project sudah siap di local

## 🚀 Langkah-langkah Deployment

### 1. Setup Database di Railway (Opsional tapi Recommended untuk Production)

**Untuk Database Production (PostgreSQL/MySQL):**

1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub
3. Klik **"New Project"** → **"Provision PostgreSQL"** atau **"Provision MySQL"**
4. Database akan dibuat otomatis
5. Klik database → **Variables** tab
6. Copy `DATABASE_URL`:
   ```
   postgresql://postgres:password@containers.railway.app:port/railway
   ```

### 2. Update Prisma Schema (Jika Pakai Railway Database)

Edit file `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Ganti ke "postgresql" atau "mysql"
  url      = env("DATABASE_URL")
}
```

### 3. Test Build di Local

```bash
# Test build
bun run build

# Jika ada error, fix dulu
bun run lint
```

### 4. Push ke GitHub

```bash
# Init git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Buat repository baru di GitHub, lalu:
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 5. Import ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan GitHub
2. Klik **"Add New"** → **"Project"**
3. Pilih repository dari GitHub
4. Klik **"Import"**

### 6. Konfigurasi Environment Variables di Vercel

Di halaman **Configure Project**:

Scroll ke **Environment Variables** dan tambahkan:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `file:./db/custom.db` atau dari Railway | All (Production, Preview, Development) |

**Jika Pakai Railway:**
- Paste `DATABASE_URL` dari Railway
- Contoh: `postgresql://postgres:password@containers.railway.app:5432/railway`

**Jika Cuma Pakai SQLite (untuk Demo):**
- Gunakan: `file:./db/custom.db`

### 7. Deploy

1. Klik **"Deploy"**
2. Tunggu 1-2 menit
3. Deploy akan selesai dan dapat URL seperti: `https://your-project.vercel.app`

### 8. Push Database Schema (Jika Pakai Railway Database)

```bash
# Di local, set DATABASE_URL ke Railway di .env
# Lalu:
bun run db:push
```

## 🔄 Auto-Deployment

Setiap kali Anda push ke branch `main` di GitHub, Vercel akan otomatis:
1. Pull code terbaru
2. Run `npm install` (atau `bun install`)
3. Run `prisma generate` (karena ada `postinstall` script)
4. Build project
5. Deploy ke production

## 📝 Environment Variables

### Development (Local)
```env
DATABASE_URL=file:./db/custom.db
```

### Production dengan Railway
```env
DATABASE_URL=postgresql://postgres:password@containers.railway.app:5432/railway
```

### Production dengan Vercel Postgres
```env
DATABASE_URL=postgres://user:pass@host/dbname
```

## 🐛 Troubleshooting

### Build Failed
1. Cek log build di Vercel dashboard
2. Pastikan `DATABASE_URL` sudah di-set
3. Cek apakah Prisma schema valid

### Database Connection Error
1. Pastikan `DATABASE_URL` di Vercel environment variables sudah benar
2. Jika pakai Railway, pastikan database sudah aktif

### 500 Error di Production
1. Cek Vercel logs
2. Pastikan database migration sudah dijalankan
3. Cek apakah API routes valid

## 📊 Monitoring

- **Vercel Dashboard**: Cek deployment logs, analytics
- **Railway Dashboard** (jika pakai): Cek database metrics

## 💡 Tips

1. **Database Persistence**:
   - SQLite di Vercel akan hilang tiap deploy (hanya untuk demo)
   - Gunakan Railway/Vercel Postgres untuk production

2. **Environment Variables**:
   - Jangan commit `.env` ke Git
   - Set di Vercel dashboard, bukan di file code

3. **Multiple Environments**:
   - Vercel support preview deployments untuk setiap PR
   - Bisa set environment variables berbeda untuk Preview/Production

## 🔗 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Railway Docs](https://docs.railway.app)
