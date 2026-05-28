import { NextResponse } from 'next/server'

export const maxDuration = 60

/**
 * Cron endpoint for daily permit ingestion
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/ingest",
 *     "schedule": "0 6 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Call the Raleigh ingestion endpoint
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/ingest/raleigh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        daysBack: 7, // Only fetch last 7 days for daily cron
        limit: 500,
      }),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('[v0] Cron ingestion failed:', result)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
    
    console.log('[v0] Cron ingestion completed:', result)
    return NextResponse.json({ success: true, result })
    
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] Cron ingestion error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
