export interface SMARTResult {
  smartphone: string
  nilai: number
  ranking: number
}

export interface SMARTMatrix {
  smartphone: string
  utility: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
  nilaiAkhir: number
}

export async function calculateSMART(data: any[], kriteria: any[]): Promise<SMARTResult[]> {
  // Normalize weights
  const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0)
  const normalizedWeights = kriteria.map((k) => ({
    ...k,
    normalizedBobot: k.bobot / totalBobot,
  }))

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

  // Calculate utility matrix
  const matrix: SMARTMatrix[] = data.map((item) => {
    const utility = {
      harga: (maxValues.harga - item.harga) / (maxValues.harga - minValues.harga), // Cost criterion
      ram: (item.ram - minValues.ram) / (maxValues.ram - minValues.ram), // Benefit criterion
      storage: (item.storage - minValues.storage) / (maxValues.storage - minValues.storage), // Benefit criterion
      baterai: (item.baterai - minValues.baterai) / (maxValues.baterai - minValues.baterai), // Benefit criterion
      kamera: (item.kamera - minValues.kamera) / (maxValues.kamera - minValues.kamera), // Benefit criterion
    }

    // Calculate final value
    let nilaiAkhir = 0
    normalizedWeights.forEach((k) => {
      if (k.kode === 'C1') nilaiAkhir += k.normalizedBobot * utility.harga
      if (k.kode === 'C2') nilaiAkhir += k.normalizedBobot * utility.ram
      if (k.kode === 'C3') nilaiAkhir += k.normalizedBobot * utility.storage
      if (k.kode === 'C4') nilaiAkhir += k.normalizedBobot * utility.baterai
      if (k.kode === 'C5') nilaiAkhir += k.normalizedBobot * utility.kamera
    })

    return {
      smartphone: item.nama,
      utility,
      nilaiAkhir: Math.round(nilaiAkhir * 1000) / 1000,
    }
  })

  // Sort by nilaiAkhir descending and assign ranking
  const sorted = [...matrix].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)
  const results: SMARTResult[] = sorted.map((item, index) => ({
    smartphone: item.smartphone,
    nilai: item.nilaiAkhir,
    ranking: index + 1,
  }))

  return results
}
