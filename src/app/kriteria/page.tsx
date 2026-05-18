'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Kriteria {
  id: number
  kode: string
  nama: string
  bobot: number
  sifat: string
}

export default function KriteriaPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    bobot: '',
    sifat: 'benefit',
  })

  const fetchKriteria = async () => {
    try {
      const response = await fetch('/api/kriteria')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setKriteria(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data kriteria',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKriteria()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate bobot
    const bobot = parseFloat(formData.bobot)
    if (isNaN(bobot) || bobot <= 0 || bobot > 1) {
      toast({
        title: 'Validasi Gagal',
        description: 'Bobot harus berupa angka antara 0 dan 1',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    try {
      const url = editingItem ? `/api/kriteria/${editingItem.id}` : '/api/kriteria'
      const method = editingItem ? 'PUT' : 'POST'

      // When editing, include kode; when adding, kode is auto-generated
      const payload = editingItem ? formData : {
        nama: formData.nama,
        bobot: formData.bobot,
        sifat: formData.sifat,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          toast({
            title: 'Validasi Gagal',
            description: errorData.error || 'Kode kriteria sudah ada',
            variant: 'destructive',
            icon: <XCircle className="h-5 w-5" />,
          })
          return
        }
        throw new Error('Failed to save')
      }

      toast({
        title: 'Sukses',
        description: editingItem ? 'Kriteria berhasil diperbarui' : 'Kriteria berhasil ditambahkan',
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      setDialogOpen(false)
      resetForm()
      fetchKriteria()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    }
  }

  const handleEdit = (item: Kriteria) => {
    setEditingItem(item)
    setFormData({
      kode: item.kode,
      nama: item.nama,
      bobot: item.bobot.toString(),
      sifat: item.sifat,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kriteria ini?')) return

    try {
      const response = await fetch(`/api/kriteria/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Sukses',
        description: 'Kriteria berhasil dihapus',
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      fetchKriteria()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus kriteria',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      kode: '',
      nama: '',
      bobot: '',
      sifat: 'benefit',
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
      <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white"><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="text-white"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead className="text-white"><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="text-white"><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Kriteria Penilaian</h1>
            <p className="text-gray-600 mt-1">Kelola kriteria yang digunakan untuk penilaian smartphone</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kriteria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Edit data kriteria yang ada' : 'Tambahkan kriteria baru ke dalam sistem'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingItem && (
                  <div className="space-y-2">
                    <Label htmlFor="kode">Kode</Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">Kode otomatis diatur oleh sistem</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Kriteria</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Harga"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bobot">Bobot</Label>
                  <Input
                    id="bobot"
                    type="number"
                    step="0.01"
                    value={formData.bobot}
                    onChange={(e) => setFormData({ ...formData, bobot: e.target.value })}
                    placeholder="Contoh: 0.30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sifat">Sifat</Label>
                  <Select value={formData.sifat} onValueChange={(value) => setFormData({ ...formData, sifat: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sifat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="benefit">Benefit (Semakin besar semakin baik)</SelectItem>
                      <SelectItem value="cost">Cost (Semakin kecil semakin baik)</SelectItem>
                    </SelectContent>
                  </Select>
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
            <CardTitle>Daftar Kriteria</CardTitle>
            <CardDescription>Total kriteria: {kriteria.length} | Total bobot: {kriteria.reduce((sum, k) => sum + k.bobot, 0).toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white">Kode</TableHead>
                    <TableHead className="text-white">Nama</TableHead>
                    <TableHead className="text-white">Bobot</TableHead>
                    <TableHead className="text-white">Sifat</TableHead>
                    <TableHead className="text-white text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kriteria.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.bobot.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={item.sifat === 'benefit' ? 'default' : 'secondary'}>
                          {item.sifat === 'benefit' ? 'Benefit' : 'Cost'}
                        </Badge>
                      </TableCell>
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
