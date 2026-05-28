"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Users,
  FileText,
  Zap,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Competitor Map", href: "/map", icon: Map, badge: 3 },
      { label: "Competitor Profiles", href: "/profiles", icon: Users },
    ],
  },
  {
    title: "DATA",
    items: [
      { label: "Permit Filings", href: "/permits", icon: FileText, badge: 12 },
      { label: "Signal Stream", href: "/signals", icon: Zap, badge: 5 },
      { label: "Market Trends", href: "/trends", icon: TrendingUp },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Alert Rules", href: "/alerts", icon: Bell, badge: 2 },
    ],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-[var(--glass-border)] bg-[var(--sidebar)] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--glass-border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--signal-blue)] text-white">
          <AlertTriangle className="w-5 h-5" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-foreground">SiteIntel</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 mb-2 text-xs font-medium tracking-wider text-muted-foreground">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-[var(--sidebar-accent)] text-[var(--signal-blue)]"
                          : "text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[var(--signal-blue)]")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="bg-[var(--signal-blue)]/20 text-[var(--signal-blue)] border-0 px-2 py-0.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--glass-border)] p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-[var(--glass-border)]">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[var(--secondary)] text-xs text-muted-foreground">MR</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Marcus Reid</p>
              <p className="text-xs text-muted-foreground truncate">Sr. BD Analyst</p>
            </div>
          )}
          {!collapsed && (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
