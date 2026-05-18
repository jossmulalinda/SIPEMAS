'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, RefreshCw, Trophy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SMARTResult {
  id: number
  smartphone: string
  nilai: number
  ranking: number
}

export default function SMARTPage() {
  const [results, setResults] = useState<SMARTResult[]>([])
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

  useEffect(() => {
    fetchResults()
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
