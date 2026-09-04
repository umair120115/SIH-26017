# LARR Act 2013 Feature Engineering & Statutory Law Reference Guide
## Comprehensive Breakdown of ML Model Features & Statutory Legal Framework
### Department of Land Resources (DoLR) | Smart India Hackathon (SIH26017)

---

## Part 1: Detailed Breakdown of the 14 ML Model Features
Our XGBoost delay-prediction model and TreeSHAP attribution engine utilize **14 domain-engineered statutory and operational features**. Below is the rationale, mathematical definition, and behavioral impact for each feature:

```
┌──────────────────────────────────────┬─────────────┬─────────────────────────────────────────────────────────┐
│ Feature Name                         │ Data Type   │ Statutory / Administrative Significance                 │
├──────────────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ 1. total_acreage_ha                  │ Float (ha)  │ Total physical footprint under acquisition              │
│ 2. num_land_parcels                  │ Integer     │ Cadastral fragmentation and title complexity            │
│ 3. private_to_govt_ratio             │ Float (x:1) │ Proportion of privately titled land vs government land   │
│ 4. sc_st_land_percentage             │ Float (%)   │ Tribal land protective safeguards (Sec 41/42)           │
│ 5. multi_crop_irrigated_percentage   │ Float (%)   │ Food security ceiling on irrigated farmland (Sec 10)    │
│ 6. required_consent_percentage       │ Integer (%) │ Mandatory landowner prior consent hurdle (0%, 70%, 80%) │
│ 7. non_owner_to_owner_paf_ratio      │ Float (x:1) │ Livelihood claim density of non-owner PAFs (Sec 3(c))   │
│ 8. circle_rate_disparity_ratio       │ Float (x:1) │ Ratio of real market value to circle rate               │
│ 9. rr_cost_share_percentage          │ Float (%)   │ R&R cost share relative to total project outlay         │
│ 10. rural_multiplier_factor          │ Float (1-2) │ Rural market value multiplier factor (Sec 26(2))        │
│ 11. district_litigation_rate         │ Float (%)   │ Historical land acquisition stay propensity in district │
│ 12. revenue_staff_vacancy_rate       │ Float (%)   │ Survey/revenue department staffing deficit              │
│ 13. avg_s15_resolution_days          │ Float (days)│ Citizen objection disposal latency under Section 15     │
│ 14. days_since_s11                   │ Integer     │ Days elapsed since Section 11 notice (Sec 19(2) clock)  │
└──────────────────────────────────────┴─────────────┴─────────────────────────────────────────────────────────┘
```

---

### Detailed Feature Rationales:

#### 1. `total_acreage_ha` (Total Footprint in Hectares)
* **Definition**: The total land area required for the infrastructure corridor.
* **Why used**: Larger acquisitions cross multiple revenue villages, increasing procedural complexity, Gram Sabha sessions, and joint measurement surveys.

#### 2. `num_land_parcels` (Cadastral Fragmentation)
* **Definition**: Total distinct survey numbers/khasra plots identified in the Section 11 preliminary notification.
* **Why used**: High fragmentation means hundreds of individual title-holders, disputed inheritance entries in the *Jamabandi/RoR*, and higher Section 15 objection counts.

#### 3. `private_to_govt_ratio` (Private vs Public Land Ratio)
* **Definition**: $\text{Ratio} = \frac{\text{Private Titled Land (ha)}}{\text{Government / Gram Panchayat Land (ha)}}$.
* **Why used**: Government-owned land can be transferred via inter-departmental alienation in weeks; private land requires formal notice, individual hearings, award inquiries, and consent.

#### 4. `sc_st_land_percentage` (Tribal Land Proportion)
* **Definition**: Percentage of acquired land belonging to Scheduled Castes and Scheduled Tribes.
* **Why used**: Triggers mandatory compliance with **Sections 41 and 42** of the LARR Act 2013, requiring a dedicated Development Plan, 1/3 upfront compensation, and mandatory Gram Sabha / Autonomous Council prior consent in Fifth Schedule areas.

