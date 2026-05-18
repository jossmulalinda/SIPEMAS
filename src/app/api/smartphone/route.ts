import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const smartphones = await db.smartphone.findMany({
      orderBy: { kode: 'asc' },
    })
    return NextResponse.json(smartphones)
  } catch (error) {
    console.error('Error fetching smartphones:', error)
    return NextResponse.json({ error: 'Failed to fetch smartphones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kode, nama, harga, ram, storage, baterai, kamera } = body

    if (!kode || !nama || !harga || !ram || !storage || !baterai || !kamera) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const smartphone = await db.smartphone.create({
      data: {
        kode,
        nama,
        harga: parseFloat(harga),
        ram: parseFloat(ram),
        storage: parseFloat(storage),
        baterai: parseFloat(baterai),
        kamera: parseFloat(kamera),
      },
    })

    return NextResponse.json(smartphone, { status: 201 })
  } catch (error) {
    console.error('Error creating smartphone:', error)
    return NextResponse.json({ error: 'Failed to create smartphone' }, { status: 500 })
  }
}
