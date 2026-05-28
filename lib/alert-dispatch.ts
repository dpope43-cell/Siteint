// Alert Dispatch Logic for SiteIntel
// Integrations for Resend (Email) and Twilio (SMS)

import { createClient } from "@supabase/supabase-js"

interface Notification {
  id: string
  competitor_id: string
  type: string
  title: string
  message: string
  severity: "high" | "medium" | "low"
  dispatched_email: boolean
  dispatched_sms: boolean
}

// Resend Email Integration Stub
export async function sendEmailAlert(notification: Notification, recipientEmail: string) {
  // Requires: RESEND_API_KEY environment variable
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.warn("[SiteIntel] RESEND_API_KEY not configured - skipping email dispatch")
    return { success: false, error: "API key not configured" }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SiteIntel Alerts <alerts@siteintel.app>",
        to: [recipientEmail],
        subject: `[${notification.severity.toUpperCase()}] ${notification.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #111827; color: #e2e8f0; padding: 20px; border-radius: 8px;">
              <h2 style="color: #3b82f6; margin: 0 0 16px 0;">${notification.title}</h2>
              <p style="margin: 0 0 16px 0; line-height: 1.6;">${notification.message}</p>
              <div style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: ${
                notification.severity === "high" ? "#ef4444" :
                notification.severity === "medium" ? "#f59e0b" : "#10b981"
              }; color: white;">
                ${notification.severity} Priority
              </div>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 16px; text-align: center;">
              SiteIntel Competitive Intelligence Platform
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("[SiteIntel] Email dispatch failed:", error)
    return { success: false, error }
  }
}

// Twilio SMS Integration Stub
export async function sendSMSAlert(notification: Notification, recipientPhone: string) {
  // Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn("[SiteIntel] Twilio credentials not configured - skipping SMS dispatch")
    return { success: false, error: "Twilio not configured" }
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: TWILIO_PHONE_NUMBER,
          To: recipientPhone,
          Body: `[SiteIntel ${notification.severity.toUpperCase()}] ${notification.title}: ${notification.message}`,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`)
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("[SiteIntel] SMS dispatch failed:", error)
    return { success: false, error }
  }
}

// Process pending notifications
export async function processPendingNotifications() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get unprocessed notifications
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .or("dispatched_email.eq.false,dispatched_sms.eq.false")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[SiteIntel] Failed to fetch notifications:", error)
    return { processed: 0, errors: [error] }
  }

  const results = {
    processed: 0,
    errors: [] as unknown[],
  }

  for (const notification of notifications || []) {
    // Get alert rules for this competitor
    const { data: rules } = await supabase
      .from("alert_rules")
      .select("*")
      .eq("competitor_id", notification.competitor_id)
      .eq("enabled", true)
      .single()

    if (rules) {
      // Send email if configured
      if (rules.notify_email && !notification.dispatched_email) {
        const emailResult = await sendEmailAlert(notification, "analyst@company.com")
        if (emailResult.success) {
          await supabase
            .from("notifications")
            .update({ dispatched_email: true })
            .eq("id", notification.id)
        }
      }

      // Send SMS if configured
      if (rules.notify_sms && !notification.dispatched_sms) {
        const smsResult = await sendSMSAlert(notification, "+1234567890")
        if (smsResult.success) {
          await supabase
            .from("notifications")
            .update({ dispatched_sms: true })
            .eq("id", notification.id)
        }
      }
    }

    results.processed++
  }

  return results
}
