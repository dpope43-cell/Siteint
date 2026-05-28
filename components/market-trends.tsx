"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Building2, DollarSign } from "lucide-react"

const monthlyData = [
  { month: "Jan", commercial: 45, residential: 32, industrial: 18 },
  { month: "Feb", commercial: 52, residential: 28, industrial: 22 },
  { month: "Mar", commercial: 48, residential: 35, industrial: 20 },
  { month: "Apr", commercial: 61, residential: 42, industrial: 25 },
]

// Raleigh-area market share
const marketShare = [
  { name: "Clancy & Theys", value: 28, color: "#f59e0b" },
  { name: "Barnhill", value: 22, color: "#ef4444" },
  { name: "S.T. Wooten", value: 18, color: "#3b82f6" },
  { name: "Balfour Beatty", value: 15, color: "#8b5cf6" },
  { name: "Skanska", value: 12, color: "#10b981" },
  { name: "Others", value: 5, color: "#64748b" },
]

const stats = [
  { label: "Total Market Value", value: "$284M", change: 12.5, trend: "up" as const, icon: DollarSign },
  { label: "Active Projects", value: "847", change: 8.2, trend: "up" as const, icon: Building2 },
  { label: "Avg. Project Size", value: "$2.4M", change: -3.1, trend: "down" as const, icon: TrendingUp },
  { label: "New Permits (30d)", value: "156", change: 22.7, trend: "up" as const, icon: Building2 },
]

export function MarketTrends() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--signal-blue)]/20">
                <stat.icon className="w-5 h-5 text-[var(--signal-blue)]" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                  stat.trend === "up"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permit Volume by Type */}
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Permit Volume by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(59, 130, 246, 0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Bar dataKey="commercial" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="residential" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="industrial" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded bg-[#3b82f6]" /> Commercial
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded bg-[#10b981]" /> Residential
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded bg-[#f59e0b]" /> Industrial
            </span>
          </div>
        </div>

        {/* Market Share */}
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Market Share Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
