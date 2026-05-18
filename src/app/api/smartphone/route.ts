import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const smartphones = await db.smartphone.findMany()
    // Sort using natural sort algorithm (A1, A2, ..., A9, A10, A11)
    const sortedSmartphones = sortByCode(smartphones)
    return NextResponse.json(sortedSmartphones, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error fetching smartphones:', error)
    return NextResponse.json({ error: 'Failed to fetch smartphones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, harga, ram, storage, baterai, kamera } = body

    if (!nama || !harga || !ram || !storage || !baterai || !kamera) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get all smartphones to determine the next code
    const allSmartphones = await db.smartphone.findMany({
      orderBy: { id: 'asc' },
    })

    // Generate next sequential code (A1, A2, A3, ...)
    const nextCode = `A${allSmartphones.length + 1}`

    const smartphone = await db.smartphone.create({
      data: {
        kode: nextCode,
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

export async function DELETE() {
  try {
    // Delete all smartphones
    await db.smartphone.deleteMany({})

    return NextResponse.json({
      message: 'Semua data smartphone berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting all smartphones:', error)
    return NextResponse.json({ error: 'Failed to delete all smartphones' }, { status: 500 })
  }
}
