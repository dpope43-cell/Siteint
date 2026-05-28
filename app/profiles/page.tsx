import { DashboardLayout } from "@/components/dashboard-layout"
import { CompetitorProfiles } from "@/components/competitor-profiles"

export default function ProfilesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Competitor Profiles</h1>
          <p className="text-sm text-muted-foreground">
            Detailed intelligence on monitored competitors
          </p>
        </div>
        <CompetitorProfiles />
      </div>
    </DashboardLayout>
  )
}
