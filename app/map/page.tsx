import { DashboardLayout } from "@/components/dashboard-layout"
import { CompetitorMap } from "@/components/competitor-map"

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Competitor Map</h1>
          <p className="text-sm text-muted-foreground">
            Geographic distribution of competitor projects
          </p>
        </div>
        <CompetitorMap />
      </div>
    </DashboardLayout>
  )
}
