-- Migration: Add Raleigh Open Data specific fields
-- Run this after 001-create-schema.sql

-- Add contractor_name column to permits table (Raleigh provides this)
ALTER TABLE permits 
ADD COLUMN IF NOT EXISTS contractor_name TEXT;

-- Add source tracking column
ALTER TABLE permits
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Add raw_data column for storing original API response
ALTER TABLE permits
ADD COLUMN IF NOT EXISTS raw_data JSONB;

-- Add last_synced column for tracking ingestion
ALTER TABLE permits
ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP WITH TIME ZONE;

-- Create index for contractor name lookups
CREATE INDEX IF NOT EXISTS idx_permits_contractor_name ON permits(contractor_name);

-- Create index for source tracking
CREATE INDEX IF NOT EXISTS idx_permits_source ON permits(source);

-- Create index for date range queries (common for trend charts)
CREATE INDEX IF NOT EXISTS idx_permits_filed_date ON permits(filed_date DESC);

-- Create composite index for competitor + date queries
CREATE INDEX IF NOT EXISTS idx_permits_competitor_date ON permits(competitor_id, filed_date DESC);

-- Create a function to match contractors to competitors
CREATE OR REPLACE FUNCTION match_contractor_to_competitor(contractor TEXT)
RETURNS UUID AS $$
DECLARE
  matched_id UUID;
BEGIN
  -- Try exact match first
  SELECT id INTO matched_id 
  FROM competitors 
  WHERE LOWER(name) = LOWER(contractor)
  LIMIT 1;
  
  IF matched_id IS NOT NULL THEN
    RETURN matched_id;
  END IF;
  
  -- Try fuzzy match (contains)
  SELECT id INTO matched_id 
  FROM competitors 
  WHERE LOWER(contractor) LIKE '%' || LOWER(SPLIT_PART(name, ' ', 1)) || '%'
     OR LOWER(name) LIKE '%' || LOWER(SPLIT_PART(contractor, ' ', 1)) || '%'
  LIMIT 1;
  
  RETURN matched_id;
END;
$$ LANGUAGE plpgsql;

-- Create ingestion_logs table for tracking scraper runs
CREATE TABLE IF NOT EXISTS ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  records_fetched INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  error_message TEXT,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed'))
);

-- Create index for recent logs
CREATE INDEX IF NOT EXISTS idx_ingestion_logs_started ON ingestion_logs(started_at DESC);

-- Insert Raleigh-area competitors if not exists
INSERT INTO competitors (name, color) VALUES
  ('Clancy & Theys', '#f59e0b'),
  ('Barnhill Contracting', '#ef4444'),
  ('S.T. Wooten', '#3b82f6'),
  ('Balfour Beatty', '#8b5cf6'),
  ('Skanska USA', '#10b981')
ON CONFLICT (name) DO NOTHING;
