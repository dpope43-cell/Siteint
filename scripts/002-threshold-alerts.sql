-- Threshold Alert Function
-- This function compares permit volume from last 30 days vs previous 30 days
-- Generates notification if increase > 20%

CREATE OR REPLACE FUNCTION check_competitor_threshold_alerts()
RETURNS TABLE (
  competitor_id UUID,
  competitor_name TEXT,
  current_period_count BIGINT,
  previous_period_count BIGINT,
  change_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT 
      p.competitor_id,
      COUNT(*) as permit_count
    FROM permits p
    WHERE p.filing_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.competitor_id
  ),
  previous_period AS (
    SELECT 
      p.competitor_id,
      COUNT(*) as permit_count
    FROM permits p
    WHERE p.filing_date >= CURRENT_DATE - INTERVAL '60 days'
      AND p.filing_date < CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.competitor_id
  )
  SELECT 
    c.id as competitor_id,
    c.name as competitor_name,
    COALESCE(cp.permit_count, 0) as current_period_count,
    COALESCE(pp.permit_count, 0) as previous_period_count,
    CASE 
      WHEN COALESCE(pp.permit_count, 0) = 0 THEN 100.0
      ELSE ROUND(((COALESCE(cp.permit_count, 0)::DECIMAL - pp.permit_count::DECIMAL) / pp.permit_count::DECIMAL) * 100, 2)
    END as change_percentage
  FROM competitors c
  LEFT JOIN current_period cp ON c.id = cp.competitor_id
  LEFT JOIN previous_period pp ON c.id = pp.competitor_id
  WHERE 
    CASE 
      WHEN COALESCE(pp.permit_count, 0) = 0 THEN 100.0
      ELSE ((COALESCE(cp.permit_count, 0)::DECIMAL - pp.permit_count::DECIMAL) / pp.permit_count::DECIMAL) * 100
    END > 20;
END;
$$ LANGUAGE plpgsql;

-- Function to generate threshold notifications
CREATE OR REPLACE FUNCTION generate_threshold_notifications()
RETURNS INTEGER AS $$
DECLARE
  alert RECORD;
  notification_count INTEGER := 0;
BEGIN
  FOR alert IN SELECT * FROM check_competitor_threshold_alerts()
  LOOP
    -- Check if we already have a notification for this competitor today
    IF NOT EXISTS (
      SELECT 1 FROM notifications 
      WHERE competitor_id = alert.competitor_id 
        AND type = 'threshold_alert'
        AND created_at >= CURRENT_DATE
    ) THEN
      INSERT INTO notifications (
        competitor_id,
        type,
        title,
        message,
        severity
      ) VALUES (
        alert.competitor_id,
        'threshold_alert',
        'Permit Volume Spike: ' || alert.competitor_name,
        alert.competitor_name || ' has increased permit filings by ' || 
        alert.change_percentage || '% (' || 
        alert.previous_period_count || ' → ' || 
        alert.current_period_count || ' permits in last 30 days)',
        CASE 
          WHEN alert.change_percentage > 50 THEN 'high'
          WHEN alert.change_percentage > 35 THEN 'medium'
          ELSE 'low'
        END
      );
      notification_count := notification_count + 1;
    END IF;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job trigger (if using pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('check-threshold-alerts', '0 */6 * * *', 'SELECT generate_threshold_notifications()');
