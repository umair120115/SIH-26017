import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def build_pdf(filename="DoLR_LARR_Platform_Executive_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0f172a") # Slate 900
    c_accent = colors.HexColor("#0284c7")  # Sky 600
    c_emerald = colors.HexColor("#059669") # Emerald 600
    c_rose = colors.HexColor("#e11d48")    # Rose 600
    c_dark = colors.HexColor("#1e293b")    # Slate 800
    c_light_bg = colors.HexColor("#f8fafc")# Slate 50
    c_border = colors.HexColor("#cbd5e1")  # Slate 300
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        alignment=0
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=c_accent,
        alignment=0
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=6
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_accent,
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )
    
    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )
    
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#0f766e")
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("DoLR · LARR Act 2013 Predictive Analytics System", title_style))
    story.append(Paragraph("Smart India Hackathon (SIH26017) · Ministry of Rural Development — Department of Land Resources", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceBefore=4, spaceAfter=10))

    # Executive Overview Box
    overview_text = """
    <b>System Scope:</b> An AI-powered decision-support and early-detection platform engineered under the 
    <i>Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (LARR Act 2013)</i>. 
    It operationalizes the 4-step governance paradigm: <b>Predict &rarr; Explain &rarr; Prioritize &rarr; Act</b>.
    """
    callout_table = Table([[Paragraph(overview_text, body_style)]], colWidths=[540])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # SECTION 1: What the UI is Explaining and Showing
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. Detailed UI Architecture & Visual Capabilities", h1_style))
    story.append(Paragraph(
        "The web application features an executive-grade dashboard structured into five dedicated operational consoles:",
        body_style
    ))
    story.append(Spacer(1, 6))

    ui_features_data = [
        [
            Paragraph("<b>UI Console / Module</b>", body_bold),
            Paragraph("<b>What It Explains & Visualizes</b>", body_bold),
            Paragraph("<b>Statutory & Operational Purpose</b>", body_bold)
        ],
        [
            Paragraph("<b>1. Executive Top KPI Metrics Bar</b>", body_style),
            Paragraph("• Total monitored footprint (Acreage in ha & active parcels)<br/>• Capital outlay under monitoring (₹ Cr)<br/>• Mean expected delay in days (Survival Head output)<br/>• Active Section 19(2) statutory lapsing danger counter<br/>• Portfolio risk distribution gauge (Low, Medium, Critical)", body_style),
            Paragraph("Gives leadership an instant macro view of systemic delay exposure and capital at risk across national portfolios.", body_style)
        ],
        [
            Paragraph("<b>2. Geospatial GIS Map (PostGIS Layer)</b>", body_style),
            Paragraph("• Interactive geographical projection across India's states & districts<br/>• Real-time coordinate pins color-coded by delay risk<br/>• Radar animation on Critical hazard projects<br/>• Stage-wise filtering and inspection drawer", body_style),
            Paragraph("Enables spatial clustering and geographical root-cause analysis (e.g., identifying state/district level bottleneck zones).", body_style)
        ],
        [
            Paragraph("<b>3. Section 19(2) 12-Month Lapsing Tracker</b>", body_style),
            Paragraph("• 365-day statutory countdown clocks per project<br/>• Days elapsed since Section 11 preliminary notice<br/>• Critical red alerts for projects exceeding 300 days without Section 19 declaration", body_style),
            Paragraph("Enforces strict compliance with Section 19(2) to prevent notifications from automatically lapsing and invalidating acquisitions.", body_style)
        ],
        [
            Paragraph("<b>4. TreeSHAP Attribution Diagnostics</b>", body_style),
            Paragraph("• Exact Shapley feature attributions computed directly from tree paths<br/>• Categorization into 5 driver families (Compensation, Litigation, Administrative, R&R, Documentation)<br/>• Waterfall visualization of risk-increasing vs risk-mitigating factors", body_style),
            Paragraph("Replaces 'black box' machine learning with transparent, court-defensible explanations for administrative decisions.", body_style)
        ],
        [
            Paragraph("<b>5. Counterfactual What-If Sandbox</b>", body_style),
            Paragraph("• Interactive toggle levers for actionable remedies (Sec 26 Direct Negotiations, Surveyor Deputation, Sec 15 Hearing Officers)<br/>• Real-time forecast of risk reduction % and delay days saved", body_style),
            Paragraph("Empowers administrators to test the impact of interventions before committing capital and field resources.", body_style)
        ],
        [
            Paragraph("<b>6. Dynamic Legal RAG Knowledge Base</b>", body_style),
            Paragraph("• 384-dimensional vector semantic search across court stays & objections<br/>• Drag-and-drop document uploader with automatic chunking & vectorization", body_style),
            Paragraph("Provides instant legal precedent grounding and enables the knowledge base to dynamically absorb court orders in real time.", body_style)
        ]
    ]

    ui_table = Table(ui_features_data, colWidths=[130, 260, 150])
    ui_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(ui_table)
    story.append(Spacer(1, 12))

    # -------------------------------------------------------------------------
    # SECTION 2: How Anyone Can Utilize This Application Effectively
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. Operational Workflows & User Persona Guide", h1_style))
    
    workflows = [
        ("A. District Collector & Land Acquisition Officer (LAO):", 
         "1. Monitor the <b>Sec 19(2) Lapsing Tracker</b> daily to identify parcels nearing the 365-day legal expiration.<br/>"
         "2. When a project shows high risk due to Circle Rate Disparity, navigate to <b>Prescriptive Remedies</b> to invoke Section 26 Proviso 4 direct negotiation procedures.<br/>"
         "3. If staff shortages are detected, requisition deputed survey teams to clear Section 12 boundary demarcation."),
        
        ("B. State Ministry & DoLR Policy Monitoring Cell:", 
         "1. Utilize the <b>Geospatial GIS Map</b> to filter projects by Sector and identify regional litigation trends.<br/>"
         "2. Use the <b>What-If Simulator</b> to determine which state-level administrative policy shifts (e.g. standardizing Lok Adalat conciliation) yield the greatest overall delay reductions."),
        
        ("C. Project Directors (NHAI, Railways, Energy):", 
         "1. Query the <b>Legal RAG Knowledge Base</b> for judicial stay precedents regarding multi-crop irrigated land exemptions (Section 10).<br/>"
         "2. Upload newly filed citizen objections or environmental clearance letters to continuously update the project's vector risk profile.")
    ]

    for title, desc in workflows:
        story.append(Paragraph(title, h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 8))

    # -------------------------------------------------------------------------
    # SECTION 3: Why XGBoost Classifier Was Selected
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. Technical Justification: Why XGBoost Classifier?", h1_style))
    
    xgb_points = [
        ("1. Heterogeneous Tabular Data Mastery:", "Land acquisition records combine continuous financial metrics (cost, circle rate disparity), integer parcel counts, categorical stages, and ratio distributions. Gradient-boosted decision trees (XGBoost) consistently outperform deep neural networks on tabular datasets without requiring artificial normalization."),
        ("2. Sharp Statutory Threshold Modeling:", "Statutory rules under the LARR Act 2013 involve non-linear step functions (e.g., Section 19 lapsing past 365 days, Section 10 multi-crop limits, 70%/80% consent hurdles). Tree-based recursive partitioning captures these hard legal thresholds with mathematical precision."),
        ("3. Exact & Fast TreeSHAP Integration:", "XGBoost allows exact polynomial-time computation of TreeSHAP values (via <code>pred_contribs=True</code>), enabling instantaneous feature attribution at serving speed without approximation variance."),
        ("4. Class Imbalance Resilience:", "Critical delay projects represent a specialized distribution. XGBoost's <code>scale_pos_weight</code> and focal loss parameters allow the model to heavily prioritize recall on High/Critical risk projects, ensuring zero silent catastrophic lapses.")
    ]

    for title, desc in xgb_points:
        story.append(Paragraph(f"<b>{title}</b> {desc}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))

    # -------------------------------------------------------------------------
    # SECTION 4: Why Supabase & PostgreSQL (pgvector + PostGIS)
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. Technical Justification: Why Supabase, pgvector & PostGIS?", h1_style))
    
    db_points = [
        ("1. pgvector (384-Dimension HNSW Indexing):", "Instead of managing disconnected vector databases (e.g. Pinecone/Chroma), Supabase provides in-database vector storage. By pairing 384D <code>SentenceTransformer</code> embeddings with Hierarchical Navigable Small World (HNSW) cosine indexing, legal similarity queries execute within milliseconds directly inside PostgreSQL."),
        ("2. PostGIS Native Spatial Geometry:", "Land acquisition is inherently geospatial. PostGIS allows storing polygon cadastre maps and point coordinates, enabling spatial boundary queries, regional choropleths, and distance-to-infrastructure calculations directly in SQL."),
        ("3. Relational Integrity & ACID Milestones:", "LARR Act compliance requires strict chronological foreign key relationships between Projects, Section 15 Hearing objections, Compensation disbursements, and Audit logs."),
        ("4. Scalable Transaction Pooling (Port 6543):", "Supabase's built-in PgBouncer transaction pooler prevents connection exhaustion during concurrent batch portfolio scoring and API traffic spikes.")
    ]

    for title, desc in db_points:
        story.append(Paragraph(f"<b>{title}</b> {desc}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("Document Generated for Smart India Hackathon Problem Statement SIH26017 · Department of Land Resources (DoLR)", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor("#94a3b8"), alignment=1)))

    doc.build(story)
    print(f"[SUCCESS] Successfully generated PDF documentation at: {filename}")

if __name__ == "__main__":
    build_pdf()
