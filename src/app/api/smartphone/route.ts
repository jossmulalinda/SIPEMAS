import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const smartphones = await db.smartphone.findMany()
    // Sort using natural sort algorithm (A1, A2, ..., A9, A10, A11)
    const sortedSmartphones = sortByCode(smartphones)
    return NextResponse.json(sortedSmartphones)
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

    // Check if kode already exists
    const existingSmartphone = await db.smartphone.findUnique({
      where: { kode },
    })

    if (existingSmartphone) {
      return NextResponse.json({ error: 'Kode smartphone sudah ada' }, { status: 409 })
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
