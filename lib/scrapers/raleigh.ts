/**
 * Raleigh Open Data Portal Scraper
 * 
 * Data Source: https://data.raleighnc.gov/
 * Dataset: Building Permits
 * API: Socrata Open Data API (SODA)
 */

export interface RaleighPermit {
  permit_number: string
  permit_type: string
  permit_subtype?: string
  status: string
  issued_date?: string
  applied_date?: string
  expiration_date?: string
  estimated_value?: string
  total_sqft?: string
  contractor_name?: string
  contractor_license?: string
  site_address?: string
  city?: string
  state?: string
  zip?: string
  latitude?: string
  longitude?: string
  project_name?: string
  description?: string
}

export interface NormalizedPermit {
  permit_number: string
  permit_type: string
  location: string
  value: number | null
  filed_date: string
  contractor_name: string | null
  latitude: number | null
  longitude: number | null
  source: string
  raw_data: RaleighPermit
}

const RALEIGH_PERMITS_ENDPOINT = 'https://data.raleighnc.gov/resource/ru3c-vjwh.json'

// Commercial permit types we care about
const COMMERCIAL_PERMIT_TYPES = [
  'COMMERCIAL',
  'COMMERCIAL BUILDING',
  'COMMERCIAL ALTERATION',
  'COMMERCIAL NEW',
  'COMMERCIAL ADDITION',
  'GRADING',
  'SITE DEVELOPMENT',
  'DEMOLITION',
  'FOUNDATION',
]

export async function fetchRaleighPermits(options: {
  daysBack?: number
  limit?: number
  offset?: number
} = {}): Promise<RaleighPermit[]> {
  const { daysBack = 30, limit = 1000, offset = 0 } = options
  
  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  
  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]
  
  // Build SODA query
  // Filter for commercial permits in the last N days
  const whereClause = encodeURIComponent(
    `applied_date >= '${startDateStr}' AND applied_date <= '${endDateStr}' AND ` +
    `permit_type IN (${COMMERCIAL_PERMIT_TYPES.map(t => `'${t}'`).join(',')})`
  )
  
  const url = `${RALEIGH_PERMITS_ENDPOINT}?$where=${whereClause}&$limit=${limit}&$offset=${offset}&$order=applied_date DESC`
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    throw new Error(`Raleigh API error: ${response.status} ${response.statusText}`)
  }
  
  const data: RaleighPermit[] = await response.json()
  return data
}

export function normalizeRaleighPermit(permit: RaleighPermit): NormalizedPermit {
  // Parse estimated value (comes as string like "$50,000")
  let value: number | null = null
  if (permit.estimated_value) {
    const cleaned = permit.estimated_value.replace(/[$,]/g, '')
    value = parseFloat(cleaned)
    if (isNaN(value)) value = null
  }
  
  // Build location string
  const locationParts = [
    permit.site_address,
    permit.city || 'Raleigh',
    permit.state || 'NC',
    permit.zip
  ].filter(Boolean)
  const location = locationParts.join(', ')
  
  // Parse coordinates
  const latitude = permit.latitude ? parseFloat(permit.latitude) : null
  const longitude = permit.longitude ? parseFloat(permit.longitude) : null
  
  return {
    permit_number: permit.permit_number,
    permit_type: permit.permit_type || 'Unknown',
    location,
    value,
    filed_date: permit.applied_date || new Date().toISOString().split('T')[0],
    contractor_name: permit.contractor_name || null,
    latitude: latitude && !isNaN(latitude) ? latitude : null,
    longitude: longitude && !isNaN(longitude) ? longitude : null,
    source: 'raleigh_open_data',
    raw_data: permit,
  }
}

export async function fetchAndNormalizeRaleighPermits(options?: {
  daysBack?: number
  limit?: number
}): Promise<NormalizedPermit[]> {
  const rawPermits = await fetchRaleighPermits(options)
  return rawPermits.map(normalizeRaleighPermit)
}