#### 5. `multi_crop_irrigated_percentage` (Food Security Safeguard)
* **Definition**: Percentage of acquired agricultural land having multi-crop assured irrigation.
* **Why used**: **Section 10(1) & 10(2)** prohibits acquiring multi-crop irrigated land except under exceptional circumstances and within strict district-level cumulative acreage limits. High values trigger High Court stay orders if alternative barren land was not surveyed.

#### 6. `required_consent_percentage` (Mandatory Prior Consent)
* **Definition**: Mandatory prior consent threshold: **0%** for purely Public Sector projects (Sec 2(1)), **70%** for Public-Private Partnerships (PPP) (Sec 2(2)(a)), and **80%** for Private Company projects (Sec 2(2)(b)).
* **Why used**: Obtaining 70% or 80% notarized consent from affected families is the single highest legal hurdle. Incomplete consent invalidates the Social Impact Assessment (SIA).

#### 7. `non_owner_to_owner_paf_ratio` (Livelihood Displaced Families)
* **Definition**: $\text{Ratio} = \frac{\text{Non-Owner Affected Families (Tenants, Agricultural Labourers, Forest Dwellers)}}{\text{Title-Holding Landowners}}$.
* **Why used**: Under **Section 3(c) & Section 16**, non-landowning livelihood losers are entitled to mandatory R&R entitlements (Second Schedule). High ratios lead to under-counting disputes and protest-driven halts.

#### 8. `circle_rate_disparity_ratio` (Valuation Friction)
* **Definition**: $\text{Disparity} = \frac{\text{Actual Prevailing Market Transaction Rate}}{\text{Official Government Circle / Guideline Rate}}$.
* **Why used**: If circle rates lag market value ($>1.5\text{x}$), landowners refuse Section 23 awards, filing massive **Section 64 Land Acquisition Authority** references and demanding High Court stay orders.

#### 9. `rr_cost_share_percentage` (R&R Budget Share)
* **Definition**: Percentage of total land acquisition budget allocated to Rehabilitation and Resettlement infrastructure (housing colonies, annuity, skill training).
* **Why used**: Projects with high R&R overheads require multi-agency coordination (housing boards, DoLR, municipal bodies), creating bureaucratic inter-agency latency.

#### 10. `rural_multiplier_factor` (Rural Multiplier Factor)
* **Definition**: Statutory multiplier between **1.0 and 2.0** prescribed by the State Government based on distance from urban boundaries under Section 26(2) and First Schedule.
* **Why used**: Ambiguity in state gazette notifications regarding the exact distance slab often triggers legal litigation over calculated base compensation.

#### 11. `district_litigation_rate` (District Stay Propensity)
* **Definition**: Historical percentage of land acquisition notices in the district that have faced High Court / Supreme Court stay orders over the past 5 years.
* **Why used**: Captures localized institutional litigiousness, presence of active farmer associations, and local judiciary stay precedents.

#### 12. `revenue_staff_vacancy_rate` (Surveying Deficit)
* **Definition**: Percentage of sanctioned posts (Patwaris, Kanungos, Revenue Inspectors, Surveyors) lying vacant in the district revenue office.
* **Why used**: Directly bottlenecks Section 12 field boundary surveys and Section 15 objection verification, causing timeline overruns.

#### 13. `avg_s15_resolution_days` (Section 15 Citizen Disposal Latency)
* **Definition**: Mean turnaround time (in days) taken by the Land Acquisition Officer to hear and dispose of citizen objections submitted under Section 15(1).
* **Why used**: High latency directly eats into the strict 12-month statutory window allowed before Section 19 declaration.

#### 14. `days_since_s11` (Statutory Section 19(2) Clock)
* **Definition**: Number of calendar days elapsed since the publication of the preliminary notification under Section 11(1).
* **Why used**: Governed by **Section 19(2)**. If `days_since_s11 > 365` without Section 19 publication, the entire acquisition lapses by law.

---

