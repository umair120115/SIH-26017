import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def build_pdf(filename="LARR_Model_Features_And_Legal_Statutory_Guide.pdf"):
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
    c_border = colors.HexColor("#cbd5e1")  # Slate 300
    
    title_style = ParagraphStyle(
        'GuideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary
    )
    
    subtitle_style = ParagraphStyle(
        'GuideSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_accent
    )
    
    h1_style = ParagraphStyle(
        'GuideH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4
    )
    
    h2_style = ParagraphStyle(
        'GuideH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_accent,
        spaceBefore=6,
        spaceAfter=2
    )
    
    body_style = ParagraphStyle(
        'GuideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#334155")
    )
    
    body_bold = ParagraphStyle(
        'GuideBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("Smart India Hackathon 2026 · Problem Statement SIH26017", subtitle_style))
    story.append(Paragraph("ML Model Features & Statutory LARR Act 2013 Legal Guide", title_style))
    story.append(Paragraph("Department of Land Resources (DoLR) · Ministry of Rural Development · Government of India", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceBefore=4, spaceAfter=8))

    # -------------------------------------------------------------------------
    # PART 1: The 14 Machine Learning Model Features
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. Exhaustive Breakdown of the 14 ML Model Features", h1_style))
    story.append(Paragraph("The XGBoost model processes 14 engineered features representing physical, statutory, financial, and administrative friction points:", body_style))
    story.append(Spacer(1, 4))

    features_table_data = [
        [
            Paragraph("<b>#</b>", body_bold),
            Paragraph("<b>Feature Name</b>", body_bold),
            Paragraph("<b>Type & Units</b>", body_bold),
            Paragraph("<b>Statutory & Operational Meaning</b>", body_bold),
            Paragraph("<b>Why Used & Impact on Delay Prediction</b>", body_bold)
        ],
        [
            Paragraph("1", body_style),
            Paragraph("<b>total_acreage_ha</b>", body_style),
            Paragraph("Float (ha)", body_style),
            Paragraph("Total physical footprint required for corridor.", body_style),
            Paragraph("Larger footprints span multiple taluks, increasing joint measurement survey complexity.", body_style)
        ],
        [
            Paragraph("2", body_style),
            Paragraph("<b>num_land_parcels</b>", body_style),
            Paragraph("Integer", body_style),
            Paragraph("Cadastral fragmentation (khasra/survey plots).", body_style),
            Paragraph("High fragmentation multiplies title verification latency and citizen objections.", body_style)
        ],
        [
            Paragraph("3", body_style),
            Paragraph("<b>private_to_govt_ratio</b>", body_style),
            Paragraph("Float (Ratio)", body_style),
            Paragraph("Ratio of private titled land to government land.", body_style),
            Paragraph("Govt land transfers quickly; private land requires formal notice, SIA, and consent.", body_style)
        ],
        [
            Paragraph("4", body_style),
            Paragraph("<b>sc_st_land_percentage</b>", body_style),
            Paragraph("Float (%)", body_style),
            Paragraph("Tribal protective safeguards (Sec 41/42).", body_style),
            Paragraph("Requires special Tribal Development Plan, 1/3 upfront compensation, and Gram Sabha consent.", body_style)
        ],
        [
            Paragraph("5", body_style),
            Paragraph("<b>multi_crop_irrigated_percentage</b>", body_style),
            Paragraph("Float (%)", body_style),
            Paragraph("Food security ceiling on farmland (Sec 10).", body_style),
            Paragraph("Statutory limits on multi-crop land; triggers High Court stay orders if ceilings are breached.", body_style)
        ],
        [
            Paragraph("6", body_style),
            Paragraph("<b>required_consent_percentage</b>", body_style),
            Paragraph("Integer (%)", body_style),
            Paragraph("Prior consent hurdle (0%, 70%, 80%).", body_style),
            Paragraph("Mandatory 70% for PPP or 80% for Private; failure to achieve threshold halts project.", body_style)
        ],
        [
            Paragraph("7", body_style),
            Paragraph("<b>non_owner_to_owner_paf_ratio</b>", body_style),
            Paragraph("Float (Ratio)", body_style),
            Paragraph("Livelihood claim density (Sec 3(c)).", body_style),
            Paragraph("Non-owners (tenants, labourers) are entitled to R&R; high density sparks census disputes.", body_style)
        ],
        [
            Paragraph("8", body_style),
            Paragraph("<b>circle_rate_disparity_ratio</b>", body_style),
            Paragraph("Float (Ratio)", body_style),
            Paragraph("Market value vs Circle rate ratio.", body_style),
            Paragraph("<b>Single largest delay driver</b>; if disparity >1.5x, landowners reject award and seek court stay.", body_style)
        ],
        [
            Paragraph("9", body_style),
            Paragraph("<b>rr_cost_share_percentage</b>", body_style),
            Paragraph("Float (%)", body_style),
            Paragraph("R&R budget share of total project cost.", body_style),
            Paragraph("Higher R&R overheads require multi-agency coordination (housing boards, DoLR).", body_style)
        ],
        [
            Paragraph("10", body_style),
            Paragraph("<b>rural_multiplier_factor</b>", body_style),
            Paragraph("Float (1.0 - 2.0)", body_style),
            Paragraph("Rural market value multiplier (Sec 26(2)).", body_style),
            Paragraph("Ambiguity in state distance notifications triggers litigation over calculated base compensation.", body_style)
        ],
        [
            Paragraph("11", body_style),
            Paragraph("<b>district_litigation_rate</b>", body_style),
            Paragraph("Float (%)", body_style),
            Paragraph("District historical land stay rate (5-yr).", body_style),
            Paragraph("Captures localized litigiousness, presence of active farmer unions, and local stay precedents.", body_style)
        ],
        [
            Paragraph("12", body_style),
            Paragraph("<b>revenue_staff_vacancy_rate</b>", body_style),
            Paragraph("Float (%)", body_style),
            Paragraph("Survey/revenue staff vacancy rate.", body_style),
            Paragraph("Directly bottlenecks Section 12 field demarcation and Section 15 objection disposal.", body_style)
        ],
        [
            Paragraph("13", body_style),
            Paragraph("<b>avg_s15_resolution_days</b>", body_style),
            Paragraph("Float (days)", body_style),
            Paragraph("Section 15 objection hearing latency.", body_style),
            Paragraph("Slow disposal directly eats into the strict 12-month statutory window before Sec 19.", body_style)
        ],
        [
            Paragraph("14", body_style),
            Paragraph("<b>days_since_s11</b>", body_style),
            Paragraph("Integer (days)", body_style),
            Paragraph("Days elapsed since Section 11 preliminary notice.", body_style),
            Paragraph("<b>Statutory 12-Month Clock</b>: If days > 365 without Sec 19 declaration, acquisition lapses by law.", body_style)
        ]
    ]

    ft_table = Table(features_table_data, colWidths=[15, 125, 65, 145, 190])
    ft_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(ft_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # PART 2: Statutory Legal Laws & Mandatory Compliance Framework
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. LARR Act 2013 Statutory Legal Framework & Key Mandates", h1_style))
    story.append(Paragraph("The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 governs all acquisitions in India. Below are the mandatory statutory checkpoints:", body_style))
    story.append(Spacer(1, 4))

    legal_sections_data = [
        [
            Paragraph("<b>Section / Provision</b>", body_bold),
            Paragraph("<b>Statutory Rule & Threshold</b>", body_bold),
            Paragraph("<b>Mandatory Compliance & Consequences of Violation</b>", body_bold)
        ],
        [
            Paragraph("<b>Section 4 & 7<br/>(SIA Study)</b>", body_style),
            Paragraph("Mandatory Social Impact Assessment in consultation with Gram Sabha.", body_style),
            Paragraph("Independent Multi-Disciplinary Expert Group must approve SIA within 6 months. Non-compliance voids Section 11 notice.", body_style)
        ],
        [
            Paragraph("<b>Section 10<br/>(Food Security)</b>", body_style),
            Paragraph("Multi-crop irrigated land acquisition permitted only as demonstrable last resort.", body_style),
            Paragraph("Must not exceed cumulative district ceiling. Failure to prove lack of alternative barren land triggers High Court stays.", body_style)
        ],
        [
            Paragraph("<b>Section 11<br/>(Preliminary Notice)</b>", body_style),
            Paragraph("Official Gazette publication declaring intent to acquire.", body_style),
            Paragraph("Freezes all land transactions/sales. <b>Starts the strict 12-month statutory clock for Section 19(2).</b>", body_style)
        ],
        [
            Paragraph("<b>Section 15<br/>(Hearing Objections)</b>", body_style),
            Paragraph("60-day window for citizens to file written objections.", body_style),
            Paragraph("Collector must give personal hearing to objectors. Denial of natural justice leads to writ petitions under Article 226.", body_style)
        ],
        [
            Paragraph("<b>Section 19(2)<br/>(12-Month Lapsing)</b>", body_style),
            Paragraph("<b>MANDATORY RULE:</b> Final declaration must be published within 12 months (365 days) of Section 11 notice.", body_style),
            Paragraph("<b>AUTOMATIC LAPSE:</b> If 365 days elapse without Section 19 publication, preliminary notification lapses and acquisition dies.", body_style)
        ],
        [
            Paragraph("<b>Section 26 & Proviso 4<br/>(Market Value)</b>", body_style),
            Paragraph("Base market value determined via highest 50% sale deeds or circle rate.", body_style),
            Paragraph("Proviso 4 empowers Collector to convene direct negotiation committees when circle rates are visibly outdated.", body_style)
        ],
        [
            Paragraph("<b>Section 30<br/>(100% Solatium)</b>", body_style),
            Paragraph("Mandatory 100% Solatium added over total calculated compensation.", body_style),
            Paragraph("Non-negotiable statutory multiplier (Total Award = Base &times; Multiplier + 100% Solatium).", body_style)
        ],
        [
            Paragraph("<b>Section 38<br/>(Possession)</b>", body_style),
            Paragraph("Physical possession prohibited until full compensation and R&R are disbursed.", body_style),
            Paragraph("Attempting possession before monetary disbursement is illegal and attracts contempt of court.", body_style)
        ],
        [
            Paragraph("<b>Sections 41 & 42<br/>(SC/ST Tribal Land)</b>", body_style),
            Paragraph("Prohibits acquisition in Scheduled (Fifth Schedule) areas as far as possible.", body_style),
            Paragraph("Requires Gram Sabha prior consent, 1/3 upfront compensation, and dedicated Tribal Development Plan.", body_style)
        ],
        [
            Paragraph("<b>Section 64<br/>(Court References)</b>", body_style),
            Paragraph("Aggrieved owners can seek reference to LARR Authority (District Judge).", body_style),
            Paragraph("Does not stay work unless an injunction is granted; causes massive delayed compensation enhancement liabilities.", body_style)
        ]
    ]

    ls_table = Table(legal_sections_data, colWidths=[100, 190, 250])
    ls_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#fef3c7")),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(ls_table)
    story.append(Spacer(1, 10))

    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=4, spaceAfter=6))
    story.append(Paragraph("Smart India Hackathon 2026 · SIH26017 · Department of Land Resources (DoLR) Legal Reference", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor("#94a3b8"), alignment=1)))

    doc.build(story)
    print(f"[SUCCESS] Successfully generated legal & feature guide PDF at: {filename}")

if __name__ == "__main__":
    build_pdf()
