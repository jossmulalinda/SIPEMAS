'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, RefreshCw, Calculator, Smartphone, CheckCircle2, Target, XCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface GPResult {
  id: number
  smartphone: string
  jarak: number
  waktu: number
  biaya: number
  nilaiZ: number
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

interface ProfilIdeal {
  id: number
  harga: number
  ram: number
  storage: number
  baterai: number
  kamera: number
}

export default function GoalProgrammingPage() {
  const [results, setResults] = useState<GPResult[]>([])
  const [smartphones, setSmartphones] = useState<Smartphone[]>([])
  const [profilIdeal, setProfilIdeal] = useState<ProfilIdeal | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/goal-programming', {
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat hasil perhitungan',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSmartphones = async () => {
    try {
      const response = await fetch('/api/smartphone', {
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSmartphones(data)
    } catch (error) {
      console.error('Failed to fetch smartphones:', error)
    }
  }

  const fetchProfilIdeal = async () => {
    try {
      const response = await fetch('/api/profil-ideal', {
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      if (data.length > 0) {
        setProfilIdeal(data[0])
      }
    } catch (error) {
      console.error('Failed to fetch profil ideal:', error)
    }
  }

  useEffect(() => {
    fetchResults()
    fetchSmartphones()
    fetchProfilIdeal()
  }, [])

  const handleCalculate = async () => {
    setCalculating(true)
    try {
      const response = await fetch('/api/goal-programming', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to calculate')

      toast({
        title: 'Sukses',
        description: 'Perhitungan Goal Programming berhasil dilakukan',
        className: 'bg-green-500 text-white border-green-500',
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      fetchResults()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal melakukan perhitungan',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
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
      <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-80" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="flex-shrink-0 w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-72" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white"><Skeleton className="h-4 w-10" /></TableHead>
                    <TableHead className="text-white"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-72" />
              <Skeleton className="h-4 w-80 mt-2" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white"><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead className="text-white"><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableHead>
                    <TableHead className="text-white text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
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
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Metode Goal Programming</h1>
            <p className="text-gray-600 mt-1">
              Metode pemrograman tujuan untuk meminimalkan deviasi dari target
            </p>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {calculating ? 'Menghitung...' : 'Hitung Ulang'}
          </Button>
        </div>

        {/* Formula */}
        <Card className="mb-6 border-l-4 border-l-[#FFC107]">
          <CardHeader>
            <CardTitle className="text-lg">Rumus Goal Programming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Target:</strong> Nilai ideal untuk setiap kriteria
            </p>
            <p className="pt-2">
              <strong>Deviasi (Gap):</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Cost (Harga): d<sup>+</sup> = (nilai - target) / 1000 (jika nilai &gt; target)</li>
              <li>Benefit (lainnya): d<sup>-</sup> = (target - nilai) / 100 (jika target &gt; nilai)</li>
            </ul>
            <p className="pt-2">
              <strong>Fungsi Tujuan:</strong> Z = (Jarak × 0.5) + (Waktu × 0.3) + (Biaya × 0.2)
            </p>
            <p>Ranking berdasarkan nilai Z terkecil (deviasi minimum dari target)</p>
          </CardContent>
        </Card>

        {/* Tahapan Goal Programming */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FFC107]" />
              Tahapan Perhitungan Goal Programming
            </CardTitle>
            <CardDescription>
              Langkah-langkah sistematis dalam menentukan smartphone dengan deviasi minimum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC107] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Menentukan Target (Goal)</h4>
                  <p className="text-sm text-gray-600">
                    Menetapkan nilai target ideal untuk setiap kriteria yang ingin dicapai
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC107] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Menghitung Deviasi (Gap)</h4>
                  <p className="text-sm text-gray-600">
                    Menghitung selisih antara nilai kandidat dengan target untuk setiap kriteria
                  </p>
                  <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                    <li>Deviasi positif (d+): nilai melebihi target (untuk cost)</li>
                    <li>Deviasi negatif (d-): nilai di bawah target (untuk benefit)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC107] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Pembobotan Deviasi</h4>
                  <p className="text-sm text-gray-600">
                    Memberikan bobot pada setiap jenis deviasi (Jarak 50%, Waktu 30%, Biaya 20%)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC107] text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Perankingan</h4>
                  <p className="text-sm text-gray-600">
                    Menghitung fungsi tujuan (Z) dan mengurutkan berdasarkan deviasi minimum
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FFC107]" />
              Target yang Ditetapkan
            </CardTitle>
            <CardDescription>
              Nilai target ideal untuk setiap kriteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profilIdeal ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-[#F8F9FF] p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Harga</p>
                  <p className="font-bold text-[#1E3A5F]">Rp {profilIdeal.harga.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-[#F8F9FF] p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">RAM</p>
                  <p className="font-bold text-[#1E3A5F]">{profilIdeal.ram} GB</p>
                </div>
                <div className="bg-[#F8F9FF] p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Storage</p>
                  <p className="font-bold text-[#1E3A5F]">{profilIdeal.storage} GB</p>
                </div>
                <div className="bg-[#F8F9FF] p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Baterai</p>
                  <p className="font-bold text-[#1E3A5F]">{profilIdeal.baterai} mAh</p>
                </div>
                <div className="bg-[#F8F9FF] p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Kamera</p>
                  <p className="font-bold text-[#1E3A5F]">{profilIdeal.kamera} MP</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Belum ada target yang ditentukan</p>
            )}
          </CardContent>
        </Card>

        {/* Data Smartphone */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#FFC107]" />
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

        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan Goal Programming</CardTitle>
            <CardDescription>
              Ranking smartphone berdasarkan deviasi minimum dari target yang ditentukan
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
                      <TableHead className="text-white text-right">Nilai Z</TableHead>
                      <TableHead className="text-white text-right">Jarak</TableHead>
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
                          {item.nilaiZ.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right">{item.jarak.toFixed(4)}</TableCell>
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
