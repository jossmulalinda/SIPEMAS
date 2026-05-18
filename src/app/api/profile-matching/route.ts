import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateProfileMatching } from '@/lib/calculations/profileMatching'

export async function POST(request: NextRequest) {
  try {
    // Clear existing results
    await db.hasilPM.deleteMany()

    // Get data
    const smartphones = await db.smartphone.findMany()
    const profilIdeal = await db.profilIdeal.findFirst()

    if (smartphones.length === 0) {
      return NextResponse.json({ error: 'No smartphones data available' }, { status: 400 })
    }

    if (!profilIdeal) {
      return NextResponse.json({ error: 'No profil ideal data available' }, { status: 400 })
    }

    // Calculate
    const results = await calculateProfileMatching(smartphones, profilIdeal)

    // Save to database
    for (const result of results) {
      await db.hasilPM.create({
        data: {
          smartphone: result.smartphone,
          nilai: result.nilai,
          ranking: result.ranking,
        },
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error calculating Profile Matching:', error)
    return NextResponse.json({ error: 'Failed to calculate Profile Matching' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.hasilPM.findMany({
      orderBy: { ranking: 'asc' },
    })
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching PM results:', error)
    return NextResponse.json({ error: 'Failed to fetch PM results' }, { status: 500 })
  }
}
