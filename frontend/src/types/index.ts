export interface Project {
  id: string;
  project_code: string;
  project_name: string;
  project_type: string;
  sector: string;
  state_name: string;
  district_name: string;
  latitude: number;
  longitude: number;
  total_acreage_ha: number;
  num_land_parcels: number;
  affected_families: number;
  project_cost_cr: number;
  private_to_govt_ratio: number;
  sc_st_land_percentage: number;
  multi_crop_irrigated_percentage: number;
  required_consent_percentage: number;
  non_owner_to_owner_paf_ratio: number;
  circle_rate_disparity_ratio: number;
  rr_cost_share_percentage: number;
  rural_multiplier_factor: number;
  district_litigation_rate: number;
  revenue_staff_vacancy_rate: number;
  avg_s15_resolution_days: number;
  current_stage: string;
  s11_notification_date: string;
  s15_hearing_date: string | null;
  s19_declaration_date: string | null;
  s23_award_date: string | null;
  s38_possession_date: string | null;
  delay_probability?: number;
  risk_category?: "LOW" | "MEDIUM" | "CRITICAL";
  expected_delay_days?: number;
  days_since_s11?: number;
  days_remaining_s19?: number;
  lapsing_risk_s19?: boolean;
  stage_wise_hazard?: Record<string, number>;
}

export interface PortfolioData {
  total_projects: number;
  total_acreage_ha: number;
  total_cost_cr: number;
  risk_distribution: {
    LOW: number;
    MEDIUM: number;
    CRITICAL: number;
  };
  avg_delay_days: number;
  critical_lapsing_projects_count: number;
  projects: Project[];
}

export interface ShapFactor {
  feature_name: string;
  shap_value: number;
  contribution_direction: "increases_risk" | "mitigates_risk";
  plain_english_meaning: string;
  category: "Legal" | "Compensation" | "Documentation" | "Administrative" | "R&R";
}

export interface ShapExplanation {
  base_value: number;
  prediction_value: number;
  factors: ShapFactor[];
  driver_group_breakdown: Record<string, number>;
}

export interface OptimizationAction {
  trigger_driver: string;
  impact_score: string;
  recommended_action: string;
  legal_basis: string;
  actionable_blueprint: string;
  expected_risk_reduction_pct: number;
}

export interface PrescriptiveData {
  project_name: string;
  risk_category: string;
  delay_probability: number;
  optimizations: OptimizationAction[];
  google_doc_synced: boolean;
  simulated_risk_after_actions: number;
}

export interface WhatIfResult {
  original_risk_score: number;
  original_risk_category: string;
  original_expected_delay_days: number;
  simulated_risk_score: number;
  simulated_risk_category: string;
  simulated_expected_delay_days: number;
  risk_reduction_pct: number;
  delay_days_saved: number;
  actions_applied: string[];
}

export interface Alert {
  id: string;
  project_code: string;
  project_name: string;
  state_name: string;
  district_name: string;
  risk_category: string;
  alert_type: string;
  message: string;
  days_to_lapse: number | null;
  created_at: string;
}

export interface RagChunk {
  document_title: string;
  document_type: string;
  content: string;
  similarity: number;
}
