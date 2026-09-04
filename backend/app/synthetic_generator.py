import uuid
import random
import numpy as np
from datetime import date, timedelta
from typing import List, Dict, Any

class SyntheticLarrDataGenerator:
    """
    Generates domain-informed, defensible synthetic acquisition records anchored to
    MoSPI infrastructure delay reports and parliamentary audit findings.
    """
    STATES_DISTRICTS = [
        ("Gujarat", ["Vadodara", "Ahmedabad", "Surat", "Kutch", "Bharuch"]),
        ("Maharashtra", ["Nagpur", "Pune", "Thane", "Nashik", "Aurangabad"]),
        ("Karnataka", ["Bengaluru Urban", "Chitradurga", "Belagavi", "Mysuru"]),
        ("Tamil Nadu", ["Chennai", "Coimbatore", "Salem", "Madurai"]),
        ("West Bengal", ["Hooghly", "Purba Medinipur", "Howrah", "Burdwan"]),
        ("Uttar Pradesh", ["Varanasi", "Lucknow", "Noida", "Kanpur", "Prayagraj"]),
        ("Odisha", ["Jharsuguda", "Sambalpur", "Cuttack", "Bhubaneswar"])
    ]

    PROJECT_TYPES = [
        ("National Highway", "Transport", 0.70),
        ("Dedicated Freight Corridor", "Transport", 0.80),
        ("Irrigation Dam & Canal Network", "Water Resources", 0.0),
        ("Industrial Corridor Mega Hub", "Urban Development", 0.80),
        ("Renewable Solar Energy Park", "Energy", 0.70),
        ("High-Speed Rail Transit", "Transport", 0.70)
    ]

    STAGES = [
        "Section 11 Notification",
        "Section 15 Hearing",
        "Section 19 Declaration",
        "Section 23 Award",
        "Section 38 Possession"
    ]

    @classmethod
    def generate_project(cls, index: int = 1) -> Dict[str, Any]:
        state, districts = random.choice(cls.STATES_DISTRICTS)
        district = random.choice(districts)
        ptype, sector, required_consent = random.choice(cls.PROJECT_TYPES)
        
        acreage = round(random.uniform(40.0, 1200.0), 1)
        parcels = int(acreage * random.uniform(0.6, 2.5))
        paf = int(parcels * random.uniform(1.2, 3.5))
        cost = round(acreage * random.uniform(2.5, 8.5), 1)
        
        # Lat/Long approximations for India bounding box
        lat = round(random.uniform(11.0, 28.5), 4)
        lon = round(random.uniform(72.5, 88.5), 4)
        
        circle_disparity = round(random.uniform(1.0, 3.8), 2)
        staff_vacancy = round(random.uniform(5.0, 48.0), 1)
        sc_st_pct = round(random.uniform(2.0, 45.0), 1)
        multi_crop_pct = round(random.uniform(0.0, 75.0), 1)
        litigation_rate = round(random.uniform(1.0, 20.0), 1)
        s15_avg_days = round(random.uniform(15.0, 120.0), 1)
        
        stage_idx = random.randint(0, 4)
        current_stage = cls.STAGES[stage_idx]
        
        # Milestone dates simulation
        days_ago_s11 = random.randint(40, 450)
        s11_date = date.today() - timedelta(days=days_ago_s11)
        
        s15_date = s11_date + timedelta(days=random.randint(60, 120)) if stage_idx >= 1 else None
        s19_date = s11_date + timedelta(days=random.randint(180, 340)) if stage_idx >= 2 else None
        s23_date = s19_date + timedelta(days=random.randint(90, 200)) if (s19_date and stage_idx >= 3) else None
        s38_date = s23_date + timedelta(days=random.randint(60, 150)) if (s23_date and stage_idx >= 4) else None

        return {
            "id": f"p-synth-{index}",
            "project_code": f"PRJ-{sector[:3].upper()}-{2026}-{index:03d}",
            "project_name": f"{district} {ptype} Phase {random.randint(1, 4)}",
            "project_type": ptype,
            "sector": sector,
            "state_name": state,
            "district_name": district,
            "latitude": lat,
            "longitude": lon,
            "total_acreage_ha": acreage,
            "num_land_parcels": parcels,
            "affected_families": paf,
            "project_cost_cr": cost,
            "private_to_govt_ratio": round(random.uniform(0.5, 6.5), 1),
            "sc_st_land_percentage": sc_st_pct,
            "multi_crop_irrigated_percentage": multi_crop_pct,
            "required_consent_percentage": int(required_consent),
            "non_owner_to_owner_paf_ratio": round(random.uniform(0.1, 1.3), 2),
            "circle_rate_disparity_ratio": circle_disparity,
            "rr_cost_share_percentage": round(random.uniform(5.0, 35.0), 1),
            "rural_multiplier_factor": round(random.choice([1.0, 1.25, 1.5, 1.75, 2.0]), 1),
            "district_litigation_rate": litigation_rate,
            "revenue_staff_vacancy_rate": staff_vacancy,
            "avg_s15_resolution_days": s15_avg_days,
            "current_stage": current_stage,
            "s11_notification_date": s11_date.isoformat(),
            "s15_hearing_date": s15_date.isoformat() if s15_date else None,
            "s19_declaration_date": s19_date.isoformat() if s19_date else None,
            "s23_award_date": s23_date.isoformat() if s23_date else None,
            "s38_possession_date": s38_date.isoformat() if s38_date else None
        }

    @classmethod
    def generate_batch(cls, count: int = 15) -> List[Dict[str, Any]]:
        return [cls.generate_project(i + 10) for i in range(count)]
