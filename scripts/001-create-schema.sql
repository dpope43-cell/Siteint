-- SiteIntel Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permits table
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permit_number TEXT NOT NULL UNIQUE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  filing_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'under_review')),
  zone TEXT NOT NULL,
  coordinates POINT,
  threat_level TEXT CHECK (threat_level IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table for threshold alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('threshold_alert', 'new_permit', 'status_change')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  is_read BOOLEAN DEFAULT FALSE,
  dispatched_email BOOLEAN DEFAULT FALSE,
  dispatched_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert rules table
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  threshold_percentage DECIMAL(5, 2) NOT NULL DEFAULT 20.0,
  enabled BOOLEAN DEFAULT TRUE,
  notify_email BOOLEAN DEFAULT TRUE,
  notify_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table (for persona toggle)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  persona TEXT NOT NULL CHECK (persona IN ('gc', 'subcontractor')) DEFAULT 'gc',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_permits_competitor ON permits(competitor_id);
CREATE INDEX IF NOT EXISTS idx_permits_filing_date ON permits(filing_date);
CREATE INDEX IF NOT EXISTS idx_permits_zone ON permits(zone);
CREATE INDEX IF NOT EXISTS idx_notifications_competitor ON notifications(competitor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Insert seed data for competitors
INSERT INTO competitors (name, color) VALUES
  ('Apex Grading Co.', '#f59e0b'),
  ('Summit Build Group', '#ef4444'),
  ('Pacific Development', '#3b82f6'),
  ('Ironclad Contractors', '#8b5cf6')
ON CONFLICT (name) DO NOTHING;
