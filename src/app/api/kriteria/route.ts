import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kriteria = await db.kriteria.findMany({
      orderBy: { kode: 'asc' },
    })
    return NextResponse.json(kriteria)
  } catch (error) {
    console.error('Error fetching kriteria:', error)
    return NextResponse.json({ error: 'Failed to fetch kriteria' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kode, nama, bobot, sifat } = body

    if (!kode || !nama || !bobot || !sifat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const kriteriaItem = await db.kriteria.create({
      data: {
        kode,
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
