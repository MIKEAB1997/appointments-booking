-- ============================================================
-- NextGen — Database Schema (Supabase / PostgreSQL)
-- ============================================================
-- Multi-tenant SaaS for appointment booking & business growth
-- All tables use tenant_id + RLS for strict isolation
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'owner', 'staff', 'customer');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'no_show', 'completed', 'expired');
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial', 'cancelled');
CREATE TYPE plan_tier AS ENUM ('starter', 'pro', 'scale');
CREATE TYPE vertical_type AS ENUM ('fitness', 'beauty');
CREATE TYPE customer_tier AS ENUM ('new', 'regular', 'vip');
CREATE TYPE day_of_week AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
CREATE TYPE audit_action AS ENUM (
  'create', 'update', 'delete',
  'login', 'logout', 'impersonate',
  'booking_create', 'booking_confirm', 'booking_cancel', 'booking_reschedule', 'booking_no_show', 'booking_complete',
  'points_earn', 'points_lose',
  'settings_update', 'template_update', 'policy_update'
);

-- ============================================================
-- 1. TENANTS (Businesses)
-- ============================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(63) NOT NULL UNIQUE,           -- subdomain: {slug}.nextgen.co.il
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  vertical vertical_type NOT NULL,
  status tenant_status NOT NULL DEFAULT 'trial',
  plan plan_tier NOT NULL DEFAULT 'starter',

  -- Business info
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  logo_url TEXT,
  cover_image_url TEXT,

  -- Website config
  template_id UUID,                            -- references templates table
  website_data JSONB DEFAULT '{}',             -- structured form data for template
  custom_domain VARCHAR(255),
  is_website_published BOOLEAN DEFAULT FALSE,

  -- Settings
  default_buffer_minutes INTEGER DEFAULT 10,   -- beauty: cleanup between appointments
  cancellation_window_hours INTEGER DEFAULT 4, -- free cancel up to X hours before
  late_cancel_penalty_points INTEGER DEFAULT 30,
  no_show_penalty_points INTEGER DEFAULT 30,
  reschedule_bonus_points INTEGER DEFAULT 10,
  booking_points INTEGER DEFAULT 5,
  attendance_points INTEGER DEFAULT 25,
  streak_bonus_points INTEGER DEFAULT 20,

  -- Tier thresholds (60-day rolling window)
  tier_regular_min_visits INTEGER DEFAULT 3,
  tier_vip_min_visits INTEGER DEFAULT 8,

  -- Metadata
  timezone VARCHAR(50) DEFAULT 'Asia/Jerusalem',
  currency VARCHAR(3) DEFAULT 'ILS',
  locale VARCHAR(10) DEFAULT 'he-IL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);

-- ============================================================
-- 2. USERS (All user types)
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE,                         -- Supabase Auth user ID
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,

  -- Customer-specific (gamification)
  total_points INTEGER DEFAULT 0,
  current_tier customer_tier DEFAULT 'new',
  current_streak INTEGER DEFAULT 0,            -- consecutive weeks with 2+ visits
  last_visit_at TIMESTAMPTZ,
  is_at_risk BOOLEAN DEFAULT FALSE,            -- no visit in 14+ days

  -- Staff-specific
  is_active BOOLEAN DEFAULT TRUE,
  specialties TEXT[],                          -- array of service IDs or names

  -- Soft signup tracking
  is_registered BOOLEAN DEFAULT FALSE,         -- completed signup (not just guest booking)
  guest_booking_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_users_email ON users(tenant_id, email);
CREATE INDEX idx_users_role ON users(tenant_id, role);
CREATE INDEX idx_users_at_risk ON users(tenant_id, is_at_risk) WHERE is_at_risk = TRUE;

-- ============================================================
-- 3. SERVICES
-- ============================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,           -- service duration
  buffer_minutes INTEGER DEFAULT 0,            -- cleanup/prep after (beauty)
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'ILS',
  max_participants INTEGER DEFAULT 1,          -- >1 for fitness classes
  color VARCHAR(7),                            -- hex color for calendar
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,

  -- Upsell (Phase 2)
  upsell_service_id UUID REFERENCES services(id),
  upsell_enabled BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_tenant ON services(tenant_id);
CREATE INDEX idx_services_active ON services(tenant_id, is_active) WHERE is_active = TRUE;

-- ============================================================
-- 4. STAFF-SERVICE MAPPING
-- ============================================================

