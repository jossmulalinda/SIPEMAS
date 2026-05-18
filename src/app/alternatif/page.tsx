'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, RefreshCw, Download, Upload, FileSpreadsheet, X, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'

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
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Smartphone | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
        icon: <XCircle className="h-5 w-5" />,
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
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    if (isNaN(ram) || ram <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'RAM harus berupa angka positif',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    if (isNaN(storage) || storage <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Storage harus berupa angka positif',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    if (isNaN(baterai) || baterai <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Baterai harus berupa angka positif',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    if (isNaN(kamera) || kamera <= 0) {
      toast({
        title: 'Validasi Gagal',
        description: 'Kamera harus berupa angka positif',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    try {
      const url = editingItem ? `/api/smartphone/${editingItem.id}` : '/api/smartphone'
      const method = editingItem ? 'PUT' : 'POST'

      // When editing, include kode; when adding, kode is auto-generated
      const payload = editingItem ? formData : {
        nama: formData.nama,
        harga: formData.harga,
        ram: formData.ram,
        storage: formData.storage,
        baterai: formData.baterai,
        kamera: formData.kamera,
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
            description: errorData.error || 'Kode smartphone sudah ada',
            variant: 'destructive',
            icon: <XCircle className="h-5 w-5" />,
          })
          return
        }
        throw new Error('Failed to save')
      }

      toast({
        title: 'Sukses',
        description: editingItem ? 'Smartphone berhasil diperbarui' : 'Smartphone berhasil ditambahkan',
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      setDialogOpen(false)
      resetForm()
      fetchSmartphones()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
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
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      fetchSmartphones()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus smartphone',
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

  // Export to Excel
  const handleExport = () => {
    try {
      // Prepare data for export (without id field)
      const exportData = smartphones.map((item) => ({
        Kode: item.kode,
        Nama: item.nama,
        Harga: item.harga,
        RAM: item.ram,
        Storage: item.storage,
        Baterai: item.baterai,
        Kamera: item.kamera,
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      ws['!cols'] = [
        { wch: 8 },  // Kode
        { wch: 30 }, // Nama
        { wch: 15 }, // Harga
        { wch: 10 }, // RAM
        { wch: 10 }, // Storage
        { wch: 12 }, // Baterai
        { wch: 10 }, // Kamera
      ]

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Smartphones')

      // Generate file name with timestamp
      const timestamp = new Date().toISOString().slice(0, 10)
      const fileName = `Smartphones_SIPEMAS_${timestamp}.xlsx`

      // Download file
      XLSX.writeFile(wb, fileName)

      toast({
        title: 'Berhasil',
        description: 'Data smartphone berhasil diekspor ke Excel',
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengekspor data ke Excel',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    }
  }

  // Import from Excel
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: 'Error',
        description: 'File harus berupa Excel (.xlsx atau .xls)',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
      return
    }

    setImporting(true)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })

      // Get first sheet
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      // Parse sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(sheet)

      if (jsonData.length === 0) {
        toast({
          title: 'Error',
          description: 'File Excel tidak berisi data',
          variant: 'destructive',
          icon: <XCircle className="h-5 w-5" />,
        })
        setImporting(false)
        return
      }

      // Validate and transform data
      const validSmartphones: any[] = []
      const errors: string[] = []

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i]
        const rowNum = i + 2 // Excel row number (1-indexed + header)

        // Map column names (try both English and Indonesian)
        const nama = row['Nama'] || row['nama'] || row['Nama Smartphone'] || row['name']
        const harga = parseFloat(row['Harga'] || row['harga'] || row['Price'] || row['price'] || 0)
        const ram = parseFloat(row['RAM'] || row['ram'] || row['Ram'] || 0)
        const storage = parseFloat(row['Storage'] || row['storage'] || row['Penyimpanan'] || 0)
        const baterai = parseFloat(row['Baterai'] || row['baterai'] || row['Battery'] || 0)
        const kamera = parseFloat(row['Kamera'] || row['kamera'] || row['Camera'] || 0)

        // Validate required fields
        if (!nama || typeof nama !== 'string') {
          errors.push(`Baris ${rowNum}: Nama smartphone harus diisi`)
          continue
        }

        if (isNaN(harga) || harga <= 0) {
          errors.push(`Baris ${rowNum}: Harga harus berupa angka positif (${nama})`)
          continue
        }

        if (isNaN(ram) || ram <= 0) {
          errors.push(`Baris ${rowNum}: RAM harus berupa angka positif (${nama})`)
          continue
        }

        if (isNaN(storage) || storage <= 0) {
          errors.push(`Baris ${rowNum}: Storage harus berupa angka positif (${nama})`)
          continue
        }

        if (isNaN(baterai) || baterai <= 0) {
          errors.push(`Baris ${rowNum}: Baterai harus berupa angka positif (${nama})`)
          continue
        }

        if (isNaN(kamera) || kamera <= 0) {
          errors.push(`Baris ${rowNum}: Kamera harus berupa angka positif (${nama})`)
          continue
        }

        validSmartphones.push({
          nama,
          harga,
          ram,
          storage,
          baterai,
          kamera,
        })
      }

      // Show errors if any
      if (errors.length > 0) {
        toast({
          title: 'Validasi Gagal',
          description: `${errors.length} baris tidak valid. ${errors.slice(0, 3).join('. ')}`,
          variant: 'destructive',
          icon: <XCircle className="h-5 w-5" />,
        })
      }

      if (validSmartphones.length === 0) {
        setImporting(false)
        return
      }

      // Send to API
      const response = await fetch('/api/smartphone/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smartphones: validSmartphones }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal mengimpor data')
      }

      const result = await response.json()

      toast({
        title: 'Berhasil',
        description: `${result.imported} smartphone berhasil ditambahkan${result.skipped > 0 ? `, ${result.skipped} duplikat dilewati` : ''}`,
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      setImportDialogOpen(false)
      fetchSmartphones()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal mengimpor data dari Excel',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    } finally {
      setImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Import Excel
            </Button>
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

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Import Data Smartphone</DialogTitle>
              <DialogDescription>
                Upload file Excel (.xlsx atau .xls) untuk menambahkan data smartphone
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Format kolom yang diharapkan:
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Nama, Harga, RAM, Storage, Baterai, Kamera
                </p>
                <Button
                  onClick={handleImportClick}
                  disabled={importing}
                  className="w-full"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih File Excel
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-semibold">Catatan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Sistem akan mendeteksi nama kolom secara otomatis</li>
                  <li>Duplikat berdasarkan nama akan dilewati</li>
                  <li>Kode akan di-generate otomatis oleh sistem</li>
                  <li>Harga dalam format angka (tanpa titik atau koma)</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
