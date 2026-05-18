'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Kriteria {
  id: number
  kode: string
  nama: string
  bobot: number
  sifat: string
}

const COLORS = ['#4F9CF9', '#1E3A5F', '#28A745', '#FFC107', '#DC3545']

export default function BobotPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<{ id: number; bobot: string }[]>([])

  const fetchKriteria = async () => {
    try {
      const response = await fetch('/api/bobot')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setKriteria(data)
      setFormData(data.map((k: Kriteria) => ({ id: k.id, bobot: k.bobot.toString() })))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data bobot',
        variant: 'destructive',
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

    // Validate all bobot values
    for (let i = 0; i < formData.length; i++) {
      const bobot = parseFloat(formData[i].bobot)
      if (isNaN(bobot) || bobot < 0 || bobot > 1) {
        toast({
          title: 'Validasi Gagal',
          description: `${kriteria[i].kode}: Bobot harus berupa angka antara 0 dan 1`,
          variant: 'destructive',
        })
        return
      }
    }

    // Calculate total
    const total = formData.reduce((sum, item) => sum + parseFloat(item.bobot || '0'), 0)

    if (Math.abs(total - 1.00) > 0.01) {
      toast({
        title: 'Validasi Gagal',
        description: `Total bobot harus 1.00, saat ini: ${total.toFixed(2)}`,
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const bobotData = kriteria.map((k, index) => ({
        id: k.id,
        bobot: parseFloat(formData[index].bobot),
      }))

      const response = await fetch('/api/bobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bobot: bobotData }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Sukses',
        description: 'Bobot berhasil diperbarui',
      })

      fetchKriteria()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan bobot',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleBobotChange = (index: number, value: string) => {
    const newFormData = [...formData]
    newFormData[index].bobot = value
    setFormData(newFormData)
  }

  const getTotalBobot = () => {
    return formData.reduce((sum, item) => sum + parseFloat(item.bobot || '0'), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-12 h-12 animate-spin text-[#4F9CF9]" />
      </div>
    )
  }

  const chartData = kriteria.map((k, index) => ({
    name: k.kode,
    value: parseFloat(formData[index]?.bobot || k.bobot.toString()),
  }))

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Pengaturan Bobot Kriteria</h1>
          <p className="text-gray-600 mt-1">Atur bobot untuk setiap kriteria penilaian</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Bobot</CardTitle>
              <CardDescription>
                Total bobot saat ini:{' '}
                <span className={`font-bold ${Math.abs(getTotalBobot() - 1.00) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {getTotalBobot().toFixed(2)} / 1.00
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {kriteria.map((k, index) => (
                  <div key={k.id} className="space-y-2">
                    <Label htmlFor={`bobot-${k.id}`}>
                      {k.kode} - {k.nama}
                    </Label>
                    <Input
                      id={`bobot-${k.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData[index]?.bobot || k.bobot}
                      onChange={(e) => handleBobotChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
                <div className="pt-4">
                  <Button type="submit" disabled={saving} className="w-full bg-[#4F9CF9] hover:bg-[#4F9CF9]/90">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan Bobot'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Bobot</CardTitle>
              <CardDescription>Visualisasi persentase bobot tiap kriteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
