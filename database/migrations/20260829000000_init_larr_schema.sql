-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS larr_audit_log CASCADE;
DROP TABLE IF EXISTS larr_recommendations CASCADE;
DROP TABLE IF EXISTS larr_predictions CASCADE;
DROP TABLE IF EXISTS larr_document_chunks CASCADE;
DROP TABLE IF EXISTS larr_legal_cases CASCADE;
DROP TABLE IF EXISTS larr_compensation CASCADE;
DROP TABLE IF EXISTS larr_stages CASCADE;
DROP TABLE IF EXISTS larr_projects CASCADE;

-- 1. Projects Table (Tracks key LARR Act 2013 statutory milestones and parameters)
CREATE TABLE larr_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL, -- e.g., 'National Highway', 'Railway Corridor', 'Irrigation Dam', 'Industrial Hub'
    sector VARCHAR(50) NOT NULL,       -- 'Transport', 'Energy', 'Water Resources', 'Urban Development'
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    total_acreage_ha NUMERIC(12, 4) NOT NULL,
    num_land_parcels INTEGER NOT NULL,
    affected_families INTEGER NOT NULL,
    project_cost_cr NUMERIC(12, 2) NOT NULL,
    private_to_govt_ratio NUMERIC(5, 2) NOT NULL,
    sc_st_land_percentage NUMERIC(5, 2) NOT NULL,
    multi_crop_irrigated_percentage NUMERIC(5, 2) NOT NULL,
    required_consent_percentage INTEGER NOT NULL, -- 0 for Gov, 70 for PPP, 80 for Private
    non_owner_to_owner_paf_ratio NUMERIC(5, 2) NOT NULL,
    circle_rate_disparity_ratio NUMERIC(5, 2) NOT NULL,
    rr_cost_share_percentage NUMERIC(5, 2) NOT NULL,
    rural_multiplier_factor NUMERIC(3, 1) NOT NULL, -- 1.0 to 2.0
    district_litigation_rate NUMERIC(5, 2) NOT NULL,
    revenue_staff_vacancy_rate NUMERIC(5, 2) NOT NULL,
    avg_s15_resolution_days NUMERIC(5, 2) NOT NULL,
    current_stage VARCHAR(100) NOT NULL, -- 'Section 11 Notification', 'Section 15 Hearing', 'Section 19 Declaration', 'Section 23 Award', 'Section 38 Possession'
    
    -- Real-time Dates for LARR Milestones
    s11_notification_date DATE NOT NULL,
    s15_hearing_date DATE,
    s19_declaration_date DATE,
    s23_award_date DATE,
    s38_possession_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Lifecycle Stages Table
CREATE TABLE larr_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_end_date DATE,
    status VARCHAR(50) NOT NULL, -- 'Completed', 'In Progress', 'Delayed', 'At Risk'
    delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Compensation & R&R Tracking Table
CREATE TABLE larr_compensation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    assessed_amount_cr NUMERIC(12, 2) NOT NULL,
    disbursed_amount_cr NUMERIC(12, 2) NOT NULL,
    pending_amount_cr NUMERIC(12, 2) NOT NULL,
    total_beneficiaries INTEGER NOT NULL,
    beneficiaries_paid INTEGER NOT NULL,
    avg_disbursement_delay_days NUMERIC(5, 1) NOT NULL,
    r_and_r_families_eligible INTEGER NOT NULL,
    r_and_r_families_resettled INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Legal Cases & Disputes Table
CREATE TABLE larr_legal_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    case_number VARCHAR(100) NOT NULL,
    court_level VARCHAR(50) NOT NULL, -- 'High Court', 'Supreme Court', 'LARR Authority (Section 64)', 'District Court'
    dispute_category VARCHAR(100) NOT NULL, -- 'Circle Rate Disparity', 'Title Ownership Conflict', 'Tribal Consent', 'Environmental/SIA'
    status VARCHAR(50) NOT NULL, -- 'Pending', 'Stay Granted', 'Disposed', 'Dismissed'
    stay_granted BOOLEAN DEFAULT FALSE,
    filed_date DATE NOT NULL,
    resolved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Document Chunks Table (Legal RAG Embeddings)
CREATE TABLE larr_document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'Section 15 Objection', 'SIA Report', 'High Court Stay Order', 'Circle Rate Notification'
    document_title VARCHAR(255) NOT NULL,
    chunk_content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding VECTOR(384) NOT NULL, -- 384-dimension embeddings (all-MiniLM-L6-v2)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Vector Index for rapid cosine similarity queries
CREATE INDEX IF NOT EXISTS larr_vector_hnsw_idx 
ON larr_document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 6. Model Predictions History Table
CREATE TABLE larr_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    delay_probability NUMERIC(5, 4) NOT NULL,
    risk_category VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'CRITICAL'
    expected_delay_days INTEGER NOT NULL,
    lapsing_risk_s19 BOOLEAN DEFAULT FALSE,
    days_since_s11 INTEGER NOT NULL,
    days_remaining_s19 INTEGER NOT NULL,
    top_driver VARCHAR(100),
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Prescriptive Recommendations Table
CREATE TABLE larr_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES larr_projects(id) ON DELETE CASCADE,
    prediction_id UUID REFERENCES larr_predictions(id) ON DELETE CASCADE,
    trigger_driver VARCHAR(100) NOT NULL,
    impact_score VARCHAR(50) NOT NULL,
    recommended_action VARCHAR(255) NOT NULL,
    legal_basis VARCHAR(255) NOT NULL,
    actionable_blueprint TEXT NOT NULL,
    expected_risk_reduction NUMERIC(5, 4),
    status VARCHAR(50) DEFAULT 'Pending Review', -- 'Pending Review', 'Adopted', 'Rejected'
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Audit Log Table
CREATE TABLE larr_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Stored Procedure for Cosine Similarity Search
CREATE OR REPLACE FUNCTION match_document_chunks (
    query_embedding VECTOR(384),
    match_threshold FLOAT,
    match_count INT,
    filter_project_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    document_type VARCHAR,
    document_title VARCHAR,
    chunk_content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.project_id,
        c.document_type,
        c.document_title,
        c.chunk_content,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM larr_document_chunks c
    WHERE (1 - (c.embedding <=> query_embedding)) > match_threshold
      AND (filter_project_id IS NULL OR c.project_id = filter_project_id)
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