## Part 2: The Legal Framework: Key Laws, Sections, & Compliance Mandates
The **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (LARR Act 2013)** replaced the colonial Land Acquisition Act of 1894. It mandates a human-centric, strictly time-bound process:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                      LARR Act 2013 Chronological Statutory Milestone Flow                       │
│                                                                                                 │
│  [Section 4]        [Section 11]       [Section 15]        [Section 19]         [Section 23/30] │
│  Social Impact  ──> Preliminary   ──>  Hearing of     ──>  Final           ──>  Award & 100%    │
│  Assessment         Notification       Objections          Declaration          Solatium        │
│  (SIA Report)       (Sec 19 Clock)     (60-day window)     (Within 12 Mo)       Disbursement    │
│                                                                  │                              │
│                                                            [Section 19(2)]                      │
│                                                            12-Month Lapsing                     │
│                                                            Deadline (365d)                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Step-by-Step Statutory Breakdown:

### 1. Section 4 & 7: Social Impact Assessment (SIA)
* **Statutory Rule**: Mandatory SIA study carried out in consultation with Gram Sabhas, evaluating whether project serves public purpose and estimating livelihood losers.
* **Mandatory Compliance**: Multi-disciplinary Expert Group (Section 7) must approve the SIA within 6 months.

### 2. Section 10: Special Provisions to Safeguard Food Security
* **Statutory Rule**: No multi-crop irrigated land shall be acquired except under exceptional circumstances as a demonstrable last resort.
* **Legal Constraint**: Acquired multi-crop land must not exceed the cumulative state-notified ceiling, and an equivalent area of cultivable wasteland must be developed.

### 3. Section 11: Preliminary Notification (The Clock Starts)
* **Statutory Rule**: Notification published in the Official Gazette, two local newspapers, and on Gram Panchayat notice boards declaring the intent to acquire land.
* **Legal Constraint**: **No transactions, sales, or encumbrances** on the land are permitted after this date. This date starts the **strict Section 19(2) 12-month clock**.

### 4. Section 15: Hearing of Citizen Objections
* **Statutory Rule**: Any interested person has **60 days** from Section 11 notification to file written objections regarding public purpose, suitability of land, or SIA findings.
* **Legal Constraint**: The Collector/LAO must give every objector an opportunity of being heard in person and submit a formal report to the Government.

### 5. Section 19 & Section 19(2): Final Declaration & The 12-Month Lapsing Rule
* **Statutory Rule**: Government publishes final declaration of acquisition after verifying that the project proponent has deposited required compensation funds.
* **CRITICAL LEGAL RULE (Section 19(2))**:
  > *"If no declaration is made within twelve months from the date of preliminary notification under Section 11, the preliminary notification shall be deemed to have lapsed."*
* **Why it matters**: If `days_since_s11 > 365` without Section 19 publication, the entire acquisition is legally void. Our platform's **Lapsing Alert Tracker** is specifically engineered to prevent this catastrophic administrative failure.

### 6. Section 26: Determination of Market Value
* **Statutory Rule**: Base market value calculated as the higher of:
  1. Average sale price recorded in top 50% highest value sale deeds in the vicinity over preceding 3 years.
  2. Official circle rate.
  3. Consented amount in case of private/PPP acquisitions.
* **Proviso 4 Remedy**: Authorizes the Collector to convene direct negotiation committees with landowners where circle rates are demonstrably outdated.

### 7. Section 30 & First Schedule: 100% Solatium
* **Statutory Rule**: In addition to market value multiplied by rural factor, the Collector **must award 100% Solatium** ($\text{Total Base} \times 2$) for compulsory nature of acquisition.

### 8. Section 38: Physical Possession Conditionality
* **Statutory Rule**: The Collector **cannot take physical possession** of land until full compensation under Section 23 and R&R entitlements under the Second Schedule are completely disbursed.

### 9. Section 41 & 42: Scheduled Castes and Scheduled Tribes Safeguards
* **Statutory Rule**: Prohibits acquisition of tribal land in Scheduled Areas (Fifth Schedule) as far as possible. If unavoidable:
  * Mandatory prior consent of Gram Sabhas or Autonomous District Councils.
  * One-third (33%) of total compensation paid upfront.
  * Dedicated Tribal Development Plan providing land-for-land settlement.

### 10. Section 64: Court References to LARR Authority
* **Statutory Rule**: Any citizen dissatisfied with measurement or compensation can demand a reference to the **Land Acquisition, Rehabilitation and Resettlement Authority (LARRA)** (presided by a District Judge).
* **Legal Constraint**: Does not automatically stay project work unless an injunction is granted by the High Court under Article 226.
