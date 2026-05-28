import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export interface Permit {
  id: string
  permit_number: string
  permit_type: string
  location: string
  value: number | null
  filed_date: string
  contractor_name: string | null
  latitude: number | null
  longitude: number | null
  competitor_id: string | null
  competitor: {
    id: string
    name: string
    color: string
  } | null
}

export interface CompetitorStats {
  id: string
  name: string
  color: string
  count: number
}

export interface Stats {
  competitorStats: CompetitorStats[]
  totalPermits: number
  totalValue: number
  dailyTrends: Record<string, Record<string, number>>
}

export interface Competitor {
  id: string
  name: string
  color: string
}

export function usePermits(options?: {
  competitorId?: string
  days?: number
  limit?: number
}) {
  const params = new URLSearchParams()
  if (options?.competitorId) params.set('competitor_id', options.competitorId)
  if (options?.days) params.set('days', options.days.toString())
  if (options?.limit) params.set('limit', options.limit.toString())
  
  const queryString = params.toString()
  const url = `/api/permits${queryString ? `?${queryString}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR<{ permits: Permit[] }>(url, fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })
  
  return {
    permits: data?.permits || [],
    isLoading,
    error,
    mutate,
  }
}

export function useStats(days = 30) {
  const { data, error, isLoading, mutate } = useSWR<Stats>(
    `/api/stats?days=${days}`,
    fetcher,
    { refreshInterval: 60000 }
  )
  
  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}

export function useCompetitors() {
  const { data, error, isLoading, mutate } = useSWR<{ competitors: Competitor[] }>(
    '/api/competitors',
    fetcher
  )
  
  return {
    competitors: data?.competitors || [],
    isLoading,
    error,
    mutate,
  }
}
