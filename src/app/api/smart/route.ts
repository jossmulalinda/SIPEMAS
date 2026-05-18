import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateSMART } from '@/lib/calculations/smart'

export async function POST(request: NextRequest) {
  try {
    // Clear existing results
    await db.hasilSMART.deleteMany()

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
    const results = await calculateSMART(smartphones, kriteria)

    // Save to database
    for (const result of results) {
      await db.hasilSMART.create({
        data: {
          smartphone: result.smartphone,
          nilai: result.nilai,
          ranking: result.ranking,
        },
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error calculating SMART:', error)
    return NextResponse.json({ error: 'Failed to calculate SMART' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.hasilSMART.findMany({
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
    console.error('Error fetching SMART results:', error)
    return NextResponse.json({ error: 'Failed to fetch SMART results' }, { status: 500 })
  }
}
