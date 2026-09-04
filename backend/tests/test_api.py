import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    print("[PASS] Root endpoint passed")

def test_portfolio_overview():
    res = client.get("/portfolio")
    assert res.status_code == 200
    data = res.json()
    assert data["total_projects"] >= 5
    assert "CRITICAL" in data["risk_distribution"]
    print(f"[PASS] Portfolio endpoint passed ({data['total_projects']} projects loaded)")

def test_predict_endpoint():
    payload = {
        "project_code": "TEST-01",
        "project_name": "Test Express Highway",
        "total_acreage_ha": 250.0,
        "num_land_parcels": 120,
        "private_to_govt_ratio": 3.0,
        "sc_st_land_percentage": 15.0,
        "multi_crop_irrigated_percentage": 20.0,
        "required_consent_percentage": 70,
        "non_owner_to_owner_paf_ratio": 0.5,
        "circle_rate_disparity_ratio": 2.2,
        "rr_cost_share_percentage": 15.0,
        "rural_multiplier_factor": 1.5,
        "district_litigation_rate": 6.0,
        "revenue_staff_vacancy_rate": 25.0,
        "avg_s15_resolution_days": 50.0,
        "s11_notification_date": "2025-10-01"
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert 0.0 <= data["delay_probability"] <= 1.0
    assert data["risk_category"] in ["LOW", "MEDIUM", "CRITICAL"]
    assert data["expected_delay_days"] > 0
    print(f"[PASS] Prediction endpoint passed (P={data['delay_probability']:.2f}, Risk={data['risk_category']})")

def test_shap_explain():
    payload = {
        "project_code": "TEST-01",
        "total_acreage_ha": 250.0,
        "num_land_parcels": 120,
        "private_to_govt_ratio": 3.0,
        "sc_st_land_percentage": 15.0,
        "multi_crop_irrigated_percentage": 20.0,
        "required_consent_percentage": 70,
        "non_owner_to_owner_paf_ratio": 0.5,
        "circle_rate_disparity_ratio": 2.2,
        "rr_cost_share_percentage": 15.0,
        "rural_multiplier_factor": 1.5,
        "district_litigation_rate": 6.0,
        "revenue_staff_vacancy_rate": 25.0,
        "avg_s15_resolution_days": 50.0,
        "s11_notification_date": "2025-10-01"
    }
    res = client.post("/shap-explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["factors"]) > 0
    print(f"[PASS] TreeSHAP explanation endpoint passed ({len(data['factors'])} factors decomposed)")

def test_prescribe_optimize():
    payload = {
        "project_code": "TEST-01",
        "project_name": "Test Express Highway",
        "total_acreage_ha": 250.0,
        "num_land_parcels": 120,
        "private_to_govt_ratio": 3.0,
        "sc_st_land_percentage": 15.0,
        "multi_crop_irrigated_percentage": 20.0,
        "required_consent_percentage": 70,
        "non_owner_to_owner_paf_ratio": 0.5,
        "circle_rate_disparity_ratio": 2.2,
        "rr_cost_share_percentage": 15.0,
        "rural_multiplier_factor": 1.5,
        "district_litigation_rate": 6.0,
        "revenue_staff_vacancy_rate": 25.0,
        "avg_s15_resolution_days": 50.0,
        "s11_notification_date": "2025-10-01"
    }
    res = client.post("/prescribe-optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["optimizations"]) > 0
    print(f"[PASS] Prescriptive optimization passed ({len(data['optimizations'])} statutory blueprints generated)")

def test_whatif_simulator():
    payload = {
        "project_features": {
            "project_code": "TEST-01",
            "total_acreage_ha": 250.0,
            "num_land_parcels": 120,
            "private_to_govt_ratio": 3.0,
            "sc_st_land_percentage": 15.0,
            "multi_crop_irrigated_percentage": 20.0,
            "required_consent_percentage": 70,
            "non_owner_to_owner_paf_ratio": 0.5,
            "circle_rate_disparity_ratio": 2.5,
            "rr_cost_share_percentage": 15.0,
            "rural_multiplier_factor": 1.5,
            "district_litigation_rate": 6.0,
            "revenue_staff_vacancy_rate": 30.0,
            "avg_s15_resolution_days": 60.0,
            "s11_notification_date": "2025-10-01"
        },
        "resolved_factors": ["circle_rate_disparity_ratio", "revenue_staff_vacancy_rate"]
    }
    res = client.post("/simulate-whatif", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_reduction_pct"] > 0
    assert data["delay_days_saved"] >= 0
    print(f"[PASS] Counterfactual simulation passed (Risk Reduction: {data['risk_reduction_pct']}%, Days Saved: {data['delay_days_saved']})")

def test_rag_query():
    payload = {
        "query_text": "Section 15 citizen objection regarding circle rate disparity",
        "top_k": 2
    }
    res = client.post("/knowledge/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["results"]) > 0
    print(f"[PASS] Vector RAG query passed ({len(data['results'])} citations returned)")

if __name__ == "__main__":
    test_root_endpoint()
    test_portfolio_overview()
    test_predict_endpoint()
    test_shap_explain()
    test_prescribe_optimize()
    test_whatif_simulator()
    test_rag_query()
    print("\nALL 7 AUTOMATED ENDPOINT INTEGRATION TESTS PASSED SUCCESSFULLY!")
