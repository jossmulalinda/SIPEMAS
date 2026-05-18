import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const body = await request.json()
    const { kode, nama, bobot, sifat } = body

    if (!kode || !nama || !bobot || !sifat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if kode already exists (excluding current record)
    const existingKriteria = await db.kriteria.findFirst({
      where: {
        kode,
        id: { not: id },
      },
    })

    if (existingKriteria) {
      return NextResponse.json({ error: 'Kode kriteria sudah ada' }, { status: 409 })
    }

    const kriteriaItem = await db.kriteria.update({
      where: { id },
      data: {
        kode,
        nama,
        bobot: parseFloat(bobot),
        sifat,
      },
    })

    return NextResponse.json(kriteriaItem)
  } catch (error) {
    console.error('Error updating kriteria:', error)
    return NextResponse.json({ error: 'Failed to update kriteria' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    await db.kriteria.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Kriteria deleted successfully' })
  } catch (error) {
    console.error('Error deleting kriteria:', error)
    return NextResponse.json({ error: 'Failed to delete kriteria' }, { status: 500 })
  }
}
