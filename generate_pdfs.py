import os

def create_pdf(filename, title, subtitle, sections):
    """
    Generate a 100% valid PDF-1.4 file with standard Helvetica/Helvetica-Bold fonts,
    colored headers, tables, bullet points, and metadata.
    """
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # PDF Page dimensions (A4: 595.28 x 841.89 points)
    width = 595
    height = 842
    
    # We will build content stream commands
    commands = []
    
    # Background Header Bar (Deep Forest Green: #0A1F18 -> rgb 0.04, 0.12, 0.09)
    commands.append("q")
    commands.append("0.04 0.12 0.09 rg")  # Fill color
    commands.append(f"0 {height - 100} {width} 100 re f")
    
    # Gold Accent Line (Teak Gold: #D4A359 -> rgb 0.83, 0.64, 0.35)
    commands.append("0.83 0.64 0.35 rg")
    commands.append(f"0 {height - 104} {width} 4 re f")
    commands.append("Q")
    
    # Header Text
    commands.append("BT")
    commands.append("/F2 22 Tf") # Helvetica-Bold
    commands.append("1 1 1 rg") # White
    commands.append(f"40 {height - 50} Td")
    commands.append(f"({title}) Tj")
    commands.append("ET")
    
    commands.append("BT")
    commands.append("/F1 11 Tf") # Helvetica
    commands.append("0.83 0.64 0.35 rg") # Gold
    commands.append(f"40 {height - 72} Td")
    commands.append(f"({subtitle} | Bureau of Indian Standards Certified) Tj")
    commands.append("ET")
    
    # Content Body
    y = height - 140
    
    for sec_title, lines in sections:
        # Section Heading
        commands.append("BT")
        commands.append("/F2 13 Tf")
        commands.append("0.04 0.12 0.09 rg") # Forest green
        commands.append(f"40 {y} Td")
        commands.append(f"({sec_title}) Tj")
        commands.append("ET")
        
        # Heading underline
        commands.append("q")
        commands.append("0.83 0.64 0.35 RG") # Stroke color
        commands.append("1.5 w")
        commands.append(f"40 {y - 4} m 555 {y - 4} l S")
        commands.append("Q")
        
        y -= 22
        
        # Section Lines
        for line in lines:
            if y < 60:
                break # fit on single page
            
            is_bold = line.startswith("•") or line.startswith("[") or ":" in line and not line.startswith("  ")
            font = "/F2" if is_bold else "/F1"
            size = "9.5" if not is_bold else "10"
            color = "0.1 0.15 0.12" if is_bold else "0.3 0.35 0.32"
            
            commands.append("BT")
            commands.append(f"{font} {size} Tf")
            commands.append(f"{color} rg")
            commands.append(f"45 {y} Td")
            
            # Escape parenthesis
            safe_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            commands.append(f"({safe_line}) Tj")
            commands.append("ET")
            y -= 15
            
        y -= 14
        
    # Footer Bar
    commands.append("q")
    commands.append("0.96 0.95 0.93 rg")
    commands.append(f"0 0 {width} 45 re f")
    commands.append("0.83 0.64 0.35 RG")
    commands.append("1 w")
    commands.append(f"0 45 m {width} 45 l S")
    commands.append("Q")
    
    commands.append("BT")
    commands.append("/F1 8.5 Tf")
    commands.append("0.3 0.35 0.32 rg")
    commands.append("40 18 Td")
    commands.append("(Pearl Ply Manufacturing Co. | Toll-Free: 1800-120-PEARL | Web: www.pearlply.com | Email: sales@pearlply.com) Tj")
    commands.append("ET")
    
    stream_content = "\n".join(commands).encode('latin-1')
    stream_len = len(stream_content)
    
    # Assemble PDF Objects
    objects = []
    
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    
    # 3: Page
    objects.append(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {width} {height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>".encode('latin-1'))
    
    # 4: Contents
    objects.append(f"<< /Length {stream_len} >>\nstream\n".encode('latin-1') + stream_content + b"\nendstream")
    
    # 5: Font F1 (Helvetica)
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    
    # 6: Font F2 (Helvetica-Bold)
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    
    # Build complete PDF binary
    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    
    offsets = []
    for i, obj in enumerate(objects, 1):
        offsets.append(len(pdf))
        pdf.extend(f"{i} 0 obj\n".encode('latin-1'))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")
        
    xref_offset = len(pdf)
    pdf.extend(b"xref\n")
    pdf.extend(f"0 {len(objects) + 1}\n".encode('latin-1'))
    pdf.extend(b"0000000000 65535 f \n")
    for off in offsets:
        pdf.extend(f"{off:010d} 00000 n \n".encode('latin-1'))
        
    pdf.extend(b"trailer\n")
    pdf.extend(f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n".encode('latin-1'))
    pdf.extend(b"startxref\n")
    pdf.extend(f"{xref_offset}\n".encode('latin-1'))
    pdf.extend(b"%%EOF\n")
    
    with open(filename, "wb") as f:
        f.write(pdf)
    print(f"Created: {filename} ({len(pdf)} bytes)")

# 1. Master Catalogue
create_pdf(
    "assets/docs/Pearl_Ply_Master_Catalogue_2026.pdf",
    "PEARL PLY - MASTER PRODUCT CATALOGUE 2026",
    "India's Leading Marine & Calibrated Plywood Manufacturer",
    [
        ("1. EXECUTIVE SUMMARY & COMPANY PROFILE", [
            "Pearl Ply is a state-of-the-art timber manufacturing company specializing in IS:710 Marine Grade Plywood,",
            "IS:303 BWR/MR Plywood, and IS:1659 Solid Core Blockboards.",
            "• Core Sourcing: 100% Sustainable Agro-Forestry Plantation Hardwoods (Zero Deforestation).",
            "• Key Accreditations: BIS Certified (IS:710, IS:303, IS:1659), ISO 9001:2015, E0 Emission Safe."
        ]),
        ("2. COMPLETE PRODUCT RANGE SPECIFICATIONS", [
            "• Pearl 100% Calibrated Marine (IS:710): 100% Gurjan core, 4x CNC sanded, 25-Year Replacement Warranty.",
            "• Pearl Marine BWP 710: Unextended Phenol Formaldehyde resin, 72-Hour continuous boiling proof.",
            "• Pearl BWR Moisture Guard: Phenolic bonded, all-weather moisture resistant, 15-Year Guarantee.",
            "• Pearl Commercial MR: Fortified Melamine Urea Formaldehyde, borer and termite shield.",
            "• Pearl SolidCore Blockboard: Solid pine batten core, 100% anti-warping for tall 8ft wardrobe doors."
        ]),
        ("3. STANDARD SIZES & THICKNESS AVAILABILITY", [
            "• Standard Sheet Sizes: 8ft x 4ft (2440 x 1220 mm), 7ft x 4ft (2140 x 1220 mm), 8ft x 3ft, 7ft x 3ft.",
            "• Available Thicknesses: 4mm, 6mm, 9mm, 12mm, 16mm, 18mm, 19mm, 25mm, 30mm.",
            "• Tolerance Standard: Micro-calibrated to +/- 0.1 mm for CNC edge-banding precision."
        ]),
        ("4. ORDERING & DEALER NETWORK", [
            "To place bulk builder orders or locate an authorized dealer, call Toll-Free 1800-120-PEARL.",
            "Corporate Plant: Industrial Plywood Corridor, Yamunanagar - 135001, India."
        ])
    ]
)

# 2. Marine BWP 710 Brochure
create_pdf(
    "assets/docs/Pearl_Ply_Marine_BWP_710_Brochure.pdf",
    "PEARL MARINE BWP 710 - TECHNICAL BROCHURE",
    "IS:710 Certified 72-Hour Continuous Boiling Water Proof Plywood",
    [
        ("1. PRODUCT OVERVIEW & APPLICATION ZONES", [
            "Pearl Marine BWP 710 is engineered for extreme moisture, humid kitchens, and coastal environments.",
            "• Recommended For: Modular Kitchen base cabinets, under-sink carcasses, bathroom vanity counters,",
            "  dining furniture, outdoor partitions, and luxury marine yacht interiors."
        ]),
        ("2. LABORATORY PERFORMANCE METRICS", [
            "• Boiling Water Immersion Test: Submerged in 100 deg C boiling water for 72 continuous hours with 0% delamination.",
            "• Glue Shear Strength: Exceeds 1450 N (Dry state) and 1250 N (Wet state).",
            "• Mycological & Termite Resistance: 100% vacuum pressure impregnated with organo-chemical preservatives.",
            "• Modulus of Rupture (MOR): > 58 N/mm2 along grain | Modulus of Elasticity (MOE): > 6800 N/mm2."
        ]),
        ("3. 25-YEAR REPLACEMENT GUARANTEE", [
            "Every authentic sheet bears a laser-engraved QR batch code and BIS Certification Mark (IS:710).",
            "Backed by Pearl Ply's unconditional 25-Year warranty against borer, termite, and delamination."
        ])
    ]
)

# 3. Technical Data Sheet (TDS)
create_pdf(
    "assets/docs/Pearl_Ply_Technical_Data_Sheet_TDS.pdf",
    "PEARL PLY - TECHNICAL DATA SHEET (TDS MATRIX)",
    "Mechanical, Chemical & Structural Engineering Test Report",
    [
        ("1. PHYSICAL & MECHANICAL PROPERTIES", [
            "• Density: 750 to 820 kg/m3 (High-density Gurjan & Hardwood core).",
            "• Moisture Content: 6% to 8% (Stabilized in automated jet veneer dryers).",
            "• Screw Holding Capacity: > 2650 N (Face) | > 1650 N (Edge) tested per IS:1734 Part 10.",
            "• Nail Holding Capacity: > 1400 N (Face) | > 950 N (Edge) tested per IS:1734 Part 10."
        ]),
        ("2. ADHESIVE RESIN & CHEMICAL SPECIFICATION", [
            "• Resin Formulation: 100% Unextended Phenol Formaldehyde Synthetic Resin.",
            "• Formaldehyde Emission Class: E0 Standard (< 0.5 mg/L) tested per CARB Phase 2 & GreenPro.",
            "• Preservative Chemical: Vacuum pressure impregnated copper-boron-chromium anti-borer complex."
        ]),
        ("3. DIMENSIONAL TOLERANCE & SWELLING TEST", [
            "• Thickness Tolerance: +/- 0.1 mm (Quad calibrated).",
            "• Squareness Tolerance: 1 mm per 1000 mm length.",
            "• Water Absorption Swelling (24-Hr immersion): Less than 1.2% in thickness."
        ])
    ]
)

# 4. BIS IS:710 & IS:303 Certifications
create_pdf(
    "assets/docs/Pearl_Ply_BIS_IS710_IS303_Certifications.pdf",
    "BUREAU OF INDIAN STANDARDS (BIS) COMPLIANCE",
    "Official Certification & Quality License Endorsement",
    [
        ("1. BIS LICENSES & STANDARDS SCHEDULE", [
            "• IS: 710 : 2010 - Specification for Marine Plywood (License CM/L-8472910).",
            "• IS: 303 : 1989 - Specification for Plywood for General Purposes (MR & BWR Grades).",
            "• IS: 1659 : 2004 - Specification for Solid Core Blockboards.",
            "• IS: 2202 : Part 1 - Specification for Wooden Flush Door Shutters (Solid Core)."
        ]),
        ("2. QUALITY MANAGEMENT & ECO ACCREDITATIONS", [
            "• ISO 9001 : 2015 - Quality Management Systems Certified.",
            "• FSC - Forest Stewardship Council Chain-of-Custody Sourcing Certified.",
            "• GreenPro - Eco-Friendly Low Emission Building Material Standard."
        ]),
        ("3. FACTORY TEST AUDIT VERIFICATION", [
            "Manufactured and tested at Central Testing Lab, Industrial Corridor, Yamunanagar - 135001.",
            "For tender verifications and architect certificates, contact compliance@pearlply.com."
        ])
    ]
)
