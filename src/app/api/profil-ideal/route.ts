import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const profilIdeal = await db.profilIdeal.findMany()
    return NextResponse.json(profilIdeal, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error fetching Profil Ideal:', error)
    return NextResponse.json({ error: 'Failed to fetch Profil Ideal' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { harga, ram, storage, baterai, kamera } = body

    // Clear existing profil ideal
    await db.profilIdeal.deleteMany()

    // Create new profil ideal
    const profilIdeal = await db.profilIdeal.create({
      data: {
        harga: Number(harga),
        ram: Number(ram),
        storage: Number(storage),
        baterai: Number(baterai),
        kamera: Number(kamera),
      },
    })

    return NextResponse.json(profilIdeal)
  } catch (error) {
    console.error('Error creating Profil Ideal:', error)
    return NextResponse.json({ error: 'Failed to create Profil Ideal' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, harga, ram, storage, baterai, kamera } = body

    const profilIdeal = await db.profilIdeal.update({
      where: { id },
      data: {
        harga: Number(harga),
        ram: Number(ram),
        storage: Number(storage),
        baterai: Number(baterai),
        kamera: Number(kamera),
      },
    })

    return NextResponse.json(profilIdeal)
  } catch (error) {
    console.error('Error updating Profil Ideal:', error)
    return NextResponse.json({ error: 'Failed to update Profil Ideal' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await db.profilIdeal.deleteMany()
    return NextResponse.json({ message: 'Profil Ideal deleted successfully' })
  } catch (error) {
    console.error('Error deleting Profil Ideal:', error)
    return NextResponse.json({ error: 'Failed to delete Profil Ideal' }, { status: 500 })
  }
}
