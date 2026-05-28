"use client"

import { Truck, Users, HardHat, Wrench } from "lucide-react"

interface CapacityMetric {
  label: string
  value: number
  max: number
  unit: string
  icon: React.ElementType
}

const metrics: CapacityMetric[] = [
  { label: "Heavy Equipment", value: 78, max: 100, unit: "%", icon: Truck },
  { label: "Field Crews", value: 42, max: 50, unit: "teams", icon: Users },
  { label: "Active Supervisors", value: 28, max: 35, unit: "staff", icon: HardHat },
  { label: "Equipment Util.", value: 85, max: 100, unit: "%", icon: Wrench },
]

export function FleetCapacity() {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Fleet Capacity Index</h2>
        <p className="text-sm text-muted-foreground">Current resource utilization</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const percentage = (metric.value / metric.max) * 100
          return (
            <div
              key={metric.label}
              className="p-4 rounded-lg bg-[var(--secondary)]/50 border border-[var(--glass-border)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <metric.icon className="w-4 h-4 text-[var(--signal-blue)]" />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--signal-blue)] to-[var(--signal-blue)]/70"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
