-- Poll-Pulse AP / Panchayat360 — Supabase PostgreSQL schema
-- Paste into Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS gram_panchayats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district TEXT NOT NULL,
    mandal TEXT NOT NULL,
    mandal_population INT,
    gp_name TEXT NOT NULL,
    gp_population INT NOT NULL,
    statutory_wards INT NOT NULL,
    statutory_tier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (district, mandal, gp_name)
);

CREATE INDEX IF NOT EXISTS idx_gp_hierarchy
  ON gram_panchayats(district, mandal, gp_name);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'candidate',
    assigned_gp UUID REFERENCES gram_panchayats(id),
    is_unlocked BOOLEAN DEFAULT FALSE,
    payment_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gp_id UUID REFERENCES gram_panchayats(id),
    client_id UUID REFERENCES clients(id),
    target_timeline_days INT NOT NULL,
    total_sample_target INT DEFAULT 240,
    samples_per_ward INT NOT NULL,
    required_surveyors INT NOT NULL,
    required_supervisors INT DEFAULT 1,
    status TEXT DEFAULT 'configured',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES survey_projects(id),
    ward_number INT NOT NULL,
    surveyor_id TEXT NOT NULL,
    interview_duration_seconds INT NOT NULL,
    is_straight_lined BOOLEAN DEFAULT FALSE,
    is_flagged_fraud BOOLEAN DEFAULT FALSE,
    demographics JSONB NOT NULL DEFAULT '{}'::jsonb,
    q1_civic_issue TEXT,
    q2_ward_civic_issue TEXT,
    q3_past_development_rating INT,
    q4_accessible_leader TEXT,
    q5_trusted_leader TEXT,
    q6_crisis_leader TEXT,
    q7_sarpanch_choice TEXT,
    q8_candidate_priority_trait TEXT,
    q9_ysrcp_governance_rating TEXT,
    q10_nda_governance_rating TEXT,
    q11_regime_comparison TEXT,
    q12_immediate_priority_issue TEXT,
    q13_ward_member_choice TEXT,
    q14_voting_anchor_factor TEXT,
    q15_strategic_advice TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_responses_project_fraud
  ON survey_responses(project_id, is_flagged_fraud);

CREATE TABLE IF NOT EXISTS client_strategic_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gp_id UUID REFERENCES gram_panchayats(id),
    client_id UUID REFERENCES clients(id),
    winability_index DECIMAL(5, 2),
    lead_margin_delta TEXT,
    primary_village_grievance JSONB,
    coalition_transfer_metric JSONB,
    ward_rag_matrix JSONB NOT NULL DEFAULT '[]'::jsonb,
    what_if_base_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
    opponent_vulnerabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    speech_directives JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_sentiment_vault JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud gate helper (duration < 240s OR straight-line MCQs)
-- Call from edge function / ingest pipeline before analytics.
COMMENT ON COLUMN survey_responses.is_flagged_fraud IS
  'Set TRUE when interview_duration_seconds < 240 OR straight-lined MCQs; discard from analytics and replenish ward quota +1';

ALTER TABLE clients ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

ALTER TABLE gram_panchayats ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_strategic_dashboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gp_read_anon" ON gram_panchayats;
CREATE POLICY "gp_read_anon"
  ON gram_panchayats FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "dashboard_read_unlocked" ON client_strategic_dashboards;
CREATE POLICY "dashboard_read_unlocked"
  ON client_strategic_dashboards FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = client_id AND c.is_unlocked = TRUE
    )
  );
