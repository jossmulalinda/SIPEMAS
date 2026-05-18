import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const kriteria = await db.kriteria.findMany()
    // Sort using natural sort algorithm (C1, C2, ..., C9, C10, C11)
    const sortedKriteria = sortByCode(kriteria)
    return NextResponse.json(sortedKriteria)
  } catch (error) {
    console.error('Error fetching kriteria:', error)
    return NextResponse.json({ error: 'Failed to fetch kriteria' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, bobot, sifat } = body

    if (!nama || !bobot || !sifat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get all kriteria to determine the next code
    const allKriteria = await db.kriteria.findMany({
      orderBy: { id: 'asc' },
    })

    // Generate next sequential code (C1, C2, C3, ...)
    const nextCode = `C${allKriteria.length + 1}`

    const kriteriaItem = await db.kriteria.create({
      data: {
        kode: nextCode,
        nama,
        bobot: parseFloat(bobot),
        sifat,
      },
    })

    return NextResponse.json(kriteriaItem, { status: 201 })
  } catch (error) {
    console.error('Error creating kriteria:', error)
    return NextResponse.json({ error: 'Failed to create kriteria' }, { status: 500 })
  }
}
