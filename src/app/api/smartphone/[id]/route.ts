import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const body = await request.json()
    const { kode, nama, harga, ram, storage, baterai, kamera } = body

    if (!kode || !nama || !harga || !ram || !storage || !baterai || !kamera) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if kode already exists (excluding current record)
    const existingSmartphone = await db.smartphone.findFirst({
      where: {
        kode,
        id: { not: id },
      },
    })

    if (existingSmartphone) {
      return NextResponse.json({ error: 'Kode smartphone sudah ada' }, { status: 409 })
    }

    const smartphone = await db.smartphone.update({
      where: { id },
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

    return NextResponse.json(smartphone)
  } catch (error) {
    console.error('Error updating smartphone:', error)
    return NextResponse.json({ error: 'Failed to update smartphone' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    // Get the deleted smartphone to know its position
    const deletedSmartphone = await db.smartphone.findUnique({
      where: { id },
    })

    if (!deletedSmartphone) {
      return NextResponse.json({ error: 'Smartphone not found' }, { status: 404 })
    }

    // Delete the smartphone
    await db.smartphone.delete({
      where: { id },
    })

    // Renumber all smartphones sequentially
    const allSmartphones = await db.smartphone.findMany({
      orderBy: { id: 'asc' },
    })

    // Update codes sequentially (A1, A2, A3, ...)
    for (let i = 0; i < allSmartphones.length; i++) {
      const newCode = `A${i + 1}`
      if (allSmartphones[i].kode !== newCode) {
        await db.smartphone.update({
          where: { id: allSmartphones[i].id },
          data: { kode: newCode },
        })
      }
    }

    return NextResponse.json({ message: 'Smartphone deleted successfully' })
  } catch (error) {
    console.error('Error deleting smartphone:', error)
    return NextResponse.json({ error: 'Failed to delete smartphone' }, { status: 500 })
  }
}
