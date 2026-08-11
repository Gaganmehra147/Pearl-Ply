import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def build_pdf(filename, title, subtitle, sections):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0A1F18'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#B8860B'),
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0A1F18'),
        spaceBefore=14,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#2A3631'),
        spaceAfter=4
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor('#1F2923'),
        leftIndent=15,
        spaceAfter=3
    )
    
    footer_style = ParagraphStyle(
        'DocFooter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#596B63'),
        alignment=1
    )
    
    elements = []
    
    # Header Banner Table
    header_data = [
        [
            Paragraph("<b>PEARL PLY</b>", ParagraphStyle('Logo', fontName='Helvetica-Bold', fontSize=18, textColor=colors.white)),
            Paragraph("<b>OFFICIAL TECHNICAL DOCUMENTATION</b><br/>Bureau of Indian Standards IS:710 & IS:303", ParagraphStyle('Sub', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#E6C280'), alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[200, 330])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0A1F18')),
        ('PADDING', (0, 0), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 15))
    
    # Document Title & Subtitle
    elements.append(Paragraph(title, title_style))
    elements.append(Paragraph(subtitle, subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#D4A359'), spaceAfter=14))
    
    # Add Sections
    for sec_title, bullets in sections:
        elements.append(Paragraph(sec_title, h2_style))
        for bullet in bullets:
            if bullet.startswith("•"):
                elements.append(Paragraph(f"&bull; {bullet[1:].strip()}", bullet_style))
            else:
                elements.append(Paragraph(bullet, body_style))
        elements.append(Spacer(1, 6))
        
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2EAE6'), spaceAfter=10))
    elements.append(Paragraph("Pearl Ply Manufacturing Co. | Industrial Plywood Corridor, Yamunanagar - 135001 | Toll-Free: 1800-120-PEARL | www.pearlply.com", footer_style))
    
    doc.build(elements)
    print(f"Generated PDF: {filename} ({os.path.getsize(filename)} bytes)")

# 1. Master Catalogue
build_pdf(
    "assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf",
    "Pearl Ply Master Product Catalogue 2026",
    "Comprehensive Architectural Plywood, Marine Grade & Blockboard Portfolio",
    [
        ("1. EXECUTIVE SUMMARY & COMPANY PROFILE", [
            "Pearl Ply is India's premier manufacturer of high-precision timber products, marine-grade calibrated plywood, and solid core blockboards.",
            "• Sourcing: 100% sustainable agro-forestry plantation timber (Zero Deforestation Commitment).",
            "• Manufacturing Capacity: 250,000 sq.ft. automated plant with European 4-head calibrating sanders.",
            "• Certifications: Bureau of Indian Standards (IS:710, IS:303, IS:1659, IS:2202), ISO 9001:2015, E0 Emission Certified."
        ]),
        ("2. PRODUCT LINEUP & TECHNICAL SPECIFICATIONS", [
            "• Pearl 100% Calibrated Marine (IS:710): 100% Selected Gurjan core, 4x CNC diamond sanding, 25-Year Replacement Warranty.",
            "• Pearl Marine BWP 710: Unextended Phenol Formaldehyde resin matrix, 72-Hour boiling water immersion proof.",
            "• Pearl BWR Moisture Guard (IS:303): Phenolic bonded, borer/termite shield, 15-Year Guarantee.",
            "• Pearl Commercial MR: Fortified Melamine Urea Formaldehyde for dry indoor living & bedroom furniture.",
            "• Pearl SolidCore Blockboard (IS:1659): Seasoned solid pine core battens, 100% anti-warping for tall 8ft wardrobe shutters."
        ]),
        ("3. STANDARD DIMENSIONS & THICKNESS MATRIX", [
            "• Standard Sizes: 8ft x 4ft (2440 x 1220 mm), 7ft x 4ft (2140 x 1220 mm), 8ft x 3ft, 7ft x 3ft.",
            "• Available Thicknesses: 4mm, 6mm, 9mm, 12mm, 16mm, 18mm, 19mm, 25mm, 30mm.",
            "• Calibration Tolerance: Strict +/- 0.1 mm thickness uniformity across the entire panel."
        ]),
        ("4. BULK ORDERS & DEALER NETWORK", [
            "For factory direct dispatch or to connect with an authorized dealer near you, call Toll-Free 1800-120-PEARL or email inquiry@pearlply.com."
        ])
    ]
)

# 2. Marine BWP 710 Brochure
build_pdf(
    "assets/docs/Pearl_Ply_Marine_BWP_710_Brochure.pdf",
    "Pearl Marine BWP 710 Series Brochure",
    "IS:710 Certified 72-Hour Boiling Water Proof Marine Plywood",
    [
        ("1. PRODUCT OVERVIEW & APPLICATION ZONES", [
            "Pearl Marine BWP 710 is engineered for high-moisture interior cabinetry and coastal architectural installations.",
            "• Ideal Applications: Modular Kitchen base cabinets, under-sink carcass boxes, bathroom vanity counters, dining tables, and yacht interiors."
        ]),
        ("2. LABORATORY PERFORMANCE & BIS STANDARDS", [
            "• 72-Hour Boiling Water Immersion Test: Submerged in 100°C boiling water for 72 continuous hours with zero delamination and zero edge swelling.",
            "• Glue Shear Strength: Exceeds 1450 N (Dry state) and 1250 N (Wet state) per IS:1734 Part 4.",
            "• Mycological & Termite Defense: 100% vacuum pressure impregnated with organo-chemical preservatives (IS:5539).",
            "• Modulus of Rupture (MOR): > 58 N/mm² along grain | Modulus of Elasticity (MOE): > 6800 N/mm²."
        ]),
        ("3. 25-YEAR REPLACEMENT GUARANTEE", [
            "Every authentic sheet bears a laser-engraved QR code and BIS License CM/L-8472910.",
            "Backed by Pearl Ply's 25-Year Peace of Mind warranty against borers, termites, and manufacturing defects."
        ])
    ]
)

# 3. Technical Data Sheet (TDS)
build_pdf(
    "assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf",
    "Pearl Ply Technical Data Sheet (TDS Matrix)",
    "Mechanical, Chemical & Structural Engineering Test Report",
    [
        ("1. PHYSICAL & MECHANICAL PROPERTIES", [
            "• Density: 750 to 820 kg/m³ (High-density Gurjan & Hardwood core).",
            "• Moisture Content: 6% to 8% (Stabilized in computerized jet veneer dryers).",
            "• Screw Holding Capacity: > 2650 N (Face) | > 1650 N (Edge) tested per IS:1734 Part 10.",
            "• Nail Holding Capacity: > 1400 N (Face) | > 950 N (Edge) tested per IS:1734 Part 10."
        ]),
        ("2. ADHESIVE RESIN & CHEMICAL COMPOSITION", [
            "• Resin Type: 100% Unextended Phenol Formaldehyde Synthetic Resin.",
            "• Formaldehyde Emission: E0 Certified (< 0.5 mg/L) tested per CARB Phase 2 & GreenPro standards.",
            "• Preservative Treatment: Vacuum pressure impregnated copper-boron anti-termite shield."
        ]),
        ("3. DIMENSIONAL ACCURACY & MOISTURE RESISTANCE", [
            "• Thickness Tolerance: +/- 0.1 mm (Quad Calibrated).",
            "• Squareness Tolerance: 1 mm per 1000 mm length.",
            "• 24-Hour Water Absorption Swelling: Less than 1.2% in thickness."
        ])
    ]
)

# 4. BIS IS:710 & IS:303 Certifications
build_pdf(
    "assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf",
    "Bureau of Indian Standards (BIS) Endorsement Copy",
    "Official Quality License & Compliance Schedule",
    [
        ("1. BUREAU OF INDIAN STANDARDS (BIS) SCHEDULE", [
            "• IS: 710 : 2010 - Specification for Marine Plywood (License CM/L-8472910).",
            "• IS: 303 : 1989 - Specification for Plywood for General Purposes (MR & BWR Grades).",
            "• IS: 1659 : 2004 - Specification for Solid Core Blockboards.",
            "• IS: 2202 : Part 1 - Specification for Wooden Flush Door Shutters."
        ]),
        ("2. ENVIRONMENTAL & MANAGEMENT CERTIFICATIONS", [
            "• ISO 9001 : 2015 - Quality Management Systems Certified.",
            "• FSC Certified - Sustainable Forest Stewardship Council Chain-of-Custody.",
            "• GreenPro - Indian Green Building Council (IGBC) Certified Material."
        ]),
        ("3. FACTORY TEST LAB AUDIT", [
            "Audited and tested at Central Quality Control Lab, Industrial Plywood Corridor, Yamunanagar - 135001.",
            "For government tenders and architect submittals, email compliance@pearlply.com."
        ])
    ]
)
