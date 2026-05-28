"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, Clock, Database } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface IngestionLog {
  id: string
  source: string
  started_at: string
  completed_at: string | null
  records_fetched: number
  records_inserted: number
  records_updated: number
  records_skipped: number
  error_message: string | null
  status: "running" | "completed" | "failed"
}

export default function IngestPage() {
  const [isIngesting, setIsIngesting] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: boolean
    recordsInserted: number
    recordsUpdated: number
    error?: string
  } | null>(null)

  const { data: logsData, mutate: mutateLogs } = useSWR<{ logs: IngestionLog[] }>(
    "/api/ingest/raleigh",
    fetcher,
    { refreshInterval: isIngesting ? 5000 : 30000 }
  )

  const logs = logsData?.logs || []

  async function handleIngest() {
    setIsIngesting(true)
    setLastResult(null)

    try {
      const response = await fetch("/api/ingest/raleigh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysBack: 30, limit: 500 }),
      })

      const result = await response.json()

      if (response.ok) {
        setLastResult({
          success: true,
          recordsInserted: result.recordsInserted,
          recordsUpdated: result.recordsUpdated,
        })
      } else {
        setLastResult({
          success: false,
          recordsInserted: 0,
          recordsUpdated: 0,
          error: result.error || "Unknown error",
        })
      }

      mutateLogs()
    } catch (err) {
      setLastResult({
        success: false,
        recordsInserted: 0,
        recordsUpdated: 0,
        error: err instanceof Error ? err.message : "Network error",
      })
    } finally {
      setIsIngesting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Ingestion</h1>
          <p className="text-muted-foreground">
            Manage permit data ingestion from Raleigh Open Data Portal
          </p>
        </div>

        {/* Trigger Card */}
        <Card className="border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Raleigh Open Data
            </CardTitle>
            <CardDescription>
              Fetch commercial building permits from data.raleighnc.gov
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleIngest}
                disabled={isIngesting}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isIngesting ? "animate-spin" : ""}`} />
                {isIngesting ? "Ingesting..." : "Run Ingestion"}
              </Button>

              {lastResult && (
                <div className="flex items-center gap-2">
                  {lastResult.success ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-emerald-400">
                        {lastResult.recordsInserted} inserted, {lastResult.recordsUpdated} updated
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-red-400">{lastResult.error}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Daily cron job runs at 6:00 AM UTC. Configure CRON_SECRET env var for production.
            </p>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Ingestion Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ingestion logs yet</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      {log.status === "completed" && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      {log.status === "failed" && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      {log.status === "running" && (
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {log.source}
                          </span>
                          <Badge
                            variant={
                              log.status === "completed"
                                ? "default"
                                : log.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {log.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(log.started_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-foreground">
                        {log.records_fetched} fetched
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.records_inserted} new, {log.records_updated} updated
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
