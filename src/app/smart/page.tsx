'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, RefreshCw, Trophy, Smartphone, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SMARTResult {
  id: number
  smartphone: string
  nilai: number
  ranking: number
}

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

interface Kriteria {
  id: number
  kode: string
  nama: string
  bobot: number
  sifat: string
}

export default function SMARTPage() {
  const [results, setResults] = useState<SMARTResult[]>([])
  const [smartphones, setSmartphones] = useState<Smartphone[]>([])
  const [kriteria, setKriteria] = useState<Kriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/smart')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat hasil perhitungan',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSmartphones = async () => {
    try {
      const response = await fetch('/api/smartphone')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSmartphones(data)
    } catch (error) {
      console.error('Failed to fetch smartphones:', error)
    }
  }

  const fetchKriteria = async () => {
    try {
      const response = await fetch('/api/kriteria')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setKriteria(data)
    } catch (error) {
      console.error('Failed to fetch kriteria:', error)
    }
  }

  useEffect(() => {
    fetchResults()
    fetchSmartphones()
    fetchKriteria()
  }, [])

  const handleCalculate = async () => {
    setCalculating(true)
    try {
      const response = await fetch('/api/smart', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to calculate')

      toast({
        title: 'Sukses',
        description: 'Perhitungan SMART berhasil dilakukan',
      })

      fetchResults()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal melakukan perhitungan',
        variant: 'destructive',
      })
    } finally {
      setCalculating(false)
    }
  }

  const getRankingBadge = (ranking: number) => {
    if (ranking === 1)
      return (
        <Badge className="bg-[#FFD700] text-[#1E3A5F] hover:bg-[#FFD700]/90">
          <Trophy className="w-3 h-3 mr-1" /> #{ranking}
        </Badge>
      )
    if (ranking === 2) return <Badge className="bg-[#C0C0C0] text-[#1E3A5F]">#{ranking}</Badge>
    if (ranking === 3) return <Badge className="bg-[#CD7F32] text-white">#{ranking}</Badge>
    return <Badge variant="outline">#{ranking}</Badge>
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
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Metode SMART</h1>
            <p className="text-gray-600 mt-1">
              Simple Multi-Attribute Rating Technique - Teknik rating multi-atribut sederhana
            </p>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90"
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            {calculating ? 'Menghitung...' : 'Hitung Ulang'}
          </Button>
        </div>

        {/* Formula */}
        <Card className="mb-6 border-l-4 border-l-[#4F9CF9]">
          <CardHeader>
            <CardTitle className="text-lg">Rumus SMART</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Normalisasi Bobot:</strong> W<sub>i</sub> = W'<sub>i</sub> / ΣW'<sub>i</sub>
            </p>
            <p>
              <strong>Nilai Utility:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Cost: u<sub>i</sub> = (C<sub>max</sub> - C<sub>out</sub>) / (C<sub>max</sub> - C<sub>min</sub>)</li>
              <li>Benefit: u<sub>i</sub> = (C<sub>out</sub> - C<sub>min</sub>) / (C<sub>max</sub> - C<sub>min</sub>)</li>
            </ul>
            <p className="pt-2">
              <strong>Nilai Akhir:</strong> u(a<sub>i</sub>) = Σ (w<sub>j</sub> × u<sub>j</sub>(a<sub>i</sub>))
            </p>
            <p>Ranking berdasarkan nilai tertinggi</p>
          </CardContent>
        </Card>

        {/* Tahapan SMART */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F9CF9]" />
              Tahapan Perhitungan SMART
            </CardTitle>
            <CardDescription>
              Langkah-langkah sistematis dalam menentukan ranking smartphone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Pengumpulan Data</h4>
                  <p className="text-sm text-gray-600">
                    Mengumpulkan data smartphone dan kriteria beserta bobotnya
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Normalisasi Bobot Kriteria</h4>
                  <p className="text-sm text-gray-600">
                    Menormalisasi bobot kriteria agar jumlahnya sama dengan 1 (Σw = 1)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Pengubahan ke Nilai Utility</h4>
                  <p className="text-sm text-gray-600">
                    Mengubah nilai kriteria ke skala utility (0-100) menggunakan fungsi utility linear
                  </p>
                  <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                    <li>Cost: Semakin kecil nilai, semakin tinggi utility</li>
                    <li>Benefit: Semakin besar nilai, semakin tinggi utility</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Perankingan</h4>
                  <p className="text-sm text-gray-600">
                    Menghitung nilai akhir dengan menjumlahkan utility ternormalisasi dan mengurutkan
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Smartphone */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#1E3A5F]" />
              Data Smartphone yang Dinilai
            </CardTitle>
            <CardDescription>
              Tabel alternatif smartphone yang akan dianalisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white">Kode</TableHead>
                    <TableHead className="text-white">Nama</TableHead>
                    <TableHead className="text-white text-right">Harga</TableHead>
                    <TableHead className="text-white text-right">RAM</TableHead>
                    <TableHead className="text-white text-right">Storage</TableHead>
                    <TableHead className="text-white text-right">Baterai</TableHead>
                    <TableHead className="text-white text-right">Kamera</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smartphones.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">Rp {item.harga.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{item.ram} GB</TableCell>
                      <TableCell className="text-right">{item.storage} GB</TableCell>
                      <TableCell className="text-right">{item.baterai} mAh</TableCell>
                      <TableCell className="text-right">{item.kamera} MP</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Data Kriteria */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Data Kriteria dan Bobot</CardTitle>
            <CardDescription>
              Kriteria penilaian beserta bobot dan sifatnya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white">Kode</TableHead>
                    <TableHead className="text-white">Nama</TableHead>
                    <TableHead className="text-white text-right">Bobot</TableHead>
                    <TableHead className="text-white text-center">Sifat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kriteria.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell className="text-right">{item.bobot.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.sifat === 'benefit' ? 'default' : 'outline'}>
                          {item.sifat === 'benefit' ? 'Benefit' : 'Cost'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan SMART</CardTitle>
            <CardDescription>
              Ranking smartphone berdasarkan metode Simple Multi-Attribute Rating Technique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#1E3A5F]">
                      <TableHead className="text-white">Ranking</TableHead>
                      <TableHead className="text-white">Smartphone</TableHead>
                      <TableHead className="text-white text-right">Nilai Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((item) => (
                      <TableRow
                        key={item.id}
                        className={
                          item.ranking <= 3
                            ? item.ranking === 1
                              ? 'bg-[#FFD700]/20'
                              : item.ranking === 2
                              ? 'bg-[#C0C0C0]/20'
                              : 'bg-[#CD7F32]/20'
                            : ''
                        }
                      >
                        <TableCell>{getRankingBadge(item.ranking)}</TableCell>
                        <TableCell className="font-medium">{item.smartphone}</TableCell>
                        <TableCell className="text-right font-bold text-[#4F9CF9]">
                          {item.nilai.toFixed(4)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada hasil perhitungan. Klik tombol "Hitung Ulang" untuk memulai.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
