"use client"

import { useState } from "react"
import { Bell, Mail, Phone, Plus, Settings, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface AlertRule {
  id: string
  name: string
  competitor: string
  thresholdPercentage: number
  enabled: boolean
  notifyEmail: boolean
  notifySms: boolean
}

const initialRules: AlertRule[] = [
  {
    id: "1",
    name: "Apex High Activity",
    competitor: "Apex Construction",
    thresholdPercentage: 20,
    enabled: true,
    notifyEmail: true,
    notifySms: false,
  },
  {
    id: "2",
    name: "Summit Volume Spike",
    competitor: "Summit Builders",
    thresholdPercentage: 25,
    enabled: true,
    notifyEmail: true,
    notifySms: true,
  },
]

const competitorColors: Record<string, string> = {
  "Apex Construction": "#f59e0b",
  "Summit Builders": "#ef4444",
  "Pacific Development": "#3b82f6",
  "Ironclad Corp": "#8b5cf6",
}

export function AlertRules() {
  const [rules, setRules] = useState<AlertRule[]>(initialRules)

  const toggleRule = (id: string, field: keyof AlertRule) => {
    setRules(rules.map(rule => {
      if (rule.id === id && typeof rule[field] === "boolean") {
        return { ...rule, [field]: !rule[field] }
      }
      return rule
    }))
  }

  const updateThreshold = (id: string, value: number) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, thresholdPercentage: value }
      }
      return rule
    }))
  }

  return (
    <div className="space-y-6">
      {/* Add Rule Button */}
      <div className="flex justify-end">
        <Button className="bg-[var(--signal-blue)] hover:bg-[var(--signal-blue)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Alert Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={cn(
              "rounded-xl border bg-[var(--glass-bg)] backdrop-blur-sm p-6 transition-all",
              rule.enabled ? "border-[var(--glass-border)]" : "border-[var(--glass-border)]/50 opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Rule Info */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--signal-blue)]/20">
                  <Bell className="w-6 h-6 text-[var(--signal-blue)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{rule.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: competitorColors[rule.competitor] }}
                    />
                    <span className="text-sm text-muted-foreground">{rule.competitor}</span>
                  </div>
                </div>
              </div>

              {/* Rule Controls */}
              <div className="flex items-center gap-4">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id, "enabled")}
                />
                <button className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rule Settings */}
            <div className="mt-6 pt-6 border-t border-[var(--glass-border)] grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Threshold */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Threshold
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="number"
                    value={rule.thresholdPercentage}
                    onChange={(e) => updateThreshold(rule.id, parseInt(e.target.value) || 0)}
                    className="w-24 bg-[var(--secondary)] border-[var(--glass-border)]"
                    min={1}
                    max={100}
                  />
                  <span className="text-sm text-muted-foreground">% increase</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Alert when permit volume increases by this percentage
                </p>
              </div>

              {/* Email Notification */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email Alerts
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                      rule.notifyEmail ? "bg-emerald-500/20" : "bg-[var(--secondary)]"
                    )}
                  >
                    <Mail className={cn("w-5 h-5", rule.notifyEmail ? "text-emerald-400" : "text-muted-foreground")} />
                  </div>
                  <Switch
                    checked={rule.notifyEmail}
                    onCheckedChange={() => toggleRule(rule.id, "notifyEmail")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Send via Resend
                </p>
              </div>

              {/* SMS Notification */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  SMS Alerts
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                      rule.notifySms ? "bg-emerald-500/20" : "bg-[var(--secondary)]"
                    )}
                  >
                    <Phone className={cn("w-5 h-5", rule.notifySms ? "text-emerald-400" : "text-muted-foreground")} />
                  </div>
                  <Switch
                    checked={rule.notifySms}
                    onCheckedChange={() => toggleRule(rule.id, "notifySms")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Send via Twilio
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--signal-blue)]/10 p-4">
        <h4 className="font-medium text-foreground mb-2">How Threshold Alerts Work</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SiteIntel compares each competitor&apos;s permit volume from the last 30 days against
          the previous 30-day period. When the volume increases by more than your configured
          threshold percentage, a notification is generated and dispatched via your chosen channels.
        </p>
      </div>
    </div>
  )
}
