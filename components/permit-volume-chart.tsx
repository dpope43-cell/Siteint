"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useStats, useCompetitors } from "@/hooks/use-permits"
import { Spinner } from "@/components/ui/spinner"

// Fallback data when no database data available (May 2026)
const fallbackData = [
  { date: "Apr 28", "Clancy & Theys": 8, "Barnhill Contracting": 5, "S.T. Wooten": 7, "Balfour Beatty": 4 },
  { date: "May 01", "Clancy & Theys": 10, "Barnhill Contracting": 6, "S.T. Wooten": 8, "Balfour Beatty": 5 },
  { date: "May 04", "Clancy & Theys": 12, "Barnhill Contracting": 8, "S.T. Wooten": 9, "Balfour Beatty": 5 },
  { date: "May 07", "Clancy & Theys": 14, "Barnhill Contracting": 7, "S.T. Wooten": 10, "Balfour Beatty": 6 },
  { date: "May 10", "Clancy & Theys": 16, "Barnhill Contracting": 9, "S.T. Wooten": 8, "Balfour Beatty": 6 },
  { date: "May 13", "Clancy & Theys": 15, "Barnhill Contracting": 11, "S.T. Wooten": 9, "Balfour Beatty": 7 },
  { date: "May 16", "Clancy & Theys": 18, "Barnhill Contracting": 12, "S.T. Wooten": 11, "Balfour Beatty": 7 },
  { date: "May 19", "Clancy & Theys": 17, "Barnhill Contracting": 14, "S.T. Wooten": 10, "Balfour Beatty": 8 },
  { date: "May 22", "Clancy & Theys": 20, "Barnhill Contracting": 16, "S.T. Wooten": 12, "Balfour Beatty": 8 },
  { date: "May 25", "Clancy & Theys": 22, "Barnhill Contracting": 18, "S.T. Wooten": 11, "Balfour Beatty": 9 },
  { date: "May 27", "Clancy & Theys": 24, "Barnhill Contracting": 19, "S.T. Wooten": 13, "Balfour Beatty": 9 },
]

const fallbackCompetitors = [
  { key: "Clancy & Theys", color: "#f59e0b" },
  { key: "Barnhill Contracting", color: "#ef4444" },
  { key: "S.T. Wooten", color: "#3b82f6" },
  { key: "Balfour Beatty", color: "#8b5cf6" },
]

export function PermitVolumeChart() {
  const { stats, isLoading } = useStats(30)
  const { competitors: dbCompetitors } = useCompetitors()
  
  // Transform daily trends data for the chart
  const { chartData, competitors } = useMemo(() => {
    if (!stats?.dailyTrends || Object.keys(stats.dailyTrends).length === 0) {
      return { chartData: fallbackData, competitors: fallbackCompetitors }
    }
    
    // Get all unique competitor names from the data
    const competitorSet = new Set<string>()
    Object.values(stats.dailyTrends).forEach(dayData => {
      Object.keys(dayData).forEach(name => competitorSet.add(name))
    })
    
    // Build competitor list with colors
    const competitorList = Array.from(competitorSet).map(name => {
      const dbComp = dbCompetitors.find(c => c.name === name)
      return {
        key: name,
        color: dbComp?.color || '#6b7280'
      }
    })
    
    // Transform to chart format
    const data = Object.entries(stats.dailyTrends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => {
        const formatted = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return {
          date: formatted,
          ...counts
        }
      })
    
    return { chartData: data, competitors: competitorList }
  }, [stats, dbCompetitors])
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
        <div className="flex items-center justify-center h-72">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Permit Volume —
          </h2>
          <h3 className="text-xl font-semibold text-foreground">30 Day Trend</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Filings per competitor across monitored zones
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {competitors.map((comp) => (
            <div key={comp.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: comp.color }}
              />
              <span className="text-sm text-muted-foreground">{comp.key}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(59, 130, 246, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
              itemStyle={{ color: "#e2e8f0" }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 4 }}
            />
            {competitors.map((comp) => (
              <Line
                key={comp.key}
                type="monotone"
                dataKey={comp.key}
                stroke={comp.color}
                strokeWidth={2}
                dot={{ fill: comp.color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
