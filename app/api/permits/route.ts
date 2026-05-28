import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  
  const competitorId = searchParams.get('competitor_id')
  const daysBack = parseInt(searchParams.get('days') || '30')
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  // Calculate date range
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  
  let query = supabase
    .from('permits')
    .select(`
      *,
      competitor:competitors(id, name, color)
    `)
    .gte('filed_date', startDate.toISOString().split('T')[0])
    .order('filed_date', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (competitorId) {
    query = query.eq('competitor_id', competitorId)
  }
  
  const { data: permits, error, count } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ permits, count })
}
