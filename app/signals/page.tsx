import { DashboardLayout } from "@/components/dashboard-layout"
import { SignalStream } from "@/components/signal-stream"

export default function SignalsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Signal Stream</h1>
          <p className="text-sm text-muted-foreground">
            Real-time permit filing activity
          </p>
        </div>
        <SignalStream />
      </div>
    </DashboardLayout>
  )
}
