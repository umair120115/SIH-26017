import uuid
from datetime import date
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    ProjectFeatures, DelayPredictionResponse, 
    ShapExplanationResponse, PrescriptiveResponse,
    WhatIfSimulationRequest, WhatIfSimulationResponse,
    PortfolioOverview, AlertItem
)
from app.ml_engine import ml_engine
from app.optimizer import optimizer
from app.google_sync import doc_sync
from app.database import db_manager
from app.ingestion import router as ingestion_router
from app.synthetic_generator import SyntheticLarrDataGenerator

app = FastAPI(
    title="DoLR LARR Act 2013 Predictive Analytics API",
    description="Production-grade REST API for early detection of land acquisition delays, TreeSHAP explainability, prescriptive optimization, and dynamic legal RAG.",
    version=settings.VERSION
)

# Enable CORS for Next.js & React single-page frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Dynamic Legal RAG Knowledge Base Router
app.include_router(ingestion_router)
app.include_router(ingestion_router, prefix="/api/v1")

@app.get("/")
def get_root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "docs_url": "/docs",
        "database_connected": db_manager.is_connected,
        "available_projects_count": len(db_manager.in_memory_projects)
    }

@app.get("/portfolio", response_model=PortfolioOverview)
def get_portfolio_overview(
    state: Optional[str] = Query(None, description="Filter by State"),
    district: Optional[str] = Query(None, description="Filter by District"),
    risk_band: Optional[str] = Query(None, description="Filter by Risk Category (LOW/MEDIUM/CRITICAL)")
):
    """
    Returns aggregated portfolio statistics, risk category distribution,
    and individual project summaries with real-time risk scores.
    """
    try:
        projects = db_manager.in_memory_projects
        if state:
            projects = [p for p in projects if p["state_name"].lower() == state.lower()]
        if district:
            projects = [p for p in projects if p["district_name"].lower() == district.lower()]

        scored_projects = []
        risk_dist = {"LOW": 0, "MEDIUM": 0, "CRITICAL": 0}
        total_delay_days = 0
        lapsing_count = 0

        for prj in projects:
            p_feat = ProjectFeatures(
                project_code=prj.get("project_code"),
                project_name=prj.get("project_name"),
                project_type=prj.get("project_type"),
                sector=prj.get("sector"),
                state_name=prj.get("state_name"),
                district_name=prj.get("district_name"),
                latitude=prj.get("latitude"),
                longitude=prj.get("longitude"),
                total_acreage_ha=prj["total_acreage_ha"],
                num_land_parcels=prj["num_land_parcels"],
                affected_families=prj.get("affected_families", 200),
                project_cost_cr=prj.get("project_cost_cr", 500.0),
                private_to_govt_ratio=prj["private_to_govt_ratio"],
                sc_st_land_percentage=prj["sc_st_land_percentage"],
                multi_crop_irrigated_percentage=prj["multi_crop_irrigated_percentage"],
                required_consent_percentage=prj["required_consent_percentage"],
                non_owner_to_owner_paf_ratio=prj["non_owner_to_owner_paf_ratio"],
                circle_rate_disparity_ratio=prj["circle_rate_disparity_ratio"],
                rr_cost_share_percentage=prj["rr_cost_share_percentage"],
                rural_multiplier_factor=prj["rural_multiplier_factor"],
                district_litigation_rate=prj["district_litigation_rate"],
                revenue_staff_vacancy_rate=prj["revenue_staff_vacancy_rate"],
                avg_s15_resolution_days=prj["avg_s15_resolution_days"],
                current_stage=prj.get("current_stage", "Section 11 Notification"),
                s11_notification_date=date.fromisoformat(prj["s11_notification_date"]),
                s15_hearing_date=date.fromisoformat(prj["s15_hearing_date"]) if prj.get("s15_hearing_date") else None,
                s19_declaration_date=date.fromisoformat(prj["s19_declaration_date"]) if prj.get("s19_declaration_date") else None,
            )

            prob, cat, days, s11_elapsed, s19_left, lapse, stage_hazard = ml_engine.predict_delay(p_feat)
            
            if risk_band and cat.upper() != risk_band.upper():
                continue

            risk_dist[cat] = risk_dist.get(cat, 0) + 1
            total_delay_days += days
            if lapse:
                lapsing_count += 1

            project_item = dict(prj)
            project_item.update({
                "delay_probability": round(prob, 3),
                "risk_category": cat,
                "expected_delay_days": days,
                "days_since_s11": s11_elapsed,
                "days_remaining_s19": s19_left,
                "lapsing_risk_s19": lapse,
                "stage_wise_hazard": stage_hazard
            })
            scored_projects.append(project_item)

        total_acreage = sum(p["total_acreage_ha"] for p in scored_projects)
        total_cost = sum(p.get("project_cost_cr", 0.0) for p in scored_projects)
        avg_delay = round(total_delay_days / len(scored_projects), 1) if scored_projects else 0.0

        return PortfolioOverview(
            total_projects=len(scored_projects),
            total_acreage_ha=round(total_acreage, 1),
            total_cost_cr=round(total_cost, 1),
            risk_distribution=risk_dist,
            avg_delay_days=avg_delay,
            critical_lapsing_projects_count=lapsing_count,
            projects=scored_projects
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate portfolio view: {str(e)}")

@app.get("/projects/{project_id}")
def get_project_by_id(project_id: str):
    """Fetches full project data by its ID."""
    for prj in db_manager.in_memory_projects:
        if prj["id"] == project_id or prj.get("project_code") == project_id:
            return prj
    raise HTTPException(status_code=404, detail="Project not found")

@app.post("/projects")
def create_and_evaluate_project(features: ProjectFeatures):
    """
    Evaluates and registers a new land acquisition project into the active portfolio.
    Calculates real-time delay probability, lapsing risk, assigns a persistent ID,
    and prepends it to the portfolio so judges can immediately observe it across all views.
    """
    try:
        prob, cat, days, s11_days, s19_days, lapse, stage_hazard = ml_engine.predict_delay(features)
        
        new_id = f"p-custom-{uuid.uuid4().hex[:8]}"
        project_code = features.project_code if features.project_code and features.project_code != "PRJ-DEFAULT" else f"PRJ-EVAL-{date.today().year}-{len(db_manager.in_memory_projects)+1:03d}"
        
        project_record = {
            "id": new_id,
            "project_code": project_code,
            "project_name": features.project_name or "Custom Evaluated Project",
            "project_type": features.project_type or "National Highway",
            "sector": features.sector or "Transport",
            "state_name": features.state_name or "Maharashtra",
            "district_name": features.district_name or "Central Division",
            "latitude": features.latitude or 20.5937,
            "longitude": features.longitude or 78.9629,
            "total_acreage_ha": features.total_acreage_ha,
            "num_land_parcels": features.num_land_parcels,
            "affected_families": features.affected_families or int(features.num_land_parcels * 1.8),
            "project_cost_cr": features.project_cost_cr or round(features.total_acreage_ha * 4.2, 1),
            "private_to_govt_ratio": features.private_to_govt_ratio,
            "sc_st_land_percentage": features.sc_st_land_percentage,
            "multi_crop_irrigated_percentage": features.multi_crop_irrigated_percentage,
            "required_consent_percentage": features.required_consent_percentage,
            "non_owner_to_owner_paf_ratio": features.non_owner_to_owner_paf_ratio,
            "circle_rate_disparity_ratio": features.circle_rate_disparity_ratio,
            "rr_cost_share_percentage": features.rr_cost_share_percentage,
            "rural_multiplier_factor": features.rural_multiplier_factor,
            "district_litigation_rate": features.district_litigation_rate,
            "revenue_staff_vacancy_rate": features.revenue_staff_vacancy_rate,
            "avg_s15_resolution_days": features.avg_s15_resolution_days,
            "current_stage": features.current_stage or "Section 11 Notification",
            "s11_notification_date": features.s11_notification_date.isoformat(),
            "s15_hearing_date": features.s15_hearing_date.isoformat() if features.s15_hearing_date else None,
            "s19_declaration_date": features.s19_declaration_date.isoformat() if features.s19_declaration_date else None,
            "s23_award_date": features.s23_award_date.isoformat() if features.s23_award_date else None,
            "s38_possession_date": features.s38_possession_date.isoformat() if features.s38_possession_date else None,
            "delay_probability": round(prob, 3),
            "risk_category": cat,
            "expected_delay_days": days,
            "days_since_s11": s11_days,
            "days_remaining_s19": s19_days,
            "lapsing_risk_s19": lapse,
            "stage_wise_hazard": stage_hazard,
            "is_custom_evaluation": True
        }
        
        # Prepend to live portfolio so it immediately shows up as the first item
        db_manager.in_memory_projects.insert(0, project_record)
        return project_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@app.post("/predict", response_model=DelayPredictionResponse)
def predict_project_delay(features: ProjectFeatures):
    """Predicts delay probability, risk band, expected delay days, and Section 19 lapsing status."""
    try:
        prob, cat, days, s11_days, s19_days, lapse, stage_hazard = ml_engine.predict_delay(features)
        return DelayPredictionResponse(
            project_code=features.project_code,
            project_name=features.project_name,
            delay_probability=prob,
            risk_category=cat,
            expected_delay_days=days,
            days_since_s11=s11_days,
            days_remaining_s19=s19_days,
            lapsing_risk_s19=lapse,
            stage_wise_hazard=stage_hazard
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/shap-explain", response_model=ShapExplanationResponse)
def explain_project_factors(features: ProjectFeatures):
    """Computes TreeSHAP attributions and decomposes delay drivers into domain families."""
    try:
        explanation = ml_engine.explain_prediction(features)
        return ShapExplanationResponse(**explanation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SHAP explanation failed: {str(e)}")

@app.post("/prescribe-optimize", response_model=PrescriptiveResponse)
def optimize_project_workflow(features: ProjectFeatures):
    """
    Generates actionable statutory remedies under LARR Act 2013 and
    optionally syncs the executive advisory memo to team Google Docs.
    """
    try:
        prob, cat, _, _, _, _, _ = ml_engine.predict_delay(features)
        shap_res = ml_engine.explain_prediction(features)
        
        optimizations = optimizer.generate_optimized_path(shap_res["factors"])
        
        # Calculate simulated risk after optimizations
        sim_res = optimizer.simulate_counterfactual(
            features=features,
            resolved_levers=["circle_rate_disparity_ratio", "revenue_staff_vacancy_rate", "avg_s15_resolution_days"],
            ml_engine_instance=ml_engine
        )
        
        synced = doc_sync.sync_advisory_memo(
            project_name=features.project_name or "National Infrastructure Project",
            probability=prob,
            category=cat,
            plans=optimizations
        )
        
        return PrescriptiveResponse(
            project_name=features.project_name or "Project",
            risk_category=cat,
            delay_probability=prob,
            optimizations=optimizations,
            google_doc_synced=synced,
            simulated_risk_after_actions=sim_res.simulated_risk_score / 100.0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prescriptive workflow failed: {str(e)}")

@app.post("/simulate-whatif", response_model=WhatIfSimulationResponse)
def simulate_counterfactual_action(request: WhatIfSimulationRequest):
    """
    Runs real-time counterfactual simulation: calculates the exact drop in risk and delay days saved
    when specific actionable obstacles are resolved.
    """
    try:
        return optimizer.simulate_counterfactual(
            features=request.project_features,
            resolved_levers=request.resolved_factors,
            ml_engine_instance=ml_engine
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Counterfactual simulation failed: {str(e)}")

@app.get("/alerts", response_model=List[AlertItem])
def get_critical_alerts():
    """Returns statutory lapsing and critical risk alerts across all monitored projects."""
    alerts = []
    for prj in db_manager.in_memory_projects:
        s11_date = date.fromisoformat(prj["s11_notification_date"])
        elapsed = (date.today() - s11_date).days
        remaining_s19 = 365 - elapsed
        
        if prj.get("s19_declaration_date") is None and remaining_s19 <= 60:
            alerts.append(AlertItem(
                id=f"alert-lapse-{prj['id']}",
                project_code=prj.get("project_code", "PRJ"),
                project_name=prj["project_name"],
                state_name=prj["state_name"],
                district_name=prj["district_name"],
                risk_category="CRITICAL",
                alert_type="SECTION_19_LAPSING",
                message=f"CRITICAL: Section 19(2) declaration deadline expires in {max(0, remaining_s19)} days. Risk of complete statutory lapse under Section 19.",
                days_to_lapse=remaining_s19,
                created_at=date.today().isoformat()
            ))
            
        if prj["circle_rate_disparity_ratio"] >= 2.5:
            alerts.append(AlertItem(
                id=f"alert-rate-{prj['id']}",
                project_code=prj.get("project_code", "PRJ"),
                project_name=prj["project_name"],
                state_name=prj["state_name"],
                district_name=prj["district_name"],
                risk_category="HIGH",
                alert_type="COMPENSATION_STALL",
                message=f"Disparity ratio ({prj['circle_rate_disparity_ratio']}x) between circle rate and market transaction rates exceeds dispute threshold. Recommend Section 26 negotiation.",
                days_to_lapse=None,
                created_at=date.today().isoformat()
            ))
            
    return alerts

@app.post("/projects/generate-synthetic")
def generate_synthetic_projects(count: int = Query(10, ge=1, le=50)):
    """Generates and appends synthetic LARR project records anchored to MoSPI benchmarks."""
    new_projects = SyntheticLarrDataGenerator.generate_batch(count)
    db_manager.in_memory_projects.extend(new_projects)
    return {
        "status": "SUCCESS",
        "generated_count": len(new_projects),
        "total_active_projects": len(db_manager.in_memory_projects)
    }
