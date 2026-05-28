import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { fetchAndNormalizeRaleighPermits, type NormalizedPermit } from '@/lib/scrapers/raleigh'

export const maxDuration = 60 // Allow up to 60 seconds for large ingestion

interface IngestionResult {
  success: boolean
  logId: string
  recordsFetched: number
  recordsInserted: number
  recordsUpdated: number
  recordsSkipped: number
  errors: string[]
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  
  // Parse options from request body
  let daysBack = 30
  let limit = 1000
  
  try {
    const body = await request.json().catch(() => ({}))
    daysBack = body.daysBack || 30
    limit = body.limit || 1000
  } catch {
    // Use defaults
  }
  
  // Create ingestion log entry
  const { data: logEntry, error: logError } = await supabase
    .from('ingestion_logs')
    .insert({
      source: 'raleigh_open_data',
      status: 'running',
    })
    .select('id')
    .single()
  
  if (logError || !logEntry) {
    console.error('[v0] Failed to create ingestion log:', logError)
    return NextResponse.json(
      { error: 'Failed to initialize ingestion', details: logError?.message },
      { status: 500 }
    )
  }
  
  const result: IngestionResult = {
    success: false,
    logId: logEntry.id,
    recordsFetched: 0,
    recordsInserted: 0,
    recordsUpdated: 0,
    recordsSkipped: 0,
    errors: [],
  }
  
  try {
    // Fetch permits from Raleigh Open Data
    console.log(`[v0] Fetching Raleigh permits (${daysBack} days, limit ${limit})...`)
    const permits = await fetchAndNormalizeRaleighPermits({ daysBack, limit })
    result.recordsFetched = permits.length
    console.log(`[v0] Fetched ${permits.length} permits`)
    
    // Get all competitors for matching
    const { data: competitors } = await supabase
      .from('competitors')
      .select('id, name')
    
    const competitorMap = new Map(
      competitors?.map(c => [c.name.toLowerCase(), c.id]) || []
    )
    
    // Process each permit
    for (const permit of permits) {
      try {
        // Check if permit already exists
        const { data: existing } = await supabase
          .from('permits')
          .select('id, last_synced')
          .eq('permit_number', permit.permit_number)
          .single()
        
        // Match contractor to competitor
        let competitorId: string | null = null
        if (permit.contractor_name) {
          // Try exact match first
          competitorId = competitorMap.get(permit.contractor_name.toLowerCase()) || null
          
          // Try fuzzy match if no exact match
          if (!competitorId) {
            for (const [name, id] of competitorMap) {
              const contractorLower = permit.contractor_name.toLowerCase()
              const firstWord = name.split(' ')[0]
              if (contractorLower.includes(firstWord) || name.includes(contractorLower.split(' ')[0])) {
                competitorId = id
                break
              }
            }
          }
        }
        
        const permitData = {
          permit_number: permit.permit_number,
          permit_type: permit.permit_type,
          location: permit.location,
          value: permit.value,
          filed_date: permit.filed_date,
          contractor_name: permit.contractor_name,
          latitude: permit.latitude,
          longitude: permit.longitude,
          source: permit.source,
          raw_data: permit.raw_data,
          last_synced: new Date().toISOString(),
          competitor_id: competitorId,
        }
        
        if (existing) {
          // Update existing permit
          const { error: updateError } = await supabase
            .from('permits')
            .update(permitData)
            .eq('id', existing.id)
          
          if (updateError) {
            result.errors.push(`Update failed for ${permit.permit_number}: ${updateError.message}`)
            result.recordsSkipped++
          } else {
            result.recordsUpdated++
          }
        } else {
          // Insert new permit
          const { error: insertError } = await supabase
            .from('permits')
            .insert(permitData)
          
          if (insertError) {
            result.errors.push(`Insert failed for ${permit.permit_number}: ${insertError.message}`)
            result.recordsSkipped++
          } else {
            result.recordsInserted++
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        result.errors.push(`Processing failed for ${permit.permit_number}: ${message}`)
        result.recordsSkipped++
      }
    }
    
    result.success = true
    
    // Update ingestion log with results
    await supabase
      .from('ingestion_logs')
      .update({
        completed_at: new Date().toISOString(),
        records_fetched: result.recordsFetched,
        records_inserted: result.recordsInserted,
        records_updated: result.recordsUpdated,
        records_skipped: result.recordsSkipped,
        status: 'completed',
        error_message: result.errors.length > 0 ? result.errors.slice(0, 10).join('; ') : null,
      })
      .eq('id', logEntry.id)
    
    console.log(`[v0] Ingestion complete: ${result.recordsInserted} inserted, ${result.recordsUpdated} updated, ${result.recordsSkipped} skipped`)
    
    return NextResponse.json(result)
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] Ingestion failed:', errorMessage)
    
    // Update log with error
    await supabase
      .from('ingestion_logs')
      .update({
        completed_at: new Date().toISOString(),
        status: 'failed',
        error_message: errorMessage,
      })
      .eq('id', logEntry.id)
    
    return NextResponse.json(
      { error: 'Ingestion failed', details: errorMessage, logId: logEntry.id },
      { status: 500 }
    )
  }
}

// GET endpoint to check latest ingestion status
export async function GET() {
  const supabase = createAdminClient()
  
  const { data: logs, error } = await supabase
    .from('ingestion_logs')
    .select('*')
    .eq('source', 'raleigh_open_data')
    .order('started_at', { ascending: false })
    .limit(10)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ logs })
}
