"use client"

import { useState, useMemo } from "react"
import { FileText, MapPin, Clock, AlertTriangle, CheckCircle, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { usePermits, useCompetitors } from "@/hooks/use-permits"

type ThreatLevel = "high" | "medium" | "low"

interface Signal {
  id: string
  competitor: string
  permitType: string
  location: string
  value: string
  timestamp: string
  threatLevel: ThreatLevel
  zone: string
}

// Raleigh-area fallback signals
const fallbackSignals: Signal[] = [
  {
    id: "1",
    competitor: "Clancy & Theys",
    permitType: "Commercial Build",
    location: "333 Fayetteville St, Raleigh",
    value: "$4.2M",
    timestamp: "2 min ago",
    threatLevel: "high",
    zone: "Downtown Raleigh",
  },
  {
    id: "2",
    competitor: "Barnhill Contracting",
    permitType: "Site Development",
    location: "100 RTP Dr, Durham",
    value: "$2.8M",
    timestamp: "15 min ago",
    threatLevel: "high",
    zone: "RTP",
  },
  {
    id: "3",
    competitor: "S.T. Wooten",
    permitType: "Infrastructure",
    location: "500 Erwin Rd, Durham",
    value: "$890K",
    timestamp: "32 min ago",
    threatLevel: "medium",
    zone: "Durham",
  },
  {
    id: "4",
    competitor: "Balfour Beatty",
    permitType: "Healthcare Facility",
    location: "101 Manning Dr, Chapel Hill",
    value: "$1.75M",
    timestamp: "1 hr ago",
    threatLevel: "medium",
    zone: "Chapel Hill",
  },
  {
    id: "5",
    competitor: "Clancy & Theys",
    permitType: "Multi-Family",
    location: "1200 New Bern Ave, Raleigh",
    value: "$6.1M",
    timestamp: "2 hr ago",
    threatLevel: "high",
    zone: "East Raleigh",
  },
  {
    id: "6",
    competitor: "Barnhill Contracting",
    permitType: "Road Construction",
    location: "Highway 540, Wake County",
    value: "$3.2M",
    timestamp: "3 hr ago",
    threatLevel: "high",
    zone: "Wake County",
  },
  {
    id: "7",
    competitor: "S.T. Wooten",
    permitType: "Utility Work",
    location: "200 W Main St, Durham",
    value: "$2.1M",
    timestamp: "4 hr ago",
    threatLevel: "medium",
    zone: "Durham",
  },
  {
    id: "8",
    competitor: "Skanska USA",
    permitType: "Data Center",
    location: "400 Airport Blvd, Morrisville",
    value: "$8.2M",
    timestamp: "5 hr ago",
    threatLevel: "high",
    zone: "Morrisville",
  },
]

const threatColors: Record<ThreatLevel, { bg: string; text: string; border: string }> = {
  high: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  medium: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  low: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
}

const competitorColors: Record<string, string> = {
  "Clancy & Theys": "#f59e0b",
  "Barnhill Contracting": "#ef4444",
  "S.T. Wooten": "#3b82f6",
  "Balfour Beatty": "#8b5cf6",
  "Skanska USA": "#10b981",
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function formatValue(value: number | null): string {
  if (!value) return 'N/A'
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

function calculateThreatLevel(value: number | null): ThreatLevel {
  if (!value) return 'low'
  if (value >= 1000000) return 'high'
  if (value >= 500000) return 'medium'
  return 'low'
}

export function SignalStream() {
  const [filter, setFilter] = useState<ThreatLevel | "all">("all")
  const { permits, isLoading } = usePermits({ days: 30, limit: 50 })
  const { competitors } = useCompetitors()
  
  // Build competitor color map
  const competitorColorMap = useMemo(() => {
    const map: Record<string, string> = { ...competitorColors }
    competitors.forEach(c => {
      map[c.name] = c.color
    })
    return map
  }, [competitors])
  
  // Transform permits to signals
  const signals: Signal[] = useMemo(() => {
    if (permits.length === 0) return fallbackSignals
    
    return permits.map((permit, index) => ({
      id: permit.id || String(index),
      competitor: permit.competitor?.name || permit.contractor_name || 'Unknown',
      permitType: permit.permit_type,
      location: permit.location,
      value: formatValue(permit.value),
      timestamp: formatTimeAgo(permit.filed_date),
      threatLevel: calculateThreatLevel(permit.value),
      zone: permit.location.split(',')[1]?.trim() || 'Raleigh',
    }))
  }, [permits])

  const filteredSignals = filter === "all" 
    ? signals 
    : signals.filter(s => s.threatLevel === filter)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Filter:</span>
        {(["all", "high", "medium", "low"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              filter === level
                ? "bg-[var(--signal-blue)] text-white"
                : "bg-[var(--secondary)] text-muted-foreground hover:text-foreground"
            )}
          >
            {level === "all" ? "All Signals" : `${level.charAt(0).toUpperCase() + level.slice(1)} Threat`}
          </button>
        ))}
      </div>

      {/* Signal Feed */}
      <div className="space-y-3">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            className={cn(
              "rounded-xl border bg-[var(--glass-bg)] backdrop-blur-sm p-4 transition-all hover:bg-[var(--glass-bg)]/80",
              threatColors[signal.threatLevel].border
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Threat Indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    threatColors[signal.threatLevel].bg
                  )}
                >
                  {signal.threatLevel === "high" ? (
                    <AlertTriangle className={cn("w-5 h-5", threatColors[signal.threatLevel].text)} />
                  ) : signal.threatLevel === "medium" ? (
                    <FileText className={cn("w-5 h-5", threatColors[signal.threatLevel].text)} />
                  ) : (
                    <CheckCircle className={cn("w-5 h-5", threatColors[signal.threatLevel].text)} />
                  )}
                </div>

                {/* Signal Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: competitorColorMap[signal.competitor] || '#6b7280' }}
                    />
                    <span className="font-semibold text-foreground">{signal.competitor}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        threatColors[signal.threatLevel].bg,
                        threatColors[signal.threatLevel].text
                      )}
                    >
                      {signal.threatLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {signal.permitType}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {signal.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Value and Time */}
              <div className="text-right space-y-1">
                <span className="text-lg font-bold text-foreground">{signal.value}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                  <Clock className="w-3 h-3" />
                  {signal.timestamp}
                </div>
                <Badge variant="outline" className="text-xs border-[var(--glass-border)] text-muted-foreground">
                  {signal.zone}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
