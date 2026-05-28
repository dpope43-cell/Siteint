import { DashboardLayout } from "@/components/dashboard-layout"
import { PermitVolumeChart } from "@/components/permit-volume-chart"
import { CompetitorVelocity } from "@/components/competitor-velocity"
import { FleetCapacity } from "@/components/fleet-capacity"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Competitive intelligence overview
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Data</span>
          </div>
        </div>

        {/* Main Chart */}
        <PermitVolumeChart />

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompetitorVelocity />
          <FleetCapacity />
        </div>
      </div>
    </DashboardLayout>
  )
}
