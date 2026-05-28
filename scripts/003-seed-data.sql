-- SiteIntel Seed Data
-- Run this after 001-create-schema.sql

-- Insert sample permits with the specific project example
INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-001',
  c.id,
  'Grading Permit',
  '4821 Sepulveda Blvd, Los Angeles, CA 90034',
  1200000.00,
  CURRENT_DATE - INTERVAL '3 days',
  'approved',
  'West LA',
  'high'
FROM competitors c WHERE c.name = 'Apex Grading Co.'
ON CONFLICT (permit_number) DO NOTHING;

INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-002',
  c.id,
  'Commercial Build',
  '1250 Wilshire Blvd, Santa Monica, CA 90401',
  2500000.00,
  CURRENT_DATE - INTERVAL '5 days',
  'pending',
  'Santa Monica',
  'high'
FROM competitors c WHERE c.name = 'Summit Build Group'
ON CONFLICT (permit_number) DO NOTHING;

INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-003',
  c.id,
  'Site Development',
  '8900 Venice Blvd, Culver City, CA 90232',
  890000.00,
  CURRENT_DATE - INTERVAL '7 days',
  'under_review',
  'Culver City',
  'medium'
FROM competitors c WHERE c.name = 'Pacific Development'
ON CONFLICT (permit_number) DO NOTHING;

INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-004',
  c.id,
  'Foundation Permit',
  '3200 Olympic Blvd, Los Angeles, CA 90019',
  1750000.00,
  CURRENT_DATE - INTERVAL '10 days',
  'approved',
  'Mid-City',
  'medium'
FROM competitors c WHERE c.name = 'Ironclad Contractors'
ON CONFLICT (permit_number) DO NOTHING;

INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-005',
  c.id,
  'Demolition Permit',
  '5500 Hollywood Blvd, Los Angeles, CA 90028',
  450000.00,
  CURRENT_DATE - INTERVAL '2 days',
  'pending',
  'Hollywood',
  'low'
FROM competitors c WHERE c.name = 'Apex Grading Co.'
ON CONFLICT (permit_number) DO NOTHING;

INSERT INTO permits (permit_number, competitor_id, type, location, value, filing_date, status, zone, threat_level)
SELECT 
  'PRM-2024-006',
  c.id,
  'Multi-Family Residential',
  '2100 Sawtelle Blvd, Los Angeles, CA 90025',
  3200000.00,
  CURRENT_DATE - INTERVAL '1 day',
  'under_review',
  'West LA',
  'high'
FROM competitors c WHERE c.name = 'Summit Build Group'
ON CONFLICT (permit_number) DO NOTHING;

-- Insert sample alert rule for 20% threshold
INSERT INTO alert_rules (name, competitor_id, threshold_percentage, enabled, notify_email, notify_sms)
SELECT 
  'Apex Volume Surge Alert',
  c.id,
  20.0,
  true,
  true,
  false
FROM competitors c WHERE c.name = 'Apex Grading Co.'
ON CONFLICT DO NOTHING;

INSERT INTO alert_rules (name, competitor_id, threshold_percentage, enabled, notify_email, notify_sms)
SELECT 
  'Summit Activity Monitor',
  c.id,
  20.0,
  true,
  true,
  true
FROM competitors c WHERE c.name = 'Summit Build Group'
ON CONFLICT DO NOTHING;
