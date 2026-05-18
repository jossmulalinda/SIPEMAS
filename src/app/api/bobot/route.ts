import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kriteria = await db.kriteria.findMany({
      orderBy: { kode: 'asc' },
    })
    return NextResponse.json(kriteria)
  } catch (error) {
    console.error('Error fetching bobot:', error)
    return NextResponse.json({ error: 'Failed to fetch bobot' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bobot } = body

    if (!Array.isArray(bobot)) {
      return NextResponse.json({ error: 'Invalid bobot format' }, { status: 400 })
    }

    // Validate total bobot = 1.00
    const total = bobot.reduce((sum: number, item: any) => sum + item.bobot, 0)
    if (Math.abs(total - 1.00) > 0.01) {
      return NextResponse.json(
        { error: `Total bobot must be 1.00, current total: ${total.toFixed(2)}` },
        { status: 400 }
      )
    }

    // Update all kriteria
    for (const item of bobot) {
      await db.kriteria.update({
        where: { id: item.id },
        data: { bobot: parseFloat(item.bobot) },
      })
    }

    const updatedKriteria = await db.kriteria.findMany({
      orderBy: { kode: 'asc' },
    })

    return NextResponse.json(updatedKriteria)
  } catch (error) {
    console.error('Error updating bobot:', error)
    return NextResponse.json({ error: 'Failed to update bobot' }, { status: 500 })
  }
}
