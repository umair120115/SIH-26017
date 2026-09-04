import os
import math
from typing import List, Dict, Any, Optional
from app.config import settings

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    psycopg2 = None
    RealDictCursor = None

class DatabaseManager:
    def __init__(self):
        self.db_url = settings.DATABASE_URL
        self.is_connected = False
        self._test_connection()
        
        # In-memory store for instant demonstration & fallback
        self.in_memory_projects: List[Dict[str, Any]] = []
        self.in_memory_documents: List[Dict[str, Any]] = []
        self._seed_default_data()

    def _test_connection(self):
        if not self.db_url or psycopg2 is None:
            self.is_connected = False
            return
        try:
            conn = psycopg2.connect(self.db_url, connect_timeout=3)
            conn.close()
            self.is_connected = True
            print("[Database] Successfully connected to PostgreSQL / Supabase.")
        except Exception as e:
            print(f"[Database] PostgreSQL connection notice ({e}). Utilizing Local Resilient Store.")
            self.is_connected = False

    def get_connection(self):
        if self.is_connected and self.db_url and psycopg2:
            return psycopg2.connect(self.db_url, cursor_factory=RealDictCursor)
        return None

    def _seed_default_data(self):
        """Pre-seeds realistic infrastructure projects across India mapped to LARR Act statutory states."""
        self.in_memory_projects = [
            {
                "id": "p-101",
                "project_code": "PRJ-NH-2026-08",
                "project_name": "Delhi-Mumbai Expressway Spur (Vadodara-Jambusar)",
                "project_type": "National Highway",
                "sector": "Transport",
                "state_name": "Gujarat",
                "district_name": "Vadodara",
                "latitude": 22.3072,
                "longitude": 73.1812,
                "total_acreage_ha": 340.5,
                "num_land_parcels": 210,
                "affected_families": 460,
                "project_cost_cr": 1250.0,
                "private_to_govt_ratio": 4.1,
                "sc_st_land_percentage": 12.0,
                "multi_crop_irrigated_percentage": 35.0,
                "required_consent_percentage": 70,
                "non_owner_to_owner_paf_ratio": 0.65,
                "circle_rate_disparity_ratio": 2.4,
                "rr_cost_share_percentage": 18.5,
                "rural_multiplier_factor": 1.5,
                "district_litigation_rate": 8.2,
                "revenue_staff_vacancy_rate": 28.0,
                "avg_s15_resolution_days": 65.0,
                "current_stage": "Section 15 Hearing",
                "s11_notification_date": "2025-10-15",
                "s15_hearing_date": "2026-02-10",
                "s19_declaration_date": None,
                "s23_award_date": None,
                "s38_possession_date": None
            },
            {
                "id": "p-102",
                "project_code": "PRJ-DFCC-2026-14",
                "project_name": "Eastern Dedicated Freight Corridor (Sonnagar-Dankuni)",
                "project_type": "Railway Corridor",
                "sector": "Transport",
                "state_name": "West Bengal",
                "district_name": "Hooghly",
                "latitude": 22.9038,
                "longitude": 88.3968,
                "total_acreage_ha": 520.0,
                "num_land_parcels": 480,
                "affected_families": 920,
                "project_cost_cr": 2800.0,
                "private_to_govt_ratio": 5.8,
                "sc_st_land_percentage": 24.0,
                "multi_crop_irrigated_percentage": 68.0,
                "required_consent_percentage": 80,
                "non_owner_to_owner_paf_ratio": 1.10,
                "circle_rate_disparity_ratio": 3.1,
                "rr_cost_share_percentage": 26.0,
                "rural_multiplier_factor": 2.0,
                "district_litigation_rate": 14.5,
                "revenue_staff_vacancy_rate": 42.0,
                "avg_s15_resolution_days": 110.0,
                "current_stage": "Section 11 Notification",
                "s11_notification_date": "2025-08-01",
                "s15_hearing_date": "2025-12-05",
                "s19_declaration_date": None,
                "s23_award_date": None,
                "s38_possession_date": None
            },
            {
                "id": "p-103",
                "project_code": "PRJ-IRR-2026-03",
                "project_name": "Upper Bhadra Lift Irrigation & Canal Network",
                "project_type": "Irrigation Dam",
                "sector": "Water Resources",
                "state_name": "Karnataka",
                "district_name": "Chitradurga",
                "latitude": 14.2251,
                "longitude": 76.3980,
                "total_acreage_ha": 890.0,
                "num_land_parcels": 640,
                "affected_families": 1150,
                "project_cost_cr": 3400.0,
                "private_to_govt_ratio": 2.2,
                "sc_st_land_percentage": 38.0,
                "multi_crop_irrigated_percentage": 14.0,
                "required_consent_percentage": 0, # Gov project
                "non_owner_to_owner_paf_ratio": 0.40,
                "circle_rate_disparity_ratio": 1.4,
                "rr_cost_share_percentage": 14.0,
                "rural_multiplier_factor": 1.8,
                "district_litigation_rate": 3.8,
                "revenue_staff_vacancy_rate": 12.0,
                "avg_s15_resolution_days": 38.0,
                "current_stage": "Section 19 Declaration",
                "s11_notification_date": "2025-03-20",
                "s15_hearing_date": "2025-07-15",
                "s19_declaration_date": "2025-11-10",
                "s23_award_date": None,
                "s38_possession_date": None
            },
            {
                "id": "p-104",
                "project_code": "PRJ-SOLAR-2026-21",
                "project_name": "Khavda Ultra Mega Renewable Solar Energy Park Phase III",
                "project_type": "Renewable Energy",
                "sector": "Energy",
                "state_name": "Gujarat",
                "district_name": "Kutch",
                "latitude": 23.8500,
                "longitude": 69.7500,
                "total_acreage_ha": 1450.0,
                "num_land_parcels": 95,
                "affected_families": 110,
                "project_cost_cr": 4500.0,
                "private_to_govt_ratio": 0.3,
                "sc_st_land_percentage": 5.0,
                "multi_crop_irrigated_percentage": 0.0,
                "required_consent_percentage": 70,
                "non_owner_to_owner_paf_ratio": 0.15,
                "circle_rate_disparity_ratio": 1.1,
                "rr_cost_share_percentage": 6.0,
                "rural_multiplier_factor": 1.2,
                "district_litigation_rate": 1.5,
                "revenue_staff_vacancy_rate": 8.0,
                "avg_s15_resolution_days": 20.0,
                "current_stage": "Section 23 Award",
                "s11_notification_date": "2025-01-10",
                "s15_hearing_date": "2025-04-12",
                "s19_declaration_date": "2025-08-30",
                "s23_award_date": "2026-01-20",
                "s38_possession_date": None
            },
            {
                "id": "p-105",
                "project_code": "PRJ-METRO-2026-09",
                "project_name": "Bengaluru Metro Phase 3 Line (ORR West-Hebbal)",
                "project_type": "Urban Metro",
                "sector": "Urban Development",
                "state_name": "Karnataka",
                "district_name": "Bengaluru Urban",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "total_acreage_ha": 95.4,
                "num_land_parcels": 310,
                "affected_families": 540,
                "project_cost_cr": 6800.0,
                "private_to_govt_ratio": 7.5,
                "sc_st_land_percentage": 2.0,
                "multi_crop_irrigated_percentage": 0.0,
                "required_consent_percentage": 0,
                "non_owner_to_owner_paf_ratio": 1.45,
                "circle_rate_disparity_ratio": 3.8,
                "rr_cost_share_percentage": 32.0,
                "rural_multiplier_factor": 1.0,
                "district_litigation_rate": 18.2,
                "revenue_staff_vacancy_rate": 34.0,
                "avg_s15_resolution_days": 95.0,
                "current_stage": "Section 15 Hearing",
                "s11_notification_date": "2025-09-05",
                "s15_hearing_date": "2026-01-18",
                "s19_declaration_date": None,
                "s23_award_date": None,
                "s38_possession_date": None
            }
        ]
        
        # Seed initial legal RAG documents
        self.in_memory_documents = [
            {
                "id": "doc-01",
                "project_id": "p-102",
                "document_type": "High Court Stay Order",
                "document_title": "HC Stay Order W.P. No. 4128/2025",
                "chunk_content": "The High Court of Calcutta granted an interim stay on Section 19 declaration proceedings citing non-compliance with Section 10 multi-crop irrigated land restrictions and insufficient Social Impact Assessment (SIA) public hearings.",
                "embedding": [0.05] * 384
            },
            {
                "id": "doc-02",
                "project_id": "p-101",
                "document_type": "Section 15 Objection",
                "document_title": "Citizen Representation on Circle Rates",
                "chunk_content": "Representation by Jambusar Farmers Welfare Association: The proposed compensation pegged at 2022 circle rate (Rs. 450/sqm) suffers severe disparity against prevailing market transaction values (Rs. 1,100/sqm). Requesting invoking of Section 26 proviso 4 direct settlement committee.",
                "embedding": [0.08] * 384
            },
            {
                "id": "doc-03",
                "project_id": "p-103",
                "document_type": "SIA Report",
                "document_title": "Social Impact Assessment Executive Summary",
                "chunk_content": "SIA Report confirms 38% tribal population in submergence zone. Section 41 Rehabilitation & Resettlement plan prepared in Kannada dialect; Gram Sabha resolution passed with 84% quorum.",
                "embedding": [0.03] * 384
            }
        ]

db_manager = DatabaseManager()
