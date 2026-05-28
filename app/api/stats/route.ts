import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const daysBack = parseInt(searchParams.get('days') || '30')
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  const startDateStr = startDate.toISOString().split('T')[0]
  
  // Get permit counts by competitor
  const { data: competitorStats, error: statsError } = await supabase
    .from('permits')
    .select('competitor_id, competitors(id, name, color)')
    .gte('filed_date', startDateStr)
  
  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 })
  }
  
  // Aggregate by competitor
  const competitorCounts: Record<string, { 
    id: string
    name: string
    color: string
    count: number 
  }> = {}
  
  for (const permit of competitorStats || []) {
    const competitor = permit.competitors as { id: string; name: string; color: string } | null
    if (competitor) {
      if (!competitorCounts[competitor.id]) {
        competitorCounts[competitor.id] = {
          id: competitor.id,
          name: competitor.name,
          color: competitor.color,
          count: 0,
        }
      }
      competitorCounts[competitor.id].count++
    }
  }
  
  // Get total value
  const { data: valueData } = await supabase
    .from('permits')
    .select('value')
    .gte('filed_date', startDateStr)
    .not('value', 'is', null)
  
  const totalValue = valueData?.reduce((sum, p) => sum + (p.value || 0), 0) || 0
  
  // Get daily permit counts for trend chart
  const { data: dailyData } = await supabase
    .from('permits')
    .select('filed_date, competitor_id, competitors(name, color)')
    .gte('filed_date', startDateStr)
    .order('filed_date', { ascending: true })
  
  // Aggregate by date and competitor
  const dailyByCompetitor: Record<string, Record<string, number>> = {}
  
  for (const permit of dailyData || []) {
    const date = permit.filed_date
    const competitor = permit.competitors as { name: string; color: string } | null
    const competitorName = competitor?.name || 'Unknown'
    
    if (!dailyByCompetitor[date]) {
      dailyByCompetitor[date] = {}
    }
    dailyByCompetitor[date][competitorName] = (dailyByCompetitor[date][competitorName] || 0) + 1
  }
  
  return NextResponse.json({
    competitorStats: Object.values(competitorCounts).sort((a, b) => b.count - a.count),
    totalPermits: competitorStats?.length || 0,
    totalValue,
    dailyTrends: dailyByCompetitor,
  })
}
