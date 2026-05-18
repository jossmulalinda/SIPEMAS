'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { RefreshCw, TrendingUp, Award, CheckCircle2, XCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'

interface ComparisonData {
  comparison: any[]
  chartData: {
    SAW: any[]
    SMART: any[]
    PM: any[]
    GP: any[]
  }
  analysis: {
    mostConsistent: [string, number][]
    avgRankings: { smartphone: string; avgRanking: number }[]
    finalRecommendation: string
  }
}

export default function PerbandinganPage() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/perbandingan')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data perbandingan',
        variant: 'destructive',
        icon: <XCircle className="h-5 w-5" />,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast({
      title: 'Berhasil',
      description: 'Data perbandingan berhasil diperbarui',
      className: 'bg-green-500 text-white border-green-500',
      icon: <CheckCircle2 className="h-5 w-5" />,
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-2">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-2 rounded-full" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                    <TableHead className="text-white text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
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

  // Prepare chart data
  const chartData = data?.chartData.SAW.map((item) => ({
    smartphone: item.smartphone.substring(0, 15),
    SAW: data.chartData.SAW.find((s) => s.smartphone === item.smartphone)?.nilai || 0,
    SMART: data.chartData.SMART.find((s) => s.smartphone === item.smartphone)?.nilai || 0,
    PM: data.chartData.PM.find((s) => s.smartphone === item.smartphone)?.nilai || 0,
    GP: 1 - (data.chartData.GP.find((s) => s.smartphone === item.smartphone)?.nilaiZ || 0), // Invert GP for comparison
  })) || []

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Perbandingan Metode</h1>
            <p className="text-gray-600 mt-1">Analisis komprehensif keempat metode SPK</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Memuat...' : 'Refresh'}
          </Button>
        </div>

        {/* Final Recommendation Card */}
        <Card className="mb-6 border-2 border-[#4F9CF9] bg-gradient-to-r from-[#4F9CF9]/10 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#4F9CF9] rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Rekomendasi Akhir</CardTitle>
                <CardDescription>Berdasarkan analisis keempat metode</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-2">Smartphone Paling Direkomendasikan</p>
              <p className="text-3xl font-bold text-[#1E3A5F]">{data?.analysis.finalRecommendation || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Perbandingan Nilai Akhir Semua Metode</CardTitle>
            <CardDescription>Visualisasi perbandingan nilai dari keempat metode SPK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="smartphone" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="SAW" fill="#4F9CF9" name="SAW" />
                  <Bar dataKey="SMART" fill="#1E3A5F" name="SMART" />
                  <Bar dataKey="PM" fill="#28A745" name="Profile Matching" />
                  <Bar dataKey="GP" fill="#FFC107" name="Goal Programming" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Consistency Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4F9CF9]" />
                <CardTitle>Analisis Konsistensi</CardTitle>
              </div>
              <CardDescription>
                Smartphone yang paling sering muncul di Top 3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.analysis.mostConsistent.slice(0, 5).map(([name, count], index) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4F9CF9] flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-[#1E3A5F]">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F9CF9]"
                          style={{ width: `${(count / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-[#4F9CF9]">{count}/4</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Average Ranking */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#4F9CF9]" />
                <CardTitle>Rata-rata Ranking</CardTitle>
              </div>
              <CardDescription>
                Smartphone dengan rata-rata ranking terbaik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.analysis.avgRankings.slice(0, 5).map((item, index) => (
                  <div key={item.smartphone} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-[#FFD700]' : index === 1 ? 'bg-[#C0C0C0]' : index === 2 ? 'bg-[#CD7F32]' : 'bg-[#4F9CF9]'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-[#1E3A5F]">{item.smartphone}</span>
                    </div>
                    <Badge variant="outline" className="font-bold">
                      {item.avgRanking.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tabel Perbandingan Ranking</CardTitle>
            <CardDescription>Side-by-side comparison dari keempat metode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-[#F8F9FF]">
                  <TableRow className="bg-[#1E3A5F]">
                    <TableHead className="text-white">Smartphone</TableHead>
                    <TableHead className="text-white text-center">SAW</TableHead>
                    <TableHead className="text-white text-center">SMART</TableHead>
                    <TableHead className="text-white text-center">PM</TableHead>
                    <TableHead className="text-white text-center">GP</TableHead>
                    <TableHead className="text-white text-center">Avg Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.comparison.map((item, index) => {
                    const avgRank = (item.saw.ranking + item.smart.ranking + item.pm.ranking + item.gp.ranking) / 4
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.smartphone}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.saw.ranking <= 3 ? 'default' : 'outline'}>{item.saw.ranking}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.smart.ranking <= 3 ? 'default' : 'outline'}>{item.smart.ranking}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.pm.ranking <= 3 ? 'default' : 'outline'}>{item.pm.ranking}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.gp.ranking <= 3 ? 'default' : 'outline'}>{item.gp.ranking}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-[#4F9CF9]">
                          {avgRank.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
