import { DashboardLayout } from "@/components/dashboard-layout"
import { AlertRules } from "@/components/alert-rules"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alert Rules</h1>
          <p className="text-sm text-muted-foreground">
            Configure threshold alerts and notification preferences
          </p>
        </div>
        <AlertRules />
      </div>
    </DashboardLayout>
  )
}
