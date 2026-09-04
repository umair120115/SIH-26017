from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import List, Optional, Dict, Any

class ProjectFeatures(BaseModel):
    project_code: Optional[str] = Field(default="PRJ-DEFAULT", example="PRJ-NH-2026-08")
    project_name: Optional[str] = Field(default="Greenfield Industrial Expressway Corridor", example="Greenfield Industrial Corridor")
    project_type: Optional[str] = Field(default="National Highway", example="National Highway")
    sector: Optional[str] = Field(default="Transport", example="Transport")
    state_name: Optional[str] = Field(default="Maharashtra", example="Maharashtra")
    district_name: Optional[str] = Field(default="Nagpur", example="Nagpur")
    latitude: Optional[float] = Field(default=21.1458, example=21.1458)
    longitude: Optional[float] = Field(default=79.0882, example=79.0882)
    
    total_acreage_ha: float = Field(..., example=120.5)
    num_land_parcels: int = Field(..., example=45)
    affected_families: Optional[int] = Field(default=280, example=280)
    project_cost_cr: Optional[float] = Field(default=450.0, example=450.0)
    
    private_to_govt_ratio: float = Field(..., example=3.2)
    sc_st_land_percentage: float = Field(..., example=15.0)
    multi_crop_irrigated_percentage: float = Field(..., example=25.0)
    required_consent_percentage: int = Field(..., example=80)
    non_owner_to_owner_paf_ratio: float = Field(..., example=0.5)
    circle_rate_disparity_ratio: float = Field(..., example=1.8)
    rr_cost_share_percentage: float = Field(..., example=12.0)
    rural_multiplier_factor: float = Field(..., example=1.5)
    district_litigation_rate: float = Field(..., example=5.5)
    revenue_staff_vacancy_rate: float = Field(..., example=20.0)
    avg_s15_resolution_days: float = Field(..., example=45.0)
    
    # Milestone Dates
    s11_notification_date: date
    s15_hearing_date: Optional[date] = None
    s19_declaration_date: Optional[date] = None
    s23_award_date: Optional[date] = None
    s38_possession_date: Optional[date] = None
    
    current_stage: Optional[str] = Field(default="Section 11 Notification", example="Section 11 Notification")

    class Config:
        from_attributes = True

class DelayPredictionResponse(BaseModel):
    project_code: Optional[str] = None
    project_name: Optional[str] = None
    delay_probability: float
    risk_category: str # 'LOW', 'MEDIUM', 'CRITICAL'
    expected_delay_days: int
    days_since_s11: int
    days_remaining_s19: int
    lapsing_risk_s19: bool
    stage_wise_hazard: Dict[str, float] = {}

class ShapFeatureFactor(BaseModel):
    feature_name: str
    shap_value: float
    contribution_direction: str # 'increases_risk' or 'mitigates_risk'
    plain_english_meaning: str
    category: str # 'Legal', 'Compensation', 'Documentation', 'Administrative', 'R&R'

class ShapExplanationResponse(BaseModel):
    base_value: float
    prediction_value: float
    factors: List[ShapFeatureFactor]
    driver_group_breakdown: Dict[str, float] = {}

class OptimizedActionPlan(BaseModel):
    trigger_driver: str
    impact_score: str
    recommended_action: str
    legal_basis: str
    actionable_blueprint: str
    expected_risk_reduction_pct: float

class PrescriptiveResponse(BaseModel):
    project_name: str
    risk_category: str
    delay_probability: float
    optimizations: List[OptimizedActionPlan]
    google_doc_synced: bool
    simulated_risk_after_actions: float

class WhatIfSimulationRequest(BaseModel):
    project_features: ProjectFeatures
    resolved_factors: List[str] # List of feature names to set to optimal/resolved values

class WhatIfSimulationResponse(BaseModel):
    original_risk_score: float
    original_risk_category: str
    original_expected_delay_days: int
    simulated_risk_score: float
    simulated_risk_category: str
    simulated_expected_delay_days: int
    risk_reduction_pct: float
    delay_days_saved: int
    actions_applied: List[str]

class RagQueryRequest(BaseModel):
    project_id: Optional[str] = None
    query_text: str
    top_k: int = 3

class RagChunkResponse(BaseModel):
    document_title: str
    document_type: str
    content: str
    similarity: float

class RagQueryResponse(BaseModel):
    results: List[RagChunkResponse]

class AlertItem(BaseModel):
    id: str
    project_code: str
    project_name: str
    state_name: str
    district_name: str
    risk_category: str
    alert_type: str # 'SECTION_19_LAPSING', 'HIGH_LITIGATION_SURGE', 'COMPENSATION_STALL', 'STAFF_CRITICAL'
    message: str
    days_to_lapse: Optional[int] = None
    created_at: str

class PortfolioOverview(BaseModel):
    total_projects: int
    total_acreage_ha: float
    total_cost_cr: float
    risk_distribution: Dict[str, int]
    avg_delay_days: float
    critical_lapsing_projects_count: int
    projects: List[Dict[str, Any]]
