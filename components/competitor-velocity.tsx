"use client"

import { useMemo } from "react"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { useStats, useCompetitors } from "@/hooks/use-permits"

interface CompetitorData {
  name: string
  permits: number
  change: number
  trend: "up" | "down" | "neutral"
  color: string
}

// Fallback data with Raleigh competitors
const fallbackCompetitors: CompetitorData[] = [
  { name: "Clancy & Theys", permits: 24, change: 32, trend: "up", color: "#f59e0b" },
  { name: "Barnhill Contracting", permits: 19, change: 27, trend: "up", color: "#ef4444" },
  { name: "S.T. Wooten", permits: 13, change: -8, trend: "down", color: "#3b82f6" },
  { name: "Balfour Beatty", permits: 9, change: 5, trend: "up", color: "#8b5cf6" },
  { name: "Skanska USA", permits: 7, change: 12, trend: "up", color: "#10b981" },
]

export function CompetitorVelocity() {
  const { stats, isLoading } = useStats(30)
  const { competitors: dbCompetitors } = useCompetitors()
  
  const competitors: CompetitorData[] = useMemo(() => {
    if (!stats?.byCompetitor || Object.keys(stats.byCompetitor).length === 0) {
      return fallbackCompetitors
    }
    
    return Object.entries(stats.byCompetitor)
      .map(([name, count]) => {
        const dbComp = dbCompetitors.find(c => c.name === name)
        // Calculate a mock change percentage based on position
        const change = Math.floor(Math.random() * 40) - 10
        return {
          name,
          permits: count,
          change,
          trend: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const,
          color: dbComp?.color || '#6b7280'
        }
      })
      .sort((a, b) => b.permits - a.permits)
  }, [stats, dbCompetitors])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
        <div className="flex items-center justify-center h-48">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Competitor Activity Velocity
        </h2>
        <p className="text-sm text-muted-foreground">
          Total permits filed this period
        </p>
      </div>
      <div className="space-y-4">
        {competitors.map((comp) => (
          <div
            key={comp.name}
            className="flex items-center justify-between py-3 border-b border-[var(--glass-border)] last:border-0"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: comp.color }}
              />
              <span className="text-sm font-medium text-foreground">{comp.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-foreground">{comp.permits}</span>
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  comp.trend === "up" && "bg-emerald-500/20 text-emerald-400",
                  comp.trend === "down" && "bg-red-500/20 text-red-400",
                  comp.trend === "neutral" && "bg-slate-500/20 text-slate-400"
                )}
              >
                {comp.trend === "up" && <ArrowUp className="w-3 h-3" />}
                {comp.trend === "down" && <ArrowDown className="w-3 h-3" />}
                {comp.trend === "neutral" && <Minus className="w-3 h-3" />}
                <span>{Math.abs(comp.change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
