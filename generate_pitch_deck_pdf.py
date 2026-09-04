import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def build_pitch_deck_pdf(filename="SIH26017_Presentation_Pitch_Deck_Guide.pdf"):
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
    c_rose = colors.HexColor("#e11d48")    # Rose 600
    c_amber = colors.HexColor("#d97706")   # Amber 600
    c_border = colors.HexColor("#cbd5e1")  # Slate 300
    
    title_style = ParagraphStyle(
        'PitchTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary
    )
    
    subtitle_style = ParagraphStyle(
        'PitchSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_accent
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=5
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_accent,
        spaceBefore=6,
        spaceAfter=3
    )
    
    body_style = ParagraphStyle(
        'PitchBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )
    
    body_bold = ParagraphStyle(
        'PitchBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("Smart India Hackathon 2026 · Problem Statement SIH26017", subtitle_style))
    story.append(Paragraph("Presentation Pitch Deck & Problem-Solution Master Guide", title_style))
    story.append(Paragraph("Department of Land Resources (DoLR) · Ministry of Rural Development | Government of India", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceBefore=4, spaceAfter=8))

    # Executive Overview
    hero_text = """
    <b>Mission:</b> Transforming Land Acquisition from a reactive bottleneck into a predictive, mathematically optimized process. 
    Our platform operationalizes <b>Predict &rarr; Explain &rarr; Prioritize &rarr; Act</b>, preventing statutory lapses, resolving dispute drivers, 
    and eliminating costly infrastructure overruns before they happen.
    """
    hero_table = Table([[Paragraph(hero_text, body_style)]], colWidths=[540])
    hero_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(hero_table)
    story.append(Spacer(1, 8))

    # -------------------------------------------------------------------------
    # PART 1: The Problem Statement & Failure of Existing Approaches
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. The Core Problem Statement & National Ground Reality", h1_style))
    
    problem_matrix_data = [
        [
            Paragraph("<b>Ground Bottleneck</b>", body_bold),
            Paragraph("<b>Statutory Grounding under LARR Act 2013</b>", body_bold),
            Paragraph("<b>Impact on Infrastructure & Capital</b>", body_bold)
        ],
        [
            Paragraph("<b>1. Statutory Lapsing under Section 19(2)</b>", body_style),
            Paragraph("Section 19(2) defines a strict <b>12-month (365 days)</b> deadline from Section 11 notice to Section 19 declaration.", body_style),
            Paragraph("If missed, the notification <b>lapses automatically</b>, voiding 1+ years of surveys and forcing costly restarts.", body_style)
        ],
        [
            Paragraph("<b>2. Circle Rate Disparity & Valuation Disputes</b>", body_style),
            Paragraph("Administrative circle rates lag market transaction rates by <b>2x to 4x</b>. Landowners reject awards.", body_style),
            Paragraph("Triggers Section 64 court references and judicial stay orders, stalling physical possession for years.", body_style)
        ],
        [
            Paragraph("<b>3. Administrative & Survey Staffing Deficits</b>", body_style),
            Paragraph("High surveyor/revenue staff vacancy rates delay Section 12 demarcation and Section 16 R&R census.", body_style),
            Paragraph("Creates massive objection backlogs under Section 15, pushing projects past the 365-day safety envelope.", body_style)
        ],
        [
            Paragraph("<b>4. Multi-Crop & Tribal Safeguard Hurdles</b>", body_style),
            Paragraph("Section 10 food security caps on irrigated land; Sections 41/42 mandatory Gram Sabha tribal prior consent.", body_style),
            Paragraph("Procedural non-compliance results in High Court stay orders and public protests.", body_style)
        ]
    ]

    p_table = Table(problem_matrix_data, colWidths=[130, 230, 180])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#fee2e2")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(p_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # PART 2: How Our Application Solves Each Problem
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. The Solution Matrix: How Our Platform Counters Every Challenge", h1_style))
    
    solution_data = [
        [
            Paragraph("<b>SIH26017 Problem</b>", body_bold),
            Paragraph("<b>Our AI-Powered Capability</b>", body_bold),
            Paragraph("<b>How It Solves the Challenge</b>", body_bold)
        ],
        [
            Paragraph("<b>Statutory Lapsing (Sec 19(2))</b>", body_style),
            Paragraph("<b>365-Day Progression Clock & Exception Alerts</b>", body_bold),
            Paragraph("Tracks days elapsed from Section 11 notice in real time. Red alert triggers at 300 days prompt emergency intervention before statutory lapse occurs.", body_style)
        ],
        [
            Paragraph("<b>Opaque 'Black Box' AI Predictions</b>", body_style),
            Paragraph("<b>Exact TreeSHAP Explainable AI (XAI)</b>", body_bold),
            Paragraph("Decomposes delay probability into exact Shapley values (&phi;<sub>i</sub>) across 5 administrative families (Compensation, Legal, Staffing, R&R, Docs).", body_style)
        ],
        [
            Paragraph("<b>Inactionable Risk Warnings</b>", body_style),
            Paragraph("<b>Statutory Prescriptive Remedies</b>", body_bold),
            Paragraph("Directly prescribes legally grounded actions (e.g. Section 26 Proviso 4 Direct Negotiation Committee) to bypass lengthy court referencing.", body_style)
        ],
        [
            Paragraph("<b>Uncertainty in Administrative Decisions</b>", body_style),
            Paragraph("<b>Counterfactual What-If Sandbox</b>", body_bold),
            Paragraph("Allows officials to toggle actionable levers (e.g., deputing surveyors) and simulates the exact <b>Risk Reduction %</b> and <b>Days Saved</b> in real time.", body_style)
        ],
        [
            Paragraph("<b>Scattered Judicial Precedents</b>", body_style),
            Paragraph("<b>Dynamic Legal RAG Knowledge Base</b>", body_bold),
            Paragraph("384-dimensional pgvector cosine search retrieves relevant High Court stay precedents and allows real-time drag-and-drop document ingestion.", body_style)
        ],
        [
            Paragraph("<b>Geographical Blindspots</b>", body_style),
            Paragraph("<b>PostGIS Geospatial GIS Layer</b>", body_bold),
            Paragraph("Maps infrastructure corridors across India with risk-coded coordinates, radar pulses on Critical hazards, and district-level drill-downs.", body_style)
        ]
    ]

    s_table = Table(solution_data, colWidths=[120, 160, 260])
    s_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e0f2fe")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(s_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # PART 3: Technical Architecture & Why It Works
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. Technical Architecture & Core Differentiators", h1_style))
    
    tech_points = [
        ("Multi-Head Machine Learning (XGBoost):", "Features 3 coordinated heads: Binary delay probability, discrete-time survival analysis (expected delay days), and stage-wise hazard estimation."),
        ("Exact TreeSHAP vs Kernel Approximations:", "Extracts exact Shapley attributions directly from tree traversal paths via pred_contribs at microsecond serving speed without random sampling noise."),
        ("Supabase PostgreSQL (pgvector + PostGIS):", "In-database 384D vector embeddings with HNSW cosine indexing alongside native PostGIS spatial point/polygon geometry, ensuring full ACID compliance and sub-second queries."),
        ("Dynamic Knowledge Base Ingestion:", "Real-time document ingestion pipeline (chunking + SentenceTransformers) to absorb new court orders as the project moves forward."),
        ("Automated Live Google Docs Sync:", "Appends executive advisory briefs and prescriptive blueprints directly into shared team documentation.")
    ]

    for title, desc in tech_points:
        story.append(Paragraph(f"• <b>{title}</b> {desc}", body_style))
        story.append(Spacer(1, 1.5))

    story.append(Spacer(1, 8))

    # -------------------------------------------------------------------------
    # PART 4: Step-by-Step Live Demo Flow for Judges
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. Recommended Live Demonstration Script for SIH Jury", h1_style))
    
    demo_steps = [
        ("Step 1: The Executive Command Hub", "Open http://localhost:3000. Show national KPIs: Total monitored acreage, ₹ Cr outlay under monitoring, and interactive PostGIS map with risk-coded project pins."),
        ("Step 2: Section 19(2) Statutory Lapsing Tracker", "Click on the Sec 19(2) tab. Highlight the 365-day legal timers and show active Red Alerts on projects nearing the 12-month statutory expiration deadline."),
        ("Step 3: TreeSHAP Attribution Diagnostics", "Select a Critical risk project (e.g. Vadodara Expressway). Reveal the exact feature contribution waterfall explaining why risk is elevated (e.g. Circle Rate Disparity contributes +31%)."),
        ("Step 4: The Counterfactual What-If Sandbox", "Check 'Direct Settlement under Section 26' and 'Deploy 15 Deputed Surveyors' &rarr; Click 'Run What-If Simulation' &rarr; Show judges the live 52.5% risk drop and 229 delay days saved!"),
        ("Step 5: Dynamic Legal RAG Knowledge Base", "Query: 'High Court stay orders regarding multi-crop irrigated land under Section 10' &rarr; Show instantaneous vector semantic citations matching pgvector chunks.")
    ]

    for title, desc in demo_steps:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=4, spaceAfter=6))
    story.append(Paragraph("Smart India Hackathon 2026 · SIH26017 · Ministry of Rural Development (Department of Land Resources)", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor("#94a3b8"), alignment=1)))

    doc.build(story)
    print(f"[SUCCESS] Successfully generated presentation pitch deck PDF at: {filename}")

if __name__ == "__main__":
    build_pitch_deck_pdf()
