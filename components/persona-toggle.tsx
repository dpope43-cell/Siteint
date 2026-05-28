"use client"

import { HardHat, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePersona } from "@/lib/persona-context"

export function PersonaToggle() {
  const { mode, setMode } = usePersona()

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--secondary)] border border-[var(--glass-border)]">
      <button
        onClick={() => setMode("gc")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "gc"
            ? "bg-[var(--signal-blue)] text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HardHat className="w-4 h-4" />
        <span>GC Mode</span>
      </button>
      <button
        onClick={() => setMode("subcontractor")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "subcontractor"
            ? "bg-[var(--signal-blue)] text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Wrench className="w-4 h-4" />
        <span>Subcontractor</span>
      </button>
    </div>
  )
}
