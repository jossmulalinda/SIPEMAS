'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Smartphone {
  id: number
  kode: string
  nama: string
  harga: number
  ram: number
  storage: number
  baterai: number
  kamera: number
}

export default function AlternatifPage() {
  const [smartphones, setSmartphones] = useState<Smartphone[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Smartphone | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    harga: '',
    ram: '',
    storage: '',
    baterai: '',
    kamera: '',
  })

  const fetchSmartphones = async () => {
    try {
      const response = await fetch('/api/smartphone')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSmartphones(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data smartphone',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmartphones()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate numeric fields
    const harga = parseFloat(formData.harga)
    const ram = parseFloat(formData.ram)
    const storage = parseFloat(formData.storage)
    const baterai = parseFloat(formData.baterai)
    const kamera = parseFloat(formData.kamera)

    if (isNaN(harga) || harga <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Harga harus berupa angka positif',
        variant: 'destructive',
      })
      return
    }

    if (isNaN(ram) || ram <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'RAM harus berupa angka positif',
        variant: 'destructive',
      })
      return
    }

    if (isNaN(storage) || storage <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Storage harus berupa angka positif',
        variant: 'destructive',
      })
      return
    }

    if (isNaN(baterai) || baterai <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Baterai harus berupa angka positif',
        variant: 'destructive',
      })
      return
    }

    if (isNaN(kamera) || kamera <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Kamera harus berupa angka positif',
        variant: 'destructive',
      })
      return
    }

    try {
      const url = editingItem ? `/api/smartphone/${editingItem.id}` : '/api/smartphone'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          toast({
            title: 'Validasi Gagal',
            description: errorData.error || 'Kode smartphone sudah ada',
            variant: 'destructive',
          })
          return
        }
        throw new Error('Failed to save')
      }

      toast({
        title: 'Sukses',
        description: editingItem ? 'Smartphone berhasil diperbarui' : 'Smartphone berhasil ditambahkan',
      })

      setDialogOpen(false)
      resetForm()
      fetchSmartphones()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (item: Smartphone) => {
    setEditingItem(item)
    setFormData({
      kode: item.kode,
      nama: item.nama,
      harga: item.harga.toString(),
      ram: item.ram.toString(),
      storage: item.storage.toString(),
      baterai: item.baterai.toString(),
      kamera: item.kamera.toString(),
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus smartphone ini?')) return

    try {
      const response = await fetch(`/api/smartphone/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Sukses',
        description: 'Smartphone berhasil dihapus',
      })

      fetchSmartphones()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus smartphone',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      kode: '',
      nama: '',
      harga: '',
      ram: '',
      storage: '',
      baterai: '',
      kamera: '',
    })
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDialogOpen(false)
      resetForm()
    } else {
      setDialogOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-12 h-12 animate-spin text-[#4F9CF9]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Alternatif Smartphone</h1>
            <p className="text-gray-600 mt-1">Kelola data smartphone yang akan dinilai</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Smartphone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Smartphone' : 'Tambah Smartphone Baru'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Edit data smartphone yang ada' : 'Tambahkan smartphone baru ke dalam sistem'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kode">Kode</Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                      placeholder="Contoh: A11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Smartphone</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Samsung Galaxy S24"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="harga">Harga (Rp)</Label>
                    <Input
                      id="harga"
                      type="number"
                      value={formData.harga}
                      onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                      placeholder="Contoh: 5000000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ram">RAM (GB)</Label>
                    <Input
                      id="ram"
                      type="number"
                      step="0.5"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      placeholder="Contoh: 8"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storage">Storage (GB)</Label>
                    <Input
                      id="storage"
                      type="number"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      placeholder="Contoh: 128"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baterai">Baterai (mAh)</Label>
                    <Input
                      id="baterai"
                      type="number"
                      value={formData.baterai}
                      onChange={(e) => setFormData({ ...formData, baterai: e.target.value })}
                      placeholder="Contoh: 5000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kamera">Kamera (MP)</Label>
                    <Input
                      id="kamera"
                      type="number"
                      value={formData.kamera}
                      onChange={(e) => setFormData({ ...formData, kamera: e.target.value })}
                      placeholder="Contoh: 50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90">
                    {editingItem ? 'Update' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Smartphone</CardTitle>
            <CardDescription>Total {smartphones.length} smartphone tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white">Kode</TableHead>
                    <TableHead className="text-white">Nama</TableHead>
                    <TableHead className="text-white">Harga</TableHead>
                    <TableHead className="text-white">RAM</TableHead>
                    <TableHead className="text-white">Storage</TableHead>
                    <TableHead className="text-white">Baterai</TableHead>
                    <TableHead className="text-white">Kamera</TableHead>
                    <TableHead className="text-white text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smartphones.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>Rp {item.harga.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.ram} GB</TableCell>
                      <TableCell>{item.storage} GB</TableCell>
                      <TableCell>{item.baterai} mAh</TableCell>
                      <TableCell>{item.kamera} MP</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
