import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateSAW } from '@/lib/calculations/saw'

export async function POST(request: NextRequest) {
  try {
    // Clear existing results
    await db.hasilSAW.deleteMany()

    // Get data
    const smartphones = await db.smartphone.findMany()
    const kriteria = await db.kriteria.findMany()

    if (smartphones.length === 0 || kriteria.length === 0) {
      return NextResponse.json(
        { error: 'No smartphones or kriteria data available' },
        { status: 400 }
      )
    }

    // Calculate
    const results = await calculateSAW(smartphones, kriteria)

    // Save to database
    for (const result of results) {
      await db.hasilSAW.create({
        data: {
          smartphone: result.smartphone,
          nilai: result.nilai,
          ranking: result.ranking,
        },
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error calculating SAW:', error)
    return NextResponse.json({ error: 'Failed to calculate SAW' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.hasilSAW.findMany({
      orderBy: { ranking: 'asc' },
    })
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching SAW results:', error)
    return NextResponse.json({ error: 'Failed to fetch SAW results' }, { status: 500 })
  }
}
