import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all results
    const sawResults = await db.hasilSAW.findMany({ orderBy: { ranking: 'asc' } })
    const smartResults = await db.hasilSMART.findMany({ orderBy: { ranking: 'asc' } })
    const pmResults = await db.hasilPM.findMany({ orderBy: { ranking: 'asc' } })
    const gpResults = await db.hasilGP.findMany({ orderBy: { ranking: 'asc' } })

    // Create comparison table
    const smartphones = await db.smartphone.findMany()

    const comparison = smartphones.map((phone) => ({
      smartphone: phone.nama,
      saw: sawResults.find((r) => r.smartphone === phone.nama) || { nilai: 0, ranking: 0 },
      smart: smartResults.find((r) => r.smartphone === phone.nama) || { nilai: 0, ranking: 0 },
      pm: pmResults.find((r) => r.smartphone === phone.nama) || { nilai: 0, ranking: 0 },
      gp: gpResults.find((r) => r.smartphone === phone.nama) || { nilai: 0, ranking: 0 },
    }))

    // Calculate consistency - which smartphone appears most in top 3
    const top3saw = sawResults.slice(0, 3).map((r) => r.smartphone)
    const top3smart = smartResults.slice(0, 3).map((r) => r.smartphone)
    const top3pm = pmResults.slice(0, 3).map((r) => r.smartphone)
    const top3gp = gpResults.slice(0, 3).map((r) => r.smartphone)

    const top3All = [...top3saw, ...top3smart, ...top3pm, ...top3gp]
    const top3Counts: Record<string, number> = {}
    top3All.forEach((name) => {
      top3Counts[name] = (top3Counts[name] || 0) + 1
    })

    const mostConsistent = Object.entries(top3Counts).sort((a, b) => b[1] - a[1])

    // Calculate average ranking for each smartphone
    const avgRankings = comparison
      .map((c) => ({
        smartphone: c.smartphone,
        avgRanking: (c.saw.ranking + c.smart.ranking + c.pm.ranking + c.gp.ranking) / 4,
      }))
      .filter((c) => c.avgRanking > 0)
      .sort((a, b) => a.avgRanking - b.avgRanking)

    // Final recommendation
    const finalRecommendation =
      mostConsistent.length > 0 ? mostConsistent[0][0] : avgRankings[0]?.smartphone || 'Tidak ada data'

    return NextResponse.json({
      comparison,
      chartData: {
        SAW: sawResults,
        SMART: smartResults,
        PM: pmResults,
        GP: gpResults,
      },
      analysis: {
        mostConsistent: mostConsistent.slice(0, 5),
        avgRankings: avgRankings.slice(0, 5),
        finalRecommendation,
      },
    })
  } catch (error) {
    console.error('Error fetching perbandingan data:', error)
    return NextResponse.json({ error: 'Failed to fetch perbandingan data' }, { status: 500 })
  }
}