CREATE TABLE staff_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(staff_id, service_id)
);

CREATE INDEX idx_staff_services_tenant ON staff_services(tenant_id);

-- ============================================================
-- 5. WORKING HOURS / AVAILABILITY
-- ============================================================

CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL = business-level default
  day day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX idx_working_hours_tenant ON working_hours(tenant_id);
CREATE INDEX idx_working_hours_staff ON working_hours(tenant_id, staff_id);

-- ============================================================
-- 6. BLOCKED TIMES (Holidays, breaks, vacations)
-- ============================================================

CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL = all staff
  title VARCHAR(255),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,                        -- iCal RRULE format
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_block_range CHECK (start_at < end_at)
);

CREATE INDEX idx_blocked_times_tenant ON blocked_times(tenant_id);
CREATE INDEX idx_blocked_times_range ON blocked_times(tenant_id, start_at, end_at);

-- ============================================================
-- 7. BOOKINGS
-- ============================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  customer_id UUID REFERENCES users(id),       -- NULL for unverified guest
  staff_id UUID REFERENCES users(id),

  -- Booking details
  status booking_status NOT NULL DEFAULT 'pending',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,

  -- Guest info (before verification)
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),

  -- Verification
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMPTZ,
  otp_attempts INTEGER DEFAULT 0,
  recovery_sent BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,

  -- Pending expiry
  pending_expires_at TIMESTAMPTZ,              -- 10 min after creation

  -- Cancellation/reschedule
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  is_late_cancel BOOLEAN DEFAULT FALSE,
  rescheduled_from_id UUID REFERENCES bookings(id),

  -- Attendance
  checked_in_at TIMESTAMPTZ,
  points_awarded INTEGER DEFAULT 0,

  -- Metadata
  notes TEXT,                                  -- business notes on this booking
  source VARCHAR(50) DEFAULT 'web',            -- web, app, manual, waitlist
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_booking_range CHECK (start_at < end_at)
);

CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_customer ON bookings(tenant_id, customer_id);
CREATE INDEX idx_bookings_staff ON bookings(tenant_id, staff_id);
CREATE INDEX idx_bookings_status ON bookings(tenant_id, status);
CREATE INDEX idx_bookings_date ON bookings(tenant_id, start_at);
CREATE INDEX idx_bookings_pending ON bookings(tenant_id, status, pending_expires_at)
  WHERE status = 'pending';
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email)
  WHERE guest_email IS NOT NULL;

-- ============================================================
-- 8. WAITLIST (Phase 2 — Fitness classes)
-- ============================================================

CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  customer_id UUID NOT NULL REFERENCES users(id),
  staff_id UUID REFERENCES users(id),
  target_date DATE NOT NULL,
  target_time TIME,
  position INTEGER NOT NULL,                   -- queue position
  notified_at TIMESTAMPTZ,                     -- when offer was sent
  offer_expires_at TIMESTAMPTZ,                -- deadline to accept
  status VARCHAR(20) DEFAULT 'waiting',        -- waiting, offered, accepted, expired
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(tenant_id, service_id, customer_id, target_date)
);

CREATE INDEX idx_waitlist_tenant ON waitlist(tenant_id);
CREATE INDEX idx_waitlist_service_date ON waitlist(tenant_id, service_id, target_date);

-- ============================================================
-- 9. POINTS LEDGER (Gamification audit trail)
-- ============================================================

CREATE TABLE points_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  points INTEGER NOT NULL,                     -- positive = earn, negative = lose
  reason VARCHAR(100) NOT NULL,                -- 'booking', 'attendance', 'reschedule', 'late_cancel', 'no_show', 'streak'
  balance_after INTEGER NOT NULL,              -- running balance
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_tenant ON points_ledger(tenant_id);
CREATE INDEX idx_points_customer ON points_ledger(tenant_id, customer_id);
CREATE INDEX idx_points_date ON points_ledger(tenant_id, created_at);

-- ============================================================
-- 10. TEMPLATES (Business website templates)
-- ============================================================

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  vertical vertical_type NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  blocks JSONB NOT NULL DEFAULT '[]',          -- ordered list of block types + defaults
  design_tokens JSONB DEFAULT '{}',            -- colors, fonts, spacing
  is_active BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_vertical ON templates(vertical);
CREATE INDEX idx_templates_active ON templates(is_active) WHERE is_active = TRUE;

