export interface SAWResult {
  smartphone: string
  nilai: number
  ranking: number
}

export interface SAWMatrix {
  smartphone: string
  normalisasi: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
  nilaiAkhir: number
}

export async function calculateSAW(data: any[], kriteria: any[]): Promise<SAWResult[]> {
  // Get max and min values for each criterion
  const maxValues = {
    harga: Math.max(...data.map((d) => d.harga)),
    ram: Math.max(...data.map((d) => d.ram)),
    storage: Math.max(...data.map((d) => d.storage)),
    baterai: Math.max(...data.map((d) => d.baterai)),
    kamera: Math.max(...data.map((d) => d.kamera)),
  }

  const minValues = {
    harga: Math.min(...data.map((d) => d.harga)),
    ram: Math.min(...data.map((d) => d.ram)),
    storage: Math.min(...data.map((d) => d.storage)),
    baterai: Math.min(...data.map((d) => d.baterai)),
    kamera: Math.min(...data.map((d) => d.kamera)),
  }

  // Calculate normalized matrix
  const matrix: SAWMatrix[] = data.map((item) => {
    const normalisasi = {
      harga: minValues.harga / item.harga, // Cost criterion
      ram: item.ram / maxValues.ram, // Benefit criterion
      storage: item.storage / maxValues.storage, // Benefit criterion
      baterai: item.baterai / maxValues.baterai, // Benefit criterion
      kamera: item.kamera / maxValues.kamera, // Benefit criterion
    }

    // Calculate final value
    let nilaiAkhir = 0
    kriteria.forEach((k) => {
      const bobot = k.bobot
      if (k.kode === 'C1') nilaiAkhir += bobot * normalisasi.harga
      if (k.kode === 'C2') nilaiAkhir += bobot * normalisasi.ram
      if (k.kode === 'C3') nilaiAkhir += bobot * normalisasi.storage
      if (k.kode === 'C4') nilaiAkhir += bobot * normalisasi.baterai
      if (k.kode === 'C5') nilaiAkhir += bobot * normalisasi.kamera
    })

    return {
      smartphone: item.nama,
      normalisasi,
      nilaiAkhir: Math.round(nilaiAkhir * 1000) / 1000,
    }
  })

  // Sort by nilaiAkhir descending and assign ranking
  const sorted = [...matrix].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)
  const results: SAWResult[] = sorted.map((item, index) => ({
    smartphone: item.smartphone,
    nilai: item.nilaiAkhir,
    ranking: index + 1,
  }))

  return results
}
