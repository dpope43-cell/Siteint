import { DashboardLayout } from "@/components/dashboard-layout"
import { PermitFilings } from "@/components/permit-filings"

export default function PermitsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permit Filings</h1>
          <p className="text-sm text-muted-foreground">
            Complete database of monitored permit applications
          </p>
        </div>
        <PermitFilings />
      </div>
    </DashboardLayout>
  )
}
