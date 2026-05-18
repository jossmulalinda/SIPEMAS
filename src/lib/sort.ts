/**
 * Fungsi untuk mengurutkan kode secara natural
 * Contoh: A1, A2, A3, ..., A9, A10, A11 (bukan A1, A10, A11, A2)
 */
export function naturalSort(a: string, b: string): number {
  // Pisahkan huruf dan angka
  const regex = /([A-Za-z]+)(\d+)/
  const matchA = a.match(regex)
  const matchB = b.match(regex)

  // Jika format tidak sesuai, fallback ke string comparison biasa
  if (!matchA || !matchB) {
    return a.localeCompare(b)
  }

  const [, lettersA, numbersA] = matchA
  const [, lettersB, numbersB] = matchB

  // Urutkan berdasarkan huruf dulu
  const lettersComparison = lettersA.localeCompare(lettersB)
  if (lettersComparison !== 0) {
    return lettersComparison
  }

  // Jika huruf sama, urutkan berdasarkan angka
  const numA = parseInt(numbersA, 10)
  const numB = parseInt(numbersB, 10)

  return numA - numB
}

/**
 * Fungsi untuk mengurutkan array berdasarkan kode secara natural
 */
export function sortByCode<T extends { kode: string }>(items: T[]): T[] {
  return items.sort((a, b) => naturalSort(a.kode, b.kode))
}
