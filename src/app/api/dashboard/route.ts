import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get counts
    const totalSmartphone = await db.smartphone.count()
    const totalKriteria = await db.kriteria.count()

    // Get top 3 from each method
    const topSAW = await db.hasilSAW.findMany({
      orderBy: { ranking: 'asc' },
      take: 3,
    })

    const topSMART = await db.hasilSMART.findMany({
      orderBy: { ranking: 'asc' },
      take: 3,
    })

    const topPM = await db.hasilPM.findMany({
      orderBy: { ranking: 'asc' },
      take: 3,
    })

    const topGP = await db.hasilGP.findMany({
      orderBy: { ranking: 'asc' },
      take: 3,
    })

    // Get all results for chart
    const allSAW = await db.hasilSAW.findMany({ orderBy: { ranking: 'asc' } })
    const allSMART = await db.hasilSMART.findMany({ orderBy: { ranking: 'asc' } })
    const allPM = await db.hasilPM.findMany({ orderBy: { ranking: 'asc' } })
    const allGP = await db.hasilGP.findMany({ orderBy: { ranking: 'asc' } })

    // Calculate which method is most consistent
    const topRankings = {
      SAW: topSAW.map((r) => r.smartphone),
      SMART: topSMART.map((r) => r.smartphone),
      PM: topPM.map((r) => r.smartphone),
      GP: topGP.map((r) => r.smartphone),
    }

    // Count how many times each smartphone appears in top 3
    const smartphoneCounts: Record<string, number> = {}
    Object.values(topRankings).forEach((rankings) => {
      rankings.forEach((smartphone) => {
        smartphoneCounts[smartphone] = (smartphoneCounts[smartphone] || 0) + 1
      })
    })

    const mostRecommended = Object.entries(smartphoneCounts).sort((a, b) => b[1] - a[1])

    return NextResponse.json({
      summary: {
        totalSmartphone,
        totalKriteria,
        activeMethods: 4,
      },
      topRecommendations: {
        SAW: topSAW,
        SMART: topSMART,
        PM: topPM,
        GP: topGP,
      },
      chartData: {
        SAW: allSAW,
        SMART: allSMART,
        PM: allPM,
        GP: allGP,
      },
      analysis: {
        mostRecommended,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
