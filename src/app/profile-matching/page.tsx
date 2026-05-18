'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calculator, RefreshCw, Trophy, Smartphone, CheckCircle2, Target } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PMResult {
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

interface ProfilIdeal {
  id: number
  harga: number
  ram: number
  storage: number
  baterai: number
  kamera: number
}

export default function ProfileMatchingPage() {
  const [results, setResults] = useState<PMResult[]>([])
  const [smartphones, setSmartphones] = useState<Smartphone[]>([])
  const [profilIdeal, setProfilIdeal] = useState<ProfilIdeal | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/profile-matching')
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

  const fetchProfilIdeal = async () => {
    try {
      const response = await fetch('/api/profil-ideal')
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
      const response = await fetch('/api/profile-matching', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to calculate')

      toast({
        title: 'Sukses',
        description: 'Perhitungan Profile Matching berhasil dilakukan',
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
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Metode Profile Matching</h1>
            <p className="text-gray-600 mt-1">Metode pencocokan profil kebutuhan pengguna</p>
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
        <Card className="mb-6 border-l-4 border-l-[#28A745]">
          <CardHeader>
            <CardTitle className="text-lg">Rumus Profile Matching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Gap Analysis:</strong> GAP = (Nilai Kandidat - Nilai Profil Ideal)
            </p>
            <p>
              <strong>Konversi Gap:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GAP &gt; 0: Nilai = 5</li>
              <li>GAP = 0: Nilai = 5</li>
              <li>GAP &lt; 0: Nilai = 3 + (GAP × 1)</li>
            </ul>
            <p className="pt-2">
              <strong>Core Factor (CF - 60%):</strong> Harga, RAM
            </p>
            <p>
              <strong>Secondary Factor (SF - 40%):</strong> Storage, Baterai, Kamera
            </p>
            <p className="pt-2">
              <strong>Nilai Akhir:</strong> (60% × NCF) + (40% × NSF)
            </p>
            <p>Ranking berdasarkan nilai tertinggi</p>
          </CardContent>
        </Card>

        {/* Tahapan Profile Matching */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#28A745]" />
              Tahapan Perhitungan Profile Matching
            </CardTitle>
            <CardDescription>
              Langkah-langkah sistematis dalam menentukan kesesuaian smartphone dengan kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#28A745] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Menentukan Profil Ideal</h4>
                  <p className="text-sm text-gray-600">
                    Menetapkan nilai ideal untuk setiap kriteria berdasarkan kebutuhan pengguna
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#28A745] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Gap Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Menghitung selisih (gap) antara nilai kandidat dengan profil ideal
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#28A745] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Pembobotan Core & Secondary Factor</h4>
                  <p className="text-sm text-gray-600">
                    Mengelompokkan kriteria menjadi Core Factor (60%) dan Secondary Factor (40%)
                  </p>
                  <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                    <li>Core Factor: Kriteria paling penting (Harga, RAM)</li>
                    <li>Secondary Factor: Kriteria pendukung (Storage, Baterai, Kamera)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#28A745] text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E3A5F]">Perankingan</h4>
                  <p className="text-sm text-gray-600">
                    Menghitung nilai akhir dan mengurutkan berdasarkan kesesuaian tertinggi
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profil Ideal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-[#28A745]" />
              Profil Ideal Pengguna
            </CardTitle>
            <CardDescription>
              Nilai target kebutuhan pengguna untuk setiap kriteria
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
              <p className="text-center text-gray-500">Belum ada profil ideal yang ditentukan</p>
            )}
          </CardContent>
        </Card>

        {/* Data Smartphone */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#28A745]" />
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
            <CardTitle>Hasil Perhitungan Profile Matching</CardTitle>
            <CardDescription>
              Ranking smartphone berdasarkan kesesuaian dengan profil kebutuhan pengguna
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
