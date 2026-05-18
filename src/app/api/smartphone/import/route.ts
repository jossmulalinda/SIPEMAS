import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { smartphones } = body

    if (!Array.isArray(smartphones) || smartphones.length === 0) {
      return NextResponse.json(
        { error: 'Data smartphones harus berupa array yang tidak kosong' },
        { status: 400 }
      )
    }

    let imported = 0
    let skipped = 0

    for (const smartphone of smartphones) {
      const { nama, harga, ram, storage, baterai, kamera } = smartphone

      // Validate required fields
      if (!nama || !harga || !ram || !storage || !baterai || !kamera) {
        continue
      }

      // Check if smartphone with same name already exists
      const existingSmartphone = await db.smartphone.findFirst({
        where: {
          nama: nama.trim(),
        },
      })

      if (existingSmartphone) {
        skipped++
        continue
      }

      // Create new smartphone
      await db.smartphone.create({
        data: {
          nama: nama.trim(),
          harga: parseFloat(harga),
          ram: parseFloat(ram),
          storage: parseFloat(storage),
          baterai: parseFloat(baterai),
          kamera: parseFloat(kamera),
        },
      })

      imported++
    }

    // If any smartphones were added, renumber all codes
    if (imported > 0) {
      const allSmartphones = await db.smartphone.findMany({
        orderBy: { id: 'asc' },
      })

      // Update codes sequentially (A1, A2, A3, ...)
      for (let i = 0; i < allSmartphones.length; i++) {
        const newCode = `A${i + 1}`
        if (allSmartphones[i].kode !== newCode) {
          await db.smartphone.update({
            where: { id: allSmartphones[i].id },
            data: { kode: newCode },
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Import selesai',
      imported,
      skipped,
    })
  } catch (error) {
    console.error('Error importing smartphones:', error)
    return NextResponse.json(
      { error: 'Gagal mengimpor data smartphone' },
      { status: 500 }
    )
  }
}
