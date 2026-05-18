# Natural Sort Implementation - Documentation

## Problem

Sebelumnya, data Alternatif dan Kriteria diurutkan menggunakan sorting alfabetis biasa, yang menyebabkan urutan yang tidak sesuai:

**Urutan Lama (Alfabetis Biasa):**
```
A1
A10
A11
A2
A3
A4
A5
A6
A7
A8
A9
```

Ini terjadi karena string sorting membandingkan karakter satu per satu:
- "A1" < "A10" (karena '1' < '1', lalu kosong < '0')
- "A10" < "A2" (karena '1' < '2')

## Solution

Implementasi **Natural Sort** yang mengenali angka dalam string dan mengurutkannya secara numerik.

**Urutan Baru (Natural Sort):**
```
A1
A2
A3
A4
A5
A6
A7
A8
A9
A10
A11
```

## Implementation

### 1. New Helper Function: `/src/lib/sort.ts`

Membuat dua fungsi:

```typescript
/**
 * Fungsi untuk mengurutkan dua string secara natural
 * Memisahkan huruf dan angka, lalu mengurutkan berdasarkan:
 * 1. Huruf (alfabetis)
 * 2. Angka (numerik)
 */
export function naturalSort(a: string, b: string): number {
  // Regex untuk memisahkan huruf dan angka
  const regex = /([A-Za-z]+)(\d+)/
  const matchA = a.match(regex)
  const matchB = b.match(regex)

  // Fallback ke string comparison biasa jika format tidak sesuai
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

  // Jika huruf sama, urutkan berdasarkan angka secara numerik
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
```

### 2. Updated API Routes

#### `/src/app/api/smartphone/route.ts`
```typescript
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const smartphones = await db.smartphone.findMany()
    // Sort using natural sort algorithm (A1, A2, ..., A9, A10, A11)
    const sortedSmartphones = sortByCode(smartphones)
    return NextResponse.json(sortedSmartphones)
  } catch (error) {
    // ...
  }
}
```

#### `/src/app/api/kriteria/route.ts`
```typescript
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const kriteria = await db.kriteria.findMany()
    // Sort using natural sort algorithm (C1, C2, ..., C9, C10, C11)
    const sortedKriteria = sortByCode(kriteria)
    return NextResponse.json(sortedKriteria)
  } catch (error) {
    // ...
  }
}
```

#### `/src/app/api/bobot/route.ts`
```typescript
import { sortByCode } from '@/lib/sort'

export async function GET() {
  try {
    const kriteria = await db.kriteria.findMany()
    const sortedKriteria = sortByCode(kriteria)
    return NextResponse.json(sortedKriteria)
  } catch (error) {
    // ...
  }
}

export async function POST(request: NextRequest) {
  try {
    // ... update bobot ...

    const updatedKriteria = await db.kriteria.findMany()
    const sortedUpdatedKriteria = sortByCode(updatedKriteria)
    return NextResponse.json(sortedUpdatedKriteria)
  } catch (error) {
    // ...
  }
}
```

## How It Works

### Example 1: Smartphone Codes
```
Input:  [A1, A10, A2, A20, A3, A30, A4, A5, A6, A7, A8, A9]

Process:
1. Parse A1  -> letters: "A", numbers: "1"
2. Parse A10 -> letters: "A", numbers: "10"
3. Parse A2  -> letters: "A", numbers: "2"
... dan seterusnya

Sort by letters: Semua "A" (sama)
Sort by numbers: 1, 2, 3, ..., 9, 10, 20, 30

Output: [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A20, A30]
```

### Example 2: Criteria Codes
```
Input:  [C1, C10, C2, C3, C4, C5, C6, C7, C8, C9]

Process:
1. Parse C1  -> letters: "C", numbers: "1"
2. Parse C10 -> letters: "C", numbers: "10"
3. Parse C2  -> letters: "C", numbers: "2"
... dan seterusnya

Sort by letters: Semua "C" (sama)
Sort by numbers: 1, 2, 3, ..., 9, 10

Output: [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]
```

### Example 3: Mixed Letter Codes (Future Proofing)
```
Input:  [A1, A10, B1, B10, C1, C10]

Process:
1. Parse A1  -> letters: "A", numbers: "1"
2. Parse B1  -> letters: "B", numbers: "1"
3. Parse C1  -> letters: "C", numbers: "1"
... dan seterusnya

Sort by letters: "A" < "B" < "C"
Sort by numbers: 1, 2, ..., 10

Output: [A1, A10, B1, B10, C1, C10]
```

## Benefits

1. **Intuitive Ordering**: Urutan kode sesuai dengan ekspektasi manusia (1, 2, ..., 10, 11)
2. **Flexible**: Mendukung berbagai format kode (A1, B1, C1, dll.)
3. **Type Safe**: Menggunakan TypeScript generics untuk type safety
4. **Reusable**: Fungsi `sortByCode` dapat digunakan untuk berbagai tipe data yang memiliki field `kode`
5. **Fallback**: Jika format tidak sesuai, fallback ke string comparison biasa

## Files Modified

1. **New File:** `/src/lib/sort.ts`
   - Natural sort implementation
   - `naturalSort()` function for comparing two codes
   - `sortByCode()` function for sorting arrays

2. **Updated:** `/src/app/api/smartphone/route.ts`
   - Applied natural sort to smartphone data

3. **Updated:** `/src/app/api/kriteria/route.ts`
   - Applied natural sort to kriteria data

4. **Updated:** `/src/app/api/bobot/route.ts`
   - Applied natural sort to kriteria data in GET and POST

## Testing

To verify the natural sort is working correctly:

### Test Cases:
1. **Basic Test:**
   - Input: A1, A10, A2, A3, A4, A5, A6, A7, A8, A9, A11
   - Expected Output: A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11

2. **Multi-digit Test:**
   - Input: A1, A10, A100, A2, A20, A200, A3
   - Expected Output: A1, A2, A3, A10, A20, A100, A200

3. **Mixed Letters Test:**
   - Input: A1, B1, A10, B10, A2, B2
   - Expected Output: A1, A2, A10, B1, B2, B10

4. **Edge Cases:**
   - Empty array: []
   - Single item: [A1]
   - Invalid format: ["ABC", "123"] (fallback to string comparison)

## Performance

The natural sort algorithm has:
- **Time Complexity**: O(n log n) untuk sorting, O(m) untuk parsing setiap kode (m = panjang kode)
- **Space Complexity**: O(n) untuk array yang di-sort

Untuk data dengan jumlah kecil (< 1000 items), performa tidak akan menjadi masalah.

## Future Enhancements

Jika diperlukan di masa depan:
1. Support untuk format kode yang lebih kompleks (misal: A-1, B.1, C_1)
2. Custom sorting rules untuk format kode spesifik
3. Server-side natural sort di database level (menggunakan database functions)
