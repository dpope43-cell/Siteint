"use client"

import { Sidebar } from "./sidebar"
import { PersonaProvider } from "@/lib/persona-context"
import { PersonaToggle } from "./persona-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PersonaProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-end gap-4 px-6 py-3 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm">
            <PersonaToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </PersonaProvider>
  )
}
