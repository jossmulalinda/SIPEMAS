'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Calculator, Trophy, Activity, RefreshCw } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from '@/hooks/use-toast'

interface DashboardData {
  summary: {
    totalSmartphone: number
    totalKriteria: number
    activeMethods: number
  }
  topRecommendations: {
    SAW: any[]
    SMART: any[]
    PM: any[]
    GP: any[]
  }
  chartData: {
    SAW: any[]
    SMART: any[]
    PM: any[]
    GP: any[]
  }
  analysis: {
    mostRecommended: [string, number][]
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data dashboard',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Calculate all methods to get fresh data
  const calculateAllMethods = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetch('/api/saw', { method: 'POST' }),
        fetch('/api/smart', { method: 'POST' }),
        fetch('/api/profile-matching', { method: 'POST' }),
        fetch('/api/goal-programming', { method: 'POST' }),
      ])
      await fetchData()
      toast({
        title: 'Sukses',
        description: 'Semua metode berhasil dihitung ulang',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghitung ulang',
        variant: 'destructive',
      })
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-[#4F9CF9]" />
          <p className="text-gray-600">Memuat data...</p>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A5F]">Dashboard</h1>
              <p className="text-gray-600 mt-1">Sistem Pendukung Keputusan Pemilihan Smartphone</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={calculateAllMethods} disabled={refreshing} className="bg-[#4F9CF9] hover:bg-[#4F9CF9]/90">
                <Activity className="w-4 h-4 mr-2" />
                Hitung Semua
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-t-4 border-t-[#4F9CF9]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Smartphone</CardTitle>
              <Smartphone className="w-5 h-5 text-[#4F9CF9]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1E3A5F]">{data?.summary.totalSmartphone || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Alternatif tersedia</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#1E3A5F]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Kriteria</CardTitle>
              <Calculator className="w-5 h-5 text-[#1E3A5F]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1E3A5F]">{data?.summary.totalKriteria || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Kriteria penilaian</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#28A745]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Metode Aktif</CardTitle>
              <Trophy className="w-5 h-5 text-[#28A745]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1E3A5F]">{data?.summary.activeMethods || 0}</div>
              <p className="text-xs text-gray-500 mt-1">SAW, SMART, PM, GP</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mb-8">
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

        {/* Top Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A5F]">Top 3 Rekomendasi</CardTitle>
              <CardDescription>Smartphone dengan nilai tertinggi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topRecommendations.SAW.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#F8F9FF] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-[#4F9CF9]' : index === 1 ? 'bg-[#1E3A5F]' : 'bg-[#28A745]'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E3A5F]">{item.smartphone}</p>
                        <p className="text-sm text-gray-500">SAW: {item.nilai.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A5F]">Analisis Konsistensi</CardTitle>
              <CardDescription>Smartphone paling sering direkomendasikan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.analysis.mostRecommended.slice(0, 5).map(([name, count], index) => (
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
        </div>
      </div>
    </div>
  )
}
