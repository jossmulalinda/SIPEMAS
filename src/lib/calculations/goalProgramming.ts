export interface GPResult {
  smartphone: string
  jarak: number
  waktu: number
  biaya: number
  nilaiZ: number
  ranking: number
}

export interface GPMatrix {
  smartphone: string
  deviasi: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
  nilaiZ: number
}

export async function calculateGoalProgramming(
  data: any[],
  target: {
    harga: number
    ram: number
    storage: number
    baterai: number
    kamera: number
  }
): Promise<GPResult[]> {
  const matrix: GPMatrix[] = data.map((item) => {
    // Calculate deviation for each criterion
    // Cost (Harga): d+ = max(0, nilai - target) / 1000
    const hargaDeviasi = Math.max(0, item.harga - target.harga) / 1000

    // Benefit: d- = max(0, target - nilai)
    const ramDeviasi = Math.max(0, target.ram - item.ram)
    const storageDeviasi = Math.max(0, target.storage - item.storage)
    const bateraiDeviasi = Math.max(0, target.baterai - item.baterai)
    const kameraDeviasi = Math.max(0, target.kamera - item.kamera)

    const deviasi = {
      harga: hargaDeviasi,
      ram: ramDeviasi,
      storage: storageDeviasi,
      baterai: bateraiDeviasi,
      kamera: kameraDeviasi,
    }

    // Normalize deviations to make them comparable
    // Calculate max for each criterion
    const maxHarga = Math.max(...data.map((d) => Math.max(0, d.harga - target.harga) / 1000))
    const maxRam = Math.max(...data.map((d) => Math.max(0, target.ram - d.ram)))
    const maxStorage = Math.max(...data.map((d) => Math.max(0, target.storage - d.storage)))
    const maxBaterai = Math.max(...data.map((d) => Math.max(0, target.baterai - d.baterai)))
    const maxKamera = Math.max(...data.map((d) => Math.max(0, target.kamera - d.kamera)))

    const normalizedDeviasi = {
      harga: maxHarga > 0 ? hargaDeviasi / maxHarga : 0,
      ram: maxRam > 0 ? ramDeviasi / maxRam : 0,
      storage: maxStorage > 0 ? storageDeviasi / maxStorage : 0,
      baterai: maxBaterai > 0 ? bateraiDeviasi / maxBaterai : 0,
      kamera: maxKamera > 0 ? kameraDeviasi / maxKamera : 0,
    }

    // Z = Σ(d+ + d-) - sum of normalized deviations
    const nilaiZ =
      normalizedDeviasi.harga +
      normalizedDeviasi.ram +
      normalizedDeviasi.storage +
      normalizedDeviasi.baterai +
      normalizedDeviasi.kamera

    return {
      smartphone: item.nama,
      deviasi,
      nilaiZ: Math.round(nilaiZ * 1000) / 1000,
    }
  })

  // Sort by nilaiZ ascending (lower is better) and assign ranking
  const sorted = [...matrix].sort((a, b) => a.nilaiZ - b.nilaiZ)
  const results: GPResult[] = sorted.map((item, index) => ({
    smartphone: item.smartphone,
    jarak: item.nilaiZ, // Using nilaiZ as jarak
    waktu: item.deviasi.harga, // Using harga deviation as proxy for waktu
    biaya: item.deviasi.ram, // Using ram deviation as proxy for biaya
    nilaiZ: item.nilaiZ,
    ranking: index + 1,
  }))

  return results
}
