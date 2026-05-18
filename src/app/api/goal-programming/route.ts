import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateGoalProgramming } from '@/lib/calculations/goalProgramming'

export async function POST(request: NextRequest) {
  try {
    // Clear existing results
    await db.hasilGP.deleteMany()

    // Get data
    const smartphones = await db.smartphone.findMany()
    const profilIdeal = await db.profilIdeal.findFirst()

    if (smartphones.length === 0) {
      return NextResponse.json({ error: 'No smartphones data available' }, { status: 400 })
    }

    // Target values from database or defaults
    const target = profilIdeal ? {
      harga: profilIdeal.harga,
      ram: profilIdeal.ram,
      storage: profilIdeal.storage,
      baterai: profilIdeal.baterai,
      kamera: profilIdeal.kamera,
    } : {
      harga: 2500000,
      ram: 6,
      storage: 128,
      baterai: 5000,
      kamera: 50,
    }

    // Calculate
    const results = await calculateGoalProgramming(smartphones, target)

    // Save to database
    for (const result of results) {
      await db.hasilGP.create({
        data: {
          smartphone: result.smartphone,
          jarak: result.jarak,
          waktu: result.waktu,
          biaya: result.biaya,
          nilaiZ: result.nilaiZ,
          ranking: result.ranking,
        },
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error calculating Goal Programming:', error)
    return NextResponse.json({ error: 'Failed to calculate Goal Programming' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.hasilGP.findMany({
      orderBy: { ranking: 'asc' },
    })
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error fetching GP results:', error)
    return NextResponse.json({ error: 'Failed to fetch GP results' }, { status: 500 })
  }
}
