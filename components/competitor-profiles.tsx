"use client"

import { Building2, Users, TrendingUp, MapPin, ExternalLink, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Competitor {
  id: string
  name: string
  color: string
  description: string
  headquarters: string
  employees: string
  founded: string
  specialties: string[]
  permitCount: number
  activeProjects: number
  marketShare: number
  recentActivity: "high" | "medium" | "low"
}

// Raleigh-area competitors
const competitors: Competitor[] = [
  {
    id: "1",
    name: "Clancy & Theys",
    color: "#f59e0b",
    description: "One of the largest general contractors in the Southeast, specializing in commercial, healthcare, and multi-family construction across the Triangle.",
    headquarters: "Raleigh, NC",
    employees: "800+",
    founded: "1949",
    specialties: ["Commercial", "Healthcare", "Multi-Family"],
    permitCount: 24,
    activeProjects: 18,
    marketShare: 28,
    recentActivity: "high",
  },
  {
    id: "2",
    name: "Barnhill Contracting",
    color: "#ef4444",
    description: "Heavy civil contractor with strong infrastructure and roadwork presence throughout North Carolina.",
    headquarters: "Rocky Mount, NC",
    employees: "1,200+",
    founded: "1949",
    specialties: ["Heavy Civil", "Infrastructure", "Roadwork"],
    permitCount: 19,
    activeProjects: 14,
    marketShare: 22,
    recentActivity: "high",
  },
  {
    id: "3",
    name: "S.T. Wooten",
    color: "#3b82f6",
    description: "Regional leader in asphalt paving, site development, and utility construction serving the Triangle and Eastern NC.",
    headquarters: "Wilson, NC",
    employees: "900+",
    founded: "1952",
    specialties: ["Site Development", "Paving", "Utilities"],
    permitCount: 13,
    activeProjects: 9,
    marketShare: 18,
    recentActivity: "medium",
  },
  {
    id: "4",
    name: "Balfour Beatty",
    color: "#8b5cf6",
    description: "International construction company with major presence in NC education, healthcare, and commercial sectors.",
    headquarters: "Dallas, TX (NC Office: Raleigh)",
    employees: "2,500+",
    founded: "1909",
    specialties: ["Education", "Healthcare", "Commercial"],
    permitCount: 9,
    activeProjects: 6,
    marketShare: 15,
    recentActivity: "medium",
  },
  {
    id: "5",
    name: "Skanska USA",
    color: "#10b981",
    description: "Global construction firm with significant Triangle operations in commercial, infrastructure, and institutional projects.",
    headquarters: "New York, NY (NC Office: Durham)",
    employees: "10,000+",
    founded: "1887",
    specialties: ["Infrastructure", "Institutional", "Commercial"],
    permitCount: 7,
    activeProjects: 5,
    marketShare: 12,
    recentActivity: "low",
  },
]

const activityStyles = {
  high: { bg: "bg-red-500/20", text: "text-red-400" },
  medium: { bg: "bg-amber-500/20", text: "text-amber-400" },
  low: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
}

export function CompetitorProfiles() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {competitors.map((competitor) => (
        <div
          key={competitor.id}
          className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}
          <div
            className="p-4 border-b border-[var(--glass-border)]"
            style={{ background: `linear-gradient(135deg, ${competitor.color}20, transparent)` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: competitor.color }}
                >
                  {competitor.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {competitor.headquarters}
                  </div>
                </div>
              </div>
              <Badge
                className={`${activityStyles[competitor.recentActivity].bg} ${activityStyles[competitor.recentActivity].text}`}
              >
                {competitor.recentActivity} activity
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">{competitor.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[var(--secondary)]/50 text-center">
                <FileText className="w-4 h-4 mx-auto mb-1 text-[var(--signal-blue)]" />
                <p className="text-lg font-bold text-foreground">{competitor.permitCount}</p>
                <p className="text-xs text-muted-foreground">Permits (30d)</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--secondary)]/50 text-center">
                <Building2 className="w-4 h-4 mx-auto mb-1 text-[var(--signal-blue)]" />
                <p className="text-lg font-bold text-foreground">{competitor.activeProjects}</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--secondary)]/50 text-center">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-[var(--signal-blue)]" />
                <p className="text-lg font-bold text-foreground">{competitor.marketShare}%</p>
                <p className="text-xs text-muted-foreground">Market Share</p>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {competitor.employees}
              </span>
              <span>Est. {competitor.founded}</span>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2">
              {competitor.specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant="outline"
                  className="border-[var(--glass-border)] text-muted-foreground"
                >
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 border-[var(--glass-border)]">
                View Permits
              </Button>
              <Button size="sm" className="flex-1 bg-[var(--signal-blue)] hover:bg-[var(--signal-blue)]/90">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Full Profile
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
