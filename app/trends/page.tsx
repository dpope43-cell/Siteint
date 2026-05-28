import { DashboardLayout } from "@/components/dashboard-layout"
import { MarketTrends } from "@/components/market-trends"

export default function TrendsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Trends</h1>
          <p className="text-sm text-muted-foreground">
            Industry analytics and market intelligence
          </p>
        </div>
        <MarketTrends />
      </div>
    </DashboardLayout>
  )
}
