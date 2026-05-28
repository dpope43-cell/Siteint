"use client"

import { useState } from "react"
import { Search, Filter, Download, ExternalLink, Calendar, Building2, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Permit {
  id: string
  permitNumber: string
  competitor: string
  type: string
  location: string
  value: number
  filingDate: string
  status: "approved" | "pending" | "under_review"
  zone: string
}

// Raleigh-area permits (May 2026)
const permits: Permit[] = [
  { id: "1", permitNumber: "PMT-2026-005234", competitor: "Clancy & Theys", type: "Commercial Build", location: "333 Fayetteville St, Raleigh", value: 4200000, filingDate: "2026-05-27", status: "approved", zone: "Downtown Raleigh" },
  { id: "2", permitNumber: "PMT-2026-005235", competitor: "Barnhill Contracting", type: "Site Development", location: "100 RTP Dr, Durham", value: 2800000, filingDate: "2026-05-26", status: "pending", zone: "RTP" },
  { id: "3", permitNumber: "PMT-2026-005236", competitor: "S.T. Wooten", type: "Infrastructure", location: "500 Erwin Rd, Durham", value: 1500000, filingDate: "2026-05-25", status: "under_review", zone: "Durham" },
  { id: "4", permitNumber: "PMT-2026-005237", competitor: "Balfour Beatty", type: "Healthcare Facility", location: "101 Manning Dr, Chapel Hill", value: 890000, filingDate: "2026-05-24", status: "approved", zone: "Chapel Hill" },
  { id: "5", permitNumber: "PMT-2026-005238", competitor: "Clancy & Theys", type: "Multi-Family", location: "1200 New Bern Ave, Raleigh", value: 6100000, filingDate: "2026-05-23", status: "pending", zone: "East Raleigh" },
  { id: "6", permitNumber: "PMT-2026-005239", competitor: "Barnhill Contracting", type: "Road Construction", location: "Highway 540, Wake County", value: 450000, filingDate: "2026-05-22", status: "approved", zone: "Wake County" },
  { id: "7", permitNumber: "PMT-2026-005240", competitor: "S.T. Wooten", type: "Utility Work", location: "200 W Main St, Durham", value: 3700000, filingDate: "2026-05-21", status: "under_review", zone: "Durham" },
  { id: "8", permitNumber: "PMT-2026-005241", competitor: "Skanska USA", type: "Commercial Build", location: "400 Airport Blvd, Morrisville", value: 8200000, filingDate: "2026-05-20", status: "approved", zone: "Morrisville" },
]

const competitorColors: Record<string, string> = {
  "Clancy & Theys": "#f59e0b",
  "Barnhill Contracting": "#ef4444",
  "S.T. Wooten": "#3b82f6",
  "Balfour Beatty": "#8b5cf6",
  "Skanska USA": "#10b981",
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  pending: { bg: "bg-amber-500/20", text: "text-amber-400" },
  under_review: { bg: "bg-blue-500/20", text: "text-blue-400" },
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  return `$${(value / 1000).toFixed(0)}K`
}

export function PermitFilings() {
  const [search, setSearch] = useState("")
  
  const filteredPermits = permits.filter(p => 
    p.competitor.toLowerCase().includes(search.toLowerCase()) ||
    p.permitNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search permits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[var(--secondary)] border-[var(--glass-border)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[var(--glass-border)]">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="border-[var(--glass-border)]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-[var(--secondary)]/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Permit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Competitor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Filed</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredPermits.map((permit) => (
                <tr key={permit.id} className="hover:bg-[var(--secondary)]/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-[var(--signal-blue)]">{permit.permitNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: competitorColors[permit.competitor] }}
                      />
                      <span className="text-sm text-foreground">{permit.competitor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5" />
                      {permit.type}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{permit.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(permit.value)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        statusStyles[permit.status].bg,
                        statusStyles[permit.status].text
                      )}
                    >
                      {permit.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(permit.filingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
