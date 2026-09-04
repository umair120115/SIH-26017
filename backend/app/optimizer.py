import copy
from typing import List, Tuple, Dict, Any
from app.schemas import (
    ShapFeatureFactor, OptimizedActionPlan, ProjectFeatures,
    WhatIfSimulationRequest, WhatIfSimulationResponse
)

class LarrPrescriptiveOptimizer:
    """
    Translates SHAP delay risk factors into statutory remedies under LARR Act 2013
    and conducts counterfactual what-if simulations.
    """
    
    ACTIONABLE_LEVERS = {
        "circle_rate_disparity_ratio": 1.0,
        "revenue_staff_vacancy_rate": 5.0,
        "avg_s15_resolution_days": 15.0,
        "district_litigation_rate": 2.0,
        "non_owner_to_owner_paf_ratio": 0.2
    }

    @staticmethod
    def generate_optimized_path(factors: List[ShapFeatureFactor]) -> List[OptimizedActionPlan]:
        """
        Parses SHAP factors to identify top delay drivers and maps them to
        legally optimized pathways under the LARR Act 2013 to protect the timeline.
        """
        plans = []
        risk_drivers = [f for f in factors if f.contribution_direction == "increases_risk"]
        
        for factor in risk_drivers:
            name = factor.feature_name
            impact = factor.shap_value
            
            if name == "circle_rate_disparity_ratio" and impact > 0.03:
                plans.append(OptimizedActionPlan(
                    trigger_driver="Circle Rate Disparity",
                    impact_score=f"+{impact*100:.1f}% delay risk",
                    recommended_action="Convene Section 26 Direct Negotiation Committee",
                    legal_basis="LARR Act 2013, Section 26 (Proviso 4)",
                    actionable_blueprint=(
                        "Constitute District Direct Negotiation Committee headed by District Collector. "
                        "Authorize direct mutual consent agreements at 100% market rate + 100% solatium (Section 30) "
                        "to avert high-court referencing under Section 64."
                    ),
                    expected_risk_reduction_pct=round(impact * 100 * 0.85, 1)
                ))
            elif name == "revenue_staff_vacancy_rate" and impact > 0.03:
                plans.append(OptimizedActionPlan(
                    trigger_driver="Revenue Staff Shortage",
                    impact_score=f"+{impact*100:.1f}% delay risk",
                    recommended_action="Requisition Emergency Surveyor Squad on Deputation",
                    legal_basis="State LARR Administrative Delegation Rules",
                    actionable_blueprint=(
                        "Depute 15 specialized revenue inspectors/Patwaris from non-critical sub-divisions. "
                        "Fast-track Section 12 preliminary survey demarcations and Section 16 R&R census "
                        "to prevent Section 19 statutory lapse."
                    ),
                    expected_risk_reduction_pct=round(impact * 100 * 0.78, 1)
                ))
            elif name == "avg_s15_resolution_days" and impact > 0.02:
                plans.append(OptimizedActionPlan(
                    trigger_driver="Citizen Objection Backlog",
                    impact_score=f"+{impact*100:.1f}% delay risk",
                    recommended_action="Institute Dedicated Section 15 Hearing Special Officers",
                    legal_basis="LARR Act 2013, Section 15(2)",
                    actionable_blueprint=(
                        "Appoint Additional Deputy Collector exclusively to hear citizen objections "
                        "within fixed 7-day calendar windows, reducing average disposal latency from >60 days to <15 days."
                    ),
                    expected_risk_reduction_pct=round(impact * 100 * 0.70, 1)
                ))
            elif name == "sc_st_land_percentage" and impact > 0.03:
                plans.append(OptimizedActionPlan(
                    trigger_driver="Tribal Land Safeguards",
                    impact_score=f"+{impact*100:.1f}% delay risk",
                    recommended_action="Execute Fast-Track Gram Sabha Dialect Consultations",
                    legal_basis="LARR Act 2013, Sections 41 & 42",
                    actionable_blueprint=(
                        "Mobilize the District Tribal Welfare Officer. Translate draft R&R entitlements "
                        "into local dialects, distribute 30 days in advance, and convene scheduled "
                        "Gram Sabha voting sessions to achieve mandatory prior consent."
                    ),
                    expected_risk_reduction_pct=round(impact * 100 * 0.65, 1)
                ))
            elif name == "multi_crop_irrigated_percentage" and impact > 0.03:
                plans.append(OptimizedActionPlan(
                    trigger_driver="Food Security Irrigated Land Cap",
                    impact_score=f"+{impact*100:.1f}% delay risk",
                    recommended_action="Procure Section 10 Exceptional Public Interest Exemption",
                    legal_basis="LARR Act 2013, Section 10(2)",
                    actionable_blueprint=(
                        "Submit compensatory cultivable wasteland conversion certificate to State Government "
                        "establishing that acquisition falls within cumulative district multi-crop ceiling limits."
                    ),
                    expected_risk_reduction_pct=round(impact * 100 * 0.60, 1)
                ))

        if not plans:
            plans.append(OptimizedActionPlan(
                trigger_driver="Optimal Statutory Baseline",
                impact_score="Stable",
                recommended_action="Execute Standard Milestone Progression Monitoring",
                legal_basis="Sections 19 & 25 Compliance",
                actionable_blueprint="Proceed with scheduled administrative workflows. All statutory buffers remain healthy.",
                expected_risk_reduction_pct=0.0
            ))
            
        return plans

    @staticmethod
    def simulate_counterfactual(
        features: ProjectFeatures,
        resolved_levers: List[str],
        ml_engine_instance
    ) -> WhatIfSimulationResponse:
        """
        Runs counterfactual simulation: sets specified actionable features to resolved optimal values,
        re-evaluates risk, and calculates expected risk reduction and days saved.
        """
        # Baseline prediction
        orig_prob, orig_cat, orig_days, _, _, _, _ = ml_engine_instance.predict_delay(features)
        
        # Modified copy
        modified_dict = features.model_dump()
        actions_applied = []
        
        for lever in resolved_levers:
            if lever in LarrPrescriptiveOptimizer.ACTIONABLE_LEVERS:
                optimal_val = LarrPrescriptiveOptimizer.ACTIONABLE_LEVERS[lever]
                modified_dict[lever] = optimal_val
                actions_applied.append(f"Optimized {lever} to {optimal_val}")
                
        sim_features = ProjectFeatures(**modified_dict)
        sim_prob, sim_cat, sim_days, _, _, _, _ = ml_engine_instance.predict_delay(sim_features)
        
        risk_reduction_pct = max(0.0, (orig_prob - sim_prob) / orig_prob * 100) if orig_prob > 0 else 0.0
        days_saved = max(0, orig_days - sim_days)
        
        return WhatIfSimulationResponse(
            original_risk_score=round(orig_prob * 100, 1),
            original_risk_category=orig_cat,
            original_expected_delay_days=orig_days,
            simulated_risk_score=round(sim_prob * 100, 1),
            simulated_risk_category=sim_cat,
            simulated_expected_delay_days=sim_days,
            risk_reduction_pct=round(risk_reduction_pct, 1),
            delay_days_saved=days_saved,
            actions_applied=actions_applied
        )

optimizer = LarrPrescriptiveOptimizer()
