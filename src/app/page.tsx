'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FunctionSquare,
  BrainCircuit,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const features = [
    {
      icon: <FunctionSquare className="w-10 h-10 text-[#4F9CF9]" />,
      title: 'Metode SAW',
      description: 'Simple Additive Weighting - Metode pembobotan sederhana dengan normalisasi data',
      color: 'bg-[#4F9CF9]/10'
    },
    {
      icon: <BrainCircuit className="w-10 h-10 text-[#1E3A5F]" />,
      title: 'Metode SMART',
      description: 'Simple Multi-Attribute Rating Technique - Penilaian multi-atribut dengan fungsi utility',
      color: 'bg-[#1E3A5F]/10'
    },
    {
      icon: <Target className="w-10 h-10 text-[#28A745]" />,
      title: 'Profile Matching',
      description: 'Metode pencocokan profil dengan analisis GAP faktor core dan secondary',
      color: 'bg-[#28A745]/10'
    },
    {
      icon: <Trophy className="w-10 h-10 text-[#FFC107]" />,
      title: 'Goal Programming',
      description: 'Metode pemrograman tujuan untuk meminimalkan deviasi dari target',
      color: 'bg-[#FFC107]/10'
    }
  ]

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-[#4F9CF9]" />,
      title: 'Cepat & Efisien',
      description: 'Perhitungan otomatis yang cepat dan akurat'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#1E3A5F]" />,
      title: 'Validasi Ketat',
      description: 'Memastikan data input yang valid dan konsisten'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#28A745]" />,
      title: 'Visualisasi Data',
      description: 'Grafik dan chart untuk memudahkan pemahaman hasil'
    },
    {
      icon: <Users className="w-6 h-6 text-[#FFC107]" />,
      title: 'User Friendly',
      description: 'Antarmuka yang mudah digunakan oleh siapa saja'
    }
  ]

  const steps = [
    {
      step: '1',
      title: 'Input Data Alternatif',
      description: 'Masukkan data smartphone yang ingin dinilai beserta spesifikasinya'
    },
    {
      step: '2',
      title: 'Tentukan Kriteria & Bobot',
      description: 'Atur kriteria penilaian dan berikan bobot sesuai prioritas'
    },
    {
      step: '3',
      title: 'Pilih Metode Perhitungan',
      description: 'Pilih salah satu atau gunakan semua metode untuk perbandingan'
    },
    {
      step: '4',
      title: 'Analisis Hasil',
      description: 'Lihat peringkat dan analisis konsistensi antar metode'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2d5a87] to-[#4F9CF9] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Sistem Pendukung Keputusan Modern</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                SIPEMAS
              </h1>
              <h2 className="text-xl sm:text-2xl font-light mb-4 text-blue-100">
                Sistem Pendukung Keputusan Pemilihan Smartphone
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                Bantu memilih smartphone terbaik dengan metode analisis yang teruji dan terpercaya.
                Dapatkan rekomendasi berbasis data yang akurat dan objektif.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/alternatif">
                  <Button size="lg" className="bg-white text-[#1E3A5F] font-semibold px-8 hover:bg-white">
                    Mulai Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/perbandingan">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:border-white">
                    Lihat Perbandingan
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#4F9CF9] rounded-full blur-3xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-full w-64 h-64 flex items-center justify-center border border-white/20">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="SIPEMAS"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Metode Analisis yang Tersedia
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SIPEMAS menyediakan empat metode analisis yang berbeda untuk memberikan
              perspektif yang komprehensif dalam pemilihan smartphone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`border-t-4 ${feature.color}`}>
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-[#1E3A5F]">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">
              Cara Menggunakan SIPEMAS
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ikuti 4 langkah mudah untuk mendapatkan rekomendasi smartphone terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-[#F8F9FF] rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-[#4F9CF9] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#4F9CF9]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-6">
                Mengapa Memilih SIPEMAS?
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                SIPEMAS dirancang untuk membantu pengambilan keputusan yang lebih baik
                dengan menggunakan metode-metode analisis yang telah diakui di dunia akademis
                dan praktis. Sistem ini memastikan keputusan yang diambil berdasarkan data
                yang valid dan analisis yang sistematis.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F8F9FF] rounded-xl flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E3A5F] mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-[#4F9CF9] to-[#1E3A5F] text-white border-0">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold mb-2">4</div>
                  <div className="text-blue-100 text-sm">Metode Analisis</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2d5a87] text-white border-0">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-blue-100 text-sm">Objektif</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#28A745] to-[#1e7a34] text-white border-0">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold mb-2">∞</div>
                  <div className="text-green-100 text-sm">Data Tersimpan</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#FFC107] to-[#e0a800] text-white border-0">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-yellow-100 text-sm">Selalu Tersedia</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#1E3A5F] via-[#2d5a87] to-[#4F9CF9] text-white border-0">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Siap Memilih Smartphone Terbaik?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Mulai analisis sekarang dan dapatkan rekomendasi smartphone yang sesuai
                dengan kebutuhan dan budget Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/alternatif">
                  <Button size="lg" className="bg-white text-[#1E3A5F] font-semibold px-8 hover:bg-white">
                    Kelola Alternatif
                  </Button>
                </Link>
                <Link href="/kriteria">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:border-white">
                    Atur Kriteria
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-[#F8F9FF]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 font-medium mb-2">
            Saya bangga jadi anak ibu dan bapak
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SIPEMAS - Sistem Pendukung Keputusan Pemilihan Smartphone
          </p>
        </div>
      </div>
    </div>
  )
}
