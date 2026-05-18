import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.hasilGP.deleteMany()
  await prisma.hasilPM.deleteMany()
  await prisma.hasilSMART.deleteMany()
  await prisma.hasilSAW.deleteMany()
  await prisma.profilIdeal.deleteMany()
  await prisma.smartphone.deleteMany()
  await prisma.kriteria.deleteMany()

  console.log('✅ Cleared existing data')

  // Seed Kriteria
  const kriteriaData = [
    { kode: 'C1', nama: 'Harga', bobot: 0.30, sifat: 'cost' },
    { kode: 'C2', nama: 'RAM', bobot: 0.25, sifat: 'benefit' },
    { kode: 'C3', nama: 'Storage', bobot: 0.20, sifat: 'benefit' },
    { kode: 'C4', nama: 'Baterai', bobot: 0.15, sifat: 'benefit' },
    { kode: 'C5', nama: 'Kamera', bobot: 0.10, sifat: 'benefit' },
  ]

  for (const k of kriteriaData) {
    await prisma.kriteria.create({ data: k })
  }
  console.log('✅ Created kriteria')

  // Seed Smartphone
  const smartphoneData = [
    { kode: 'A1', nama: 'Samsung Galaxy A15', harga: 2800000, ram: 8, storage: 128, baterai: 5000, kamera: 50 },
    { kode: 'A2', nama: 'Xiaomi Redmi Note 13', harga: 3000000, ram: 8, storage: 256, baterai: 5000, kamera: 108 },
    { kode: 'A3', nama: 'Infinix Note 40', harga: 2700000, ram: 8, storage: 256, baterai: 5000, kamera: 108 },
    { kode: 'A4', nama: 'Realme Narzo 60x', harga: 2500000, ram: 6, storage: 128, baterai: 5000, kamera: 50 },
    { kode: 'A5', nama: 'Vivo Y28', harga: 3200000, ram: 8, storage: 128, baterai: 6000, kamera: 50 },
  ]

  for (const s of smartphoneData) {
    await prisma.smartphone.create({ data: s })
  }
  console.log('✅ Created smartphones')

  // Seed Profil Ideal untuk Profile Matching
  await prisma.profilIdeal.create({
    data: {
      harga: 2800000,
      ram: 8,
      storage: 256,
      baterai: 5500,
      kamera: 80,
    },
  })
  console.log('✅ Created profil ideal')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
