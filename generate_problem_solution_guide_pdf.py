import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def build_pdf(filename="SIH26017_Problem_Approach_Reliability_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    c_primary = colors.HexColor("#0f172a") # Slate 900
    c_accent = colors.HexColor("#0284c7")  # Sky 600
    c_emerald = colors.HexColor("#059669") # Emerald 600
    c_purple = colors.HexColor("#7c3aed")  # Purple 600
    c_border = colors.HexColor("#cbd5e1")  # Slate 300
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=c_primary
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_accent
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_primary,
        spaceBefore=8,
        spaceAfter=3
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor("#334155")
    )
    
    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("Smart India Hackathon 2026 · Problem Statement SIH26017", subtitle_style))
    story.append(Paragraph("Problem Statement, Proposed Approach & Reliability Master Guide", title_style))
    story.append(Paragraph("Department of Land Resources (DoLR) · Ministry of Rural Development · Government of India", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_accent, spaceBefore=3, spaceAfter=6))

    # Core Paradigm Hero Box
    paradigm_text = """
    <b>The Core Governance Paradigm:</b><br/>
    <b>1. PREDICT:</b> Multi-Head XGBoost & Discrete Survival Analysis &rarr; 
    <b>2. EXPLAIN:</b> Exact TreeSHAP (&phi; Contributions) &rarr; 
    <b>3. PRIORITIZE:</b> Section 19(2) 365-Day Lapsing Countdown & Red Alerts &rarr; 
    <b>4. ACT:</b> Prescriptive Legal Blueprints & Counterfactual What-If Sandbox.
    """
    p_table = Table([[Paragraph(paradigm_text, body_style)]], colWidths=[540])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(p_table)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # PART 1: The Core Problems
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. The Core Ground Problems in Land Acquisition (LARR Act 2013)", h1_style))
    
    problems_data = [
        [
            Paragraph("<b>#</b>", body_bold),
            Paragraph("<b>Problem Mode</b>", body_bold),
            Paragraph("<b>Ground Reality & Statutory Cause</b>", body_bold),
            Paragraph("<b>Impact on Infrastructure Projects</b>", body_bold)
        ],
        [
            Paragraph("1", body_style),
            Paragraph("<b>Statutory Lapsing (Sec 19(2))</b>", body_style),
            Paragraph("LARR Act strictly mandates Section 19 declaration within <b>12 months (365 days)</b> of Section 11 notice.", body_style),
            Paragraph("If missed by 1 day, the notification <b>lapses automatically</b>, voiding 1+ years of work and forcing total restarts.", body_style)
        ],
        [
            Paragraph("2", body_style),
            Paragraph("<b>Circle Rate Disparity & Backlash</b>", body_style),
            Paragraph("Government circle rates lag real market land transaction values by <b>2x to 4x</b>.", body_style),
            Paragraph("Landowners reject awards, filing thousands of <b>Section 64 court references</b> and securing stay orders.", body_style)
        ],
        [
            Paragraph("3", body_style),
            Paragraph("<b>Opaque 'Black-Box' AI Predictions</b>", body_style),
            Paragraph("Standard AI tools output isolated risk scores without explanation (e.g. 'Risk: 84%').", body_style),
            Paragraph("Collectors and judges reject unexplained predictions because administrative actions must be court-defensible.", body_style)
        ],
        [
            Paragraph("4", body_style),
            Paragraph("<b>Inactionable 'Predictive-Only' Warnings</b>", body_style),
            Paragraph("Existing monitoring tools only flag delays <i>after</i> they happen without actionable next steps.", body_style),
            Paragraph("Administrators remain paralyzed without knowing which specific legal lever will fix the root cause.", body_style)
        ],
        [
            Paragraph("5", body_style),
            Paragraph("<b>Staffing & Cadastral Bottlenecks</b>", body_style),
            Paragraph("Surveyor/Patwari vacancy rates exceed 30%–50% in critical districts.", body_style),
            Paragraph("Directly stalls Section 12 boundary surveys and creates massive Section 15 objection hearing backlogs.", body_style)
        ],
        [
            Paragraph("6", body_style),
            Paragraph("<b>Scattered Precedents & Legal Dossiers</b>", body_style),
            Paragraph("Judicial stay precedents regarding Section 10 (food security) and tribal consent are unindexed.", body_style),
            Paragraph("Legal teams repeat past procedural errors, leading to fresh High Court injunctions.", body_style)
        ]
    ]

    prob_table = Table(problems_data, colWidths=[15, 115, 205, 205])
    prob_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#fee2e2")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(prob_table)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # PART 2: Our Proposed Approach & Solution System
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. Our Proposed Solution System & Engineering Architecture", h1_style))
    
    solution_data = [
        [
            Paragraph("<b>Problem Mode</b>", body_bold),
            Paragraph("<b>Our Proposed Capability</b>", body_bold),
            Paragraph("<b>Engineering Implementation & Solution Approach</b>", body_bold)
        ],
        [
            Paragraph("<b>Statutory Lapsing (Sec 19(2))</b>", body_style),
            Paragraph("<b>365-Day Progression Clocks & Red Alerts</b>", body_bold),
            Paragraph("Real-time countdown meters compute exact days elapsed since Section 11 notice. Automated Red Alerts trigger at 300 days to prompt emergency intervention before statutory death.", body_style)
        ],
        [
            Paragraph("<b>Black-Box AI Skepticism</b>", body_style),
            Paragraph("<b>Exact TreeSHAP Explainable AI (XAI)</b>", body_bold),
            Paragraph("Computes exact Shapley attributions (&phi;i) directly from XGBoost tree traversal paths (pred_contribs=True). Groups drivers into 5 administrative families: Compensation, Legal, Staffing, R&R, Docs.", body_style)
        ],
        [
            Paragraph("<b>Inactionable Warnings</b>", body_style),
            Paragraph("<b>Statutory Prescriptive Remedies</b>", body_bold),
            Paragraph("Maps risk drivers directly to LARR Act provisions (e.g. Section 26 Proviso 4 Direct Negotiation Committee) to bypass court referencing.", body_style)
        ],
        [
            Paragraph("<b>Policy Uncertainty</b>", body_style),
            Paragraph("<b>Counterfactual What-If Sandbox</b>", body_bold),
            Paragraph("Officials toggle actionable levers (e.g. deputing 15 surveyors, direct settlement) & simulate the exact <b>Risk Reduction %</b> and <b>Days Saved</b> before spending capital.", body_style)
        ],
        [
            Paragraph("<b>Multi-Risk Modeling</b>", body_style),
            Paragraph("<b>Multi-Head Inference Engine</b>", body_bold),
            Paragraph("Coordinates 3 heads: Binary Delay Classification, Discrete Survival Analysis (Expected Delay Days), and Stage-wise transition hazard progression.", body_style)
        ],
        [
            Paragraph("<b>Scattered Dossiers</b>", body_style),
            Paragraph("<b>Legal RAG Knowledge Base (pgvector)</b>", body_bold),
            Paragraph("384-dimensional vector semantic search with HNSW cosine indexing over High Court stay orders + real-time drag-and-drop document ingestion.", body_style)
        ],
        [
            Paragraph("<b>Geographic Blindspots</b>", body_style),
            Paragraph("<b>PostGIS Geospatial GIS Layer</b>", body_bold),
            Paragraph("Interactive coordinate mapping across India with risk-coded pins and radar hazard pulses on Critical projects.", body_style)
        ]
    ]

    sol_table = Table(solution_data, colWidths=[115, 155, 270])
    sol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e0f2fe")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(sol_table)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # PART 3: Why It is Reliable & Effective
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. Why Our Approach is Reliable, Robust & Effective", h1_style))
    
    reliability_points = [
        ("1. Mathematical Rigor (Exact TreeSHAP vs Heuristics):", "Calculates exact polynomial-time Shapley values directly from tree paths via pred_contribs=True. Attributions are mathematically exact, reproducible, and court-defensible in administrative audits."),
        ("2. Deep Statutory Alignment with LARR Act 2013:", "Models legal milestones: Section 4 &rarr; 11 &rarr; 15 &rarr; 19 &rarr; 23/30 &rarr; 38. The 365-day Section 19(2) countdown eliminates accidental statutory lapses."),
        ("3. Prescriptive & Counterfactual Optimization:", "Simulates return on intervention (e.g. 52.5% Net Risk Reduction and 229 Days Saved), ensuring field resources are deployed to maximum-impact levers."),
        ("4. Unified PostgreSQL Architecture (Supabase pgvector + PostGIS):", "pgvector with HNSW indexing handles sub-millisecond semantic search, while PostGIS natively executes spatial boundary queries under full ACID compliance."),
        ("5. Production-Ready Speed & Zero-Crash Resiliency:", "End-to-end execution of multi-head inference, TreeSHAP decomposition, and counterfactual simulation executes in < 150 ms with built-in resilient data fallback.")
    ]

    for title, desc in reliability_points:
        story.append(Paragraph(f"• <b>{title}</b> {desc}", body_style))
        story.append(Spacer(1, 1))

    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # PART 4: Future Extensible Scope (Bhulekh, Satellite EO, e-Courts, PFMS)
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. Future Extensible Scope: National Data Integrations", h1_style))
    
    extension_data = [
        [
            Paragraph("<b>Integration Domain</b>", body_bold),
            Paragraph("<b>Target National System / API</b>", body_bold),
            Paragraph("<b>Extensible Capability & Value Addition</b>", body_bold)
        ],
        [
            Paragraph("<b>1. Live Cadastral Land Records</b>", body_style),
            Paragraph("<b>State Bhulekh & DILRMP APIs</b><br/>(Digital India Land Records)", body_bold),
            Paragraph("Direct API linkage with State Bhulekh portals (RoR / Jamabandi) to fetch real-time ownership, joint tenancies, encumbrances, and mutation statuses. Automatically pre-populates parcel count, private-to-govt ratios, and tribal land tags without manual data entry.", body_style)
        ],
        [
            Paragraph("<b>2. Earth Observation & Satellite GIS</b>", body_style),
            Paragraph("<b>ISRO Bhuvan / Sentinel-2 / Landsat</b>", body_bold),
            Paragraph("Automated optical and multi-spectral satellite imagery processing to detect multi-crop irrigation patterns, vegetative health (NDVI), and physical encroachment along the alignment corridor in real time.", body_style)
        ],
        [
            Paragraph("<b>3. Judicial Stay Tracking</b>", body_style),
            Paragraph("<b>e-Courts & NJDG Portal</b><br/>(National Judicial Data Grid)", body_bold),
            Paragraph("Automated polling of CNR numbers to extract live stay petitions, hearing schedules, and Section 64 enhancement appeals filed in District Courts and High Courts.", body_style)
        ],
        [
            Paragraph("<b>4. Compensation DBT Validation</b>", body_style),
            Paragraph("<b>PFMS (Public Financial Management System)</b>", body_bold),
            Paragraph("Real-time escrow disbursement validation under Section 23/30. Automatically certifies that 100% compensation and R&R funds have reached beneficiary bank accounts prior to authorizing Section 38 physical possession.", body_style)
        ],
        [
            Paragraph("<b>5. Citizen Voice & Grievance AI</b>", body_style),
            Paragraph("<b>Bhashini Multilingual Voice Agent</b>", body_bold),
            Paragraph("Automated dialect-specific WhatsApp/IVR voice bots in 12+ regional languages to inform PAFs regarding Section 15 hearings, award dates, and direct grievance submission.", body_style)
        ]
    ]

    ext_table = Table(extension_data, colWidths=[115, 145, 280])
    ext_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3e8ff")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(ext_table)
    story.append(Spacer(1, 6))

    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=2, spaceAfter=4))
    story.append(Paragraph("Smart India Hackathon 2026 · Problem Statement SIH26017 · Department of Land Resources (DoLR)", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7, textColor=colors.HexColor("#94a3b8"), alignment=1)))

    doc.build(story)
    print(f"[SUCCESS] Successfully generated enhanced problem-approach-reliability PDF at: {filename}")

if __name__ == "__main__":
    build_pdf()