-- ============================================================
-- 11. NOTIFICATIONS LOG
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  channel VARCHAR(20) NOT NULL DEFAULT 'email', -- email, sms (Phase 2), whatsapp (Phase 3)
  type VARCHAR(50) NOT NULL,                    -- otp, confirmation, reminder_24h, reminder_2h, recovery, weekly_summary, at_risk
  recipient VARCHAR(255) NOT NULL,              -- email address or phone
  subject TEXT,
  body TEXT,
  status VARCHAR(20) DEFAULT 'pending',         -- pending, sent, delivered, failed, bounced
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_user ON notifications(tenant_id, user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- ============================================================
-- 12. AUDIT LOG
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),       -- NULL for platform-level actions
  actor_id UUID REFERENCES users(id),
  actor_role user_role,
  action audit_action NOT NULL,
  resource_type VARCHAR(50) NOT NULL,           -- 'booking', 'service', 'tenant', etc.
  resource_id UUID,
  changes JSONB DEFAULT '{}',                   -- { before: {}, after: {} }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log is append-only — no updates or deletes
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- ============================================================
-- 13. FEATURE FLAGS
-- ============================================================

CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL UNIQUE,             -- 'waitlist_automation', 'ai_website_builder', etc.
  description TEXT,
  is_global BOOLEAN DEFAULT FALSE,              -- enabled for all tenants
  enabled_tenants UUID[] DEFAULT '{}',          -- specific tenant IDs
  percentage INTEGER DEFAULT 0,                 -- rollout percentage (0-100)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 14. RATE LIMITING
-- ============================================================

CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier VARCHAR(255) NOT NULL,             -- email, IP, or combo
  action VARCHAR(50) NOT NULL,                  -- 'otp', 'booking', 'api'
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_minutes INTEGER NOT NULL DEFAULT 60,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, action, window_start);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ---- TENANTS ----

-- Public can read active tenants (for landing pages)
CREATE POLICY "Public can view active tenants"
  ON tenants FOR SELECT
  USING (status = 'active');

-- Owners can update their own tenant
CREATE POLICY "Owners can update own tenant"
  ON tenants FOR UPDATE
  USING (
    id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role = 'owner'
    )
  );

-- Admins can do everything
CREATE POLICY "Admins full access to tenants"
  ON tenants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ---- USERS ----

-- Users can read users in their tenant
CREATE POLICY "Tenant users can view own tenant users"
  ON users FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_id = auth.uid());

-- ---- SERVICES ----

-- Public can view active services (for booking)
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

-- Owner/staff can manage services in their tenant
CREATE POLICY "Owner/staff can manage services"
  ON services FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role IN ('owner', 'staff')
    )
  );

-- ---- BOOKINGS ----

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON bookings FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Owner/staff can view all bookings in their tenant
CREATE POLICY "Owner/staff can view tenant bookings"
  ON bookings FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role IN ('owner', 'staff')
    )
  );

-- Public can insert bookings (guest booking with pending status)
CREATE POLICY "Anyone can create pending booking"
  ON bookings FOR INSERT
  WITH CHECK (status = 'pending');

-- Owner/staff can update bookings in their tenant
CREATE POLICY "Owner/staff can update tenant bookings"
  ON bookings FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role IN ('owner', 'staff')
    )
  );

-- Customers can update their own bookings (cancel/reschedule)
CREATE POLICY "Customers can update own bookings"
  ON bookings FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- ---- TEMPLATES ----

-- Public can view active templates
CREATE POLICY "Public can view active templates"
  ON templates FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage templates
CREATE POLICY "Admins can manage templates"
  ON templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ---- POINTS LEDGER ----

-- Customers can view their own points
CREATE POLICY "Customers can view own points"
  ON points_ledger FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Owner can view points in their tenant
CREATE POLICY "Owner can view tenant points"
  ON points_ledger FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role = 'owner'
    )
  );

-- ---- AUDIT LOGS ----

-- Admins only
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Owners can view their tenant's audit logs
CREATE POLICY "Owners can view own tenant audit logs"
  ON audit_logs FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role = 'owner'
    )
  );

-- Insert-only for audit logs (no updates/deletes allowed via RLS)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- ---- WORKING HOURS ----

CREATE POLICY "Public can view working hours"
  ON working_hours FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Owner/staff can manage working hours"
  ON working_hours FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role IN ('owner', 'staff')
    )
  );

-- ---- NOTIFICATIONS ----

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Owner can view tenant notifications"
  ON notifications FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth_id = auth.uid() AND role = 'owner'
    )
  );

