"use client"

import { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import { cn } from "@/lib/utils"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

interface Project {
  id: string
  name: string
  competitor: string
  coordinates: [number, number]
  value: string
  status: "active" | "pending" | "completed"
}

// Raleigh/Triangle area projects with NC coordinates
const projects: Project[] = [
  { id: "1", name: "Downtown Raleigh Office", competitor: "Clancy & Theys", coordinates: [-78.6382, 35.7796], value: "$4.2M", status: "active" },
  { id: "2", name: "RTP Tech Campus", competitor: "Barnhill Contracting", coordinates: [-78.8986, 35.8992], value: "$2.8M", status: "active" },
  { id: "3", name: "Durham Medical Center", competitor: "S.T. Wooten", coordinates: [-78.8986, 35.9940], value: "$6.1M", status: "pending" },
  { id: "4", name: "Cary Town Center", competitor: "Balfour Beatty", coordinates: [-78.7811, 35.7915], value: "$1.5M", status: "active" },
  { id: "5", name: "Wake Forest Subdivision", competitor: "Clancy & Theys", coordinates: [-78.5097, 35.9799], value: "$3.7M", status: "pending" },
  { id: "6", name: "Apex Retail Plaza", competitor: "Barnhill Contracting", coordinates: [-78.8503, 35.7327], value: "$2.1M", status: "completed" },
  { id: "7", name: "Chapel Hill Mixed Use", competitor: "S.T. Wooten", coordinates: [-79.0558, 35.9132], value: "$5.4M", status: "active" },
  { id: "8", name: "Morrisville Data Center", competitor: "Skanska USA", coordinates: [-78.8256, 35.8235], value: "$8.2M", status: "active" },
]

const competitorColors: Record<string, string> = {
  "Clancy & Theys": "#f59e0b",
  "Barnhill Contracting": "#ef4444",
  "S.T. Wooten": "#3b82f6",
  "Balfour Beatty": "#8b5cf6",
  "Skanska USA": "#10b981",
}

const statusStyles: Record<string, string> = {
  active: "ring-2 ring-offset-2 ring-offset-[#0a0f1a]",
  pending: "opacity-70",
  completed: "opacity-50",
}

export function CompetitorMap() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.competitor === filter)

  return (
    <div className="space-y-4">
      {/* Legend & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {Object.entries(competitorColors).map(([name, color]) => (
            <button
              key={name}
              onClick={() => setFilter(filter === name ? "all" : name)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                filter === name
                  ? "bg-[var(--signal-blue)]/20 border border-[var(--signal-blue)]"
                  : "bg-[var(--secondary)] hover:bg-[var(--secondary)]/80"
              )}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-foreground">{name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Completed
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden">
        <div className="h-[500px]">
          <ComposableMap
            projection="geoAlbersUsa"
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={[-78.8, 35.85]} zoom={8}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#2d3b52", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {filteredProjects.map((project) => (
                <Marker
                  key={project.id}
                  coordinates={project.coordinates}
                  onClick={() => setSelectedProject(project)}
                >
                  <circle
                    r={8}
                    fill={competitorColors[project.competitor]}
                    className={cn(
                      "cursor-pointer transition-all hover:r-10",
                      statusStyles[project.status],
                      selectedProject?.id === project.id && "ring-2 ring-white"
                    )}
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))",
                    }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Selected Project Info */}
        {selectedProject && (
          <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--secondary)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: competitorColors[selectedProject.competitor] }}
                />
                <div>
                  <h3 className="font-semibold text-foreground">{selectedProject.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProject.competitor}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">{selectedProject.value}</span>
                <p className="text-xs text-muted-foreground capitalize">{selectedProject.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
