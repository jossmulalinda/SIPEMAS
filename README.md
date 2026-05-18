# SIPEMAS - Sistem Pendukung Keputusan Pemilihan Smartphone

Sistem pendukung keputusan untuk memilih smartphone menggunakan 4 metode: SAW, SMART, Profile Matching, dan Goal Programming.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **State Management**: Zustand + TanStack Query

## 📦 Installation

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env

# Push database schema
bun run db:push

# Run development server
bun run dev
```

## 🛠️ Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push schema to database
bun run db:migrate   # Run migrations
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── alternatif/         # Smartphone management
│   ├── saw/                # SAW method
│   ├── smart/              # SMART method
│   ├── profile-matching/   # Profile Matching method
│   ├── goal-programming/   # Goal Programming method
│   ├── perbandingan/       # Comparison page
│   ├── kriteria/           # Criteria management
│   └── bobot/              # Weight management
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── calculations/       # Decision support algorithms
│   └── db.ts               # Prisma client
└── hooks/                  # Custom React hooks
```

## 🗄️ Database

### Models
- `Smartphone` - Data alternatif smartphone
- `Kriteria` - Data kriteria penilaian
- `ProfilIdeal` - Profil ideal/target
- `HasilSAW` - Hasil perhitungan SAW
- `HasilSMART` - Hasil perhitungan SMART
- `HasilPM` - Hasil perhitungan Profile Matching
- `HasilGP` - Hasil perhitungan Goal Programming

## 🚢 Deployment

Lihat panduan lengkap di [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Vercel

1. Push ke GitHub
2. Import ke [vercel.com](https://vercel.com)
3. Set `DATABASE_URL` di environment variables
4. Deploy!

## 📄 License

Private Project