-- ---- FEATURE FLAGS ----

CREATE POLICY "Admins can manage feature flags"
  ON feature_flags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can read feature flags"
  ON feature_flags FOR SELECT
  USING (TRUE);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_feature_flags_updated_at BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Expire pending bookings (run via cron every minute)
CREATE OR REPLACE FUNCTION expire_pending_bookings()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE bookings
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending'
    AND pending_expires_at < NOW();

  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate customer tier (60-day rolling window)
CREATE OR REPLACE FUNCTION calculate_customer_tier(p_tenant_id UUID, p_customer_id UUID)
RETURNS customer_tier AS $$
DECLARE
  visit_count INTEGER;
  no_show_count INTEGER;
  v_tier_regular_min INTEGER;
  v_tier_vip_min INTEGER;
BEGIN
  -- Get tenant tier thresholds
  SELECT tier_regular_min_visits, tier_vip_min_visits
  INTO v_tier_regular_min, v_tier_vip_min
  FROM tenants WHERE id = p_tenant_id;

  -- Count attended visits in last 60 days
  SELECT COUNT(*)
  INTO visit_count
  FROM bookings
  WHERE tenant_id = p_tenant_id
    AND customer_id = p_customer_id
    AND status = 'completed'
    AND start_at > NOW() - INTERVAL '60 days';

  -- Count no-shows in last 60 days
  SELECT COUNT(*)
  INTO no_show_count
  FROM bookings
  WHERE tenant_id = p_tenant_id
    AND customer_id = p_customer_id
    AND status = 'no_show'
    AND start_at > NOW() - INTERVAL '60 days';

  -- Determine tier
  IF visit_count >= v_tier_vip_min AND no_show_count <= 1 THEN
    RETURN 'vip';
  ELSIF visit_count >= v_tier_regular_min THEN
    RETURN 'regular';
  ELSE
    RETURN 'new';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update at-risk status for all customers in a tenant
CREATE OR REPLACE FUNCTION update_at_risk_customers()
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET is_at_risk = TRUE, updated_at = NOW()
  WHERE role = 'customer'
    AND is_registered = TRUE
    AND last_visit_at < NOW() - INTERVAL '14 days'
    AND is_at_risk = FALSE;

  UPDATE users
  SET is_at_risk = FALSE, updated_at = NOW()
  WHERE role = 'customer'
    AND last_visit_at >= NOW() - INTERVAL '14 days'
    AND is_at_risk = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier VARCHAR,
  p_action VARCHAR,
  p_max_count INTEGER,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  is_blocked BOOLEAN;
BEGIN
  -- Check if currently blocked
  SELECT EXISTS(
    SELECT 1 FROM rate_limits
    WHERE identifier = p_identifier
      AND action = p_action
      AND blocked_until > NOW()
  ) INTO is_blocked;

  IF is_blocked THEN
    RETURN FALSE;
  END IF;

  -- Count attempts in current window
  SELECT COALESCE(SUM(count), 0)
  INTO current_count
  FROM rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start > NOW() - (p_window_minutes || ' minutes')::INTERVAL;

  IF current_count >= p_max_count THEN
    -- Block for 15 minutes
    INSERT INTO rate_limits (identifier, action, count, window_minutes, blocked_until)
    VALUES (p_identifier, p_action, 0, p_window_minutes, NOW() + INTERVAL '15 minutes');
    RETURN FALSE;
  END IF;

  -- Log this attempt
  INSERT INTO rate_limits (identifier, action, count, window_minutes)
  VALUES (p_identifier, p_action, 1, p_window_minutes);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CRON JOBS (via Supabase pg_cron or Edge Functions)
-- ============================================================

-- These should be configured in Supabase Dashboard:
--
-- 1. Expire pending bookings (every minute):
--    SELECT expire_pending_bookings();
--
-- 2. Update at-risk customers (every 6 hours):
--    SELECT update_at_risk_customers();
--
-- 3. Send reminders (every hour — check for 24h and 2h reminders):
--    Handled via Edge Function
--
-- 4. Weekly summary generation (Sunday 08:00 Israel time):
--    Handled via Edge Function
--
-- 5. Recalculate tiers (daily at 03:00):
--    UPDATE users SET current_tier = calculate_customer_tier(tenant_id, id)
--    WHERE role = 'customer';
--
-- 6. Clean old rate limit records (daily):
--    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
