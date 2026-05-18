export interface PMResult {
  smartphone: string
  nilai: number
  ranking: number
}

export interface GAPTable {
  smartphone: string
  gap: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
  bobotNilai: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
  ncf: number
  nsf: number
  nilaiAkhir: number
}

// GAP conversion table
const getBobotNilai = (gap: number): number => {
  const absGap = Math.abs(gap)
  if (absGap === 0) return 5
  if (absGap <= 1) return 4.5
  if (absGap <= 2) return 4
  if (absGap <= 3) return 3.5
  if (absGap <= 4) return 3
  if (absGap <= 5) return 2.5
  if (absGap <= 6) return 2
  if (absGap <= 7) return 1.5
  if (absGap <= 8) return 1
  if (absGap <= 9) return 0.5
  return 0
}

export async function calculateProfileMatching(
  data: any[],
  profilIdeal: any
): Promise<PMResult[]> {
  const matrix: GAPTable[] = data.map((item) => {
    // Calculate GAP (Nilai Smartphone - Nilai Ideal)
    // Harga: Convert to millions for calculation
    const hargaGap = (item.harga - profilIdeal.harga) / 1000000
    const ramGap = item.ram - profilIdeal.ram
    const storageGap = item.storage - profilIdeal.storage
    const bateraiGap = item.baterai - profilIdeal.baterai
    const kameraGap = item.kamera - profilIdeal.kamera

    const gap = {
      harga: hargaGap,
      ram: ramGap,
      storage: storageGap,
      baterai: bateraiGap,
      kamera: kameraGap,
    }

    // Convert GAP to bobot nilai
    const bobotNilai = {
      harga: getBobotNilai(hargaGap),
      ram: getBobotNilai(ramGap),
      storage: getBobotNilai(storageGap),
      baterai: getBobotNilai(bateraiGap),
      kamera: getBobotNilai(kameraGap),
    }

    // Core Factor (CF): Harga, RAM (60%)
    // Secondary Factor (SF): Storage, Baterai, Kamera (40%)
    const ncf = (bobotNilai.harga + bobotNilai.ram) / 2
    const nsf = (bobotNilai.storage + bobotNilai.baterai + bobotNilai.kamera) / 3

    // Nilai Akhir = (60% × NCF) + (40% × NSF)
    const nilaiAkhir = 0.6 * ncf + 0.4 * nsf

    return {
      smartphone: item.nama,
      gap,
      bobotNilai,
      ncf: Math.round(ncf * 1000) / 1000,
      nsf: Math.round(nsf * 1000) / 1000,
      nilaiAkhir: Math.round(nilaiAkhir * 1000) / 1000,
    }
  })

  // Sort by nilaiAkhir descending and assign ranking
  const sorted = [...matrix].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)
  const results: PMResult[] = sorted.map((item, index) => ({
    smartphone: item.smartphone,
    nilai: item.nilaiAkhir,
    ranking: index + 1,
  }))

  return results
}
