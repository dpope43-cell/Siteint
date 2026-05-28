"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type PersonaMode = "gc" | "subcontractor"

interface PersonaContextType {
  mode: PersonaMode
  setMode: (mode: PersonaMode) => void
  labels: {
    signals: string
    competitors: string
    permits: string
    focus: string
  }
}

const personaLabels = {
  gc: {
    signals: "Threat Signals",
    competitors: "Competitors",
    permits: "Competitor Permits",
    focus: "Monitor competitor activity and market threats",
  },
  subcontractor: {
    signals: "Lead Signals",
    competitors: "Potential Partners",
    permits: "Project Opportunities",
    focus: "Discover bid opportunities and partnership leads",
  },
}

const PersonaContext = createContext<PersonaContextType | null>(null)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PersonaMode>("gc")

  return (
    <PersonaContext.Provider
      value={{
        mode,
        setMode,
        labels: personaLabels[mode],
      }}
    >
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider")
  }
  return context
}
