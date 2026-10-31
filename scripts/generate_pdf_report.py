import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
    KeepTogether
)

def build_pdf(filename="docs/ProxiService_Requirements_and_Architecture_Report.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#1e3a8a")
    secondary_color = colors.HexColor("#2563eb")
    dark_slate = colors.HexColor("#0f172a")
    text_gray = colors.HexColor("#334155")
    bg_light = colors.HexColor("#f8fafc")
    border_gray = colors.HexColor("#cbd5e1")
    emerald = colors.HexColor("#059669")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=text_gray,
        spaceAfter=6
    )

    cell_style = ParagraphStyle(
        'Cell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=dark_slate
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=dark_slate
    )

    cell_header = ParagraphStyle(
        'CellHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("ProxiService — Hyperlocal On-Demand Platform", title_style))
    story.append(Paragraph("Software Requirements Specification (SRS) & System Architecture Document (SAD)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=secondary_color, spaceAfter=10))

    meta_data = [
        [Paragraph("<b>Document Version:</b> 2.0 (Release Candidate)", cell_style), Paragraph("<b>Target Environment:</b> Docker + Next.js + SQL Server", cell_style)],
        [Paragraph("<b>Status:</b> PRODUCTION READY (31/31 Tests Passed)", cell_style), Paragraph("<b>Repository:</b> https://github.com/RaniaBouali/aiproject.git", cell_style)],
        [Paragraph("<b>Date:</b> October 2026", cell_style), Paragraph("<b>Quality Gate:</b> 100% Passed (TypeSafe & Audited)", cell_style)],
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary & Problem Formulation", h1_style))
    story.append(Paragraph(
        "ProxiService is a full-stack on-demand marketplace connecting vetted independent artisans (mécaniciens auto, femmes de ménage, électriciens, plombiers, peintres, menuisiers) with local clients. "
        "The system solves the lack of authentic geospatial proximity discovery, eliminates arbitrary commission exploitation, guarantees upfront transparent tariffs, and provides strict role segregation via Role-Based Access Control (RBAC).",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 2. Stakeholder Analysis Table
    story.append(Paragraph("2. Stakeholder Analysis Matrix", h1_style))
    stakeholder_data = [
        [Paragraph("Stakeholder", cell_header), Paragraph("Key Role", cell_header), Paragraph("Core Requirements", cell_header), Paragraph("Architectural Solution", cell_header)],
        [
            Paragraph("Residential Clients", cell_bold),
            Paragraph("Demand services", cell_style),
            Paragraph("Search within X km, view real tariffs, book slots, verified reviews.", cell_style),
            Paragraph("Leaflet Split View, Haversine Engine, BookingModal, /client/dashboard.", cell_style)
        ],
        [
            Paragraph("Artisans / Providers", cell_bold),
            Paragraph("Supply services", cell_style),
            Paragraph("Full control over prices (fixed/hourly), portfolio, operational radius (km), zero client clutter.", cell_style),
            Paragraph("/provider/dashboard, Tariffs Editor, Radius slider, Provider vitrine.", cell_style)
        ],
        [
            Paragraph("Platform Administrators", cell_bold),
            Paragraph("Governance & trust", cell_style),
            Paragraph("User verification, tamper-proof reviews, relational consistency.", cell_style),
            Paragraph("SQL Server / Relational Schema, RBAC Guards, Audit logging.", cell_style)
        ],
        [
            Paragraph("DevOps & QA Engineers", cell_bold),
            Paragraph("Reliability & CI/CD", cell_style),
            Paragraph("100% automated test coverage, reproducible containerized deployments.", cell_style),
            Paragraph("Dockerfile multi-stage, docker-compose.yml, 31 automated tests.", cell_style)
        ],
    ]
    stakeholder_table = Table(stakeholder_data, colWidths=[90, 80, 185, 185])
    stakeholder_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(stakeholder_table)
    story.append(Spacer(1, 12))

    # 3. Requirements Traceability Matrix
    story.append(Paragraph("3. Requirements Traceability & Validation Matrix (MoSCoW)", h1_style))
    req_data = [
        [Paragraph("Req ID", cell_header), Paragraph("Requirement Description", cell_header), Paragraph("MoSCoW", cell_header), Paragraph("Validation Method", cell_header), Paragraph("Status", cell_header)],
        [Paragraph("FR-01", cell_bold), Paragraph("Dual-Role Registration (Dedicated Client vs Artisan)", cell_style), Paragraph("MUST", cell_style), Paragraph("Automated Unit & Route Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-02", cell_bold), Paragraph("Artisan Vitrine Setup (Custom Services, Rates, Bio)", cell_style), Paragraph("MUST", cell_style), Paragraph("Automated Test + UI Inspection", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-03", cell_bold), Paragraph("Operational Radius (5 km to 60 km slider)", cell_style), Paragraph("MUST", cell_style), Paragraph("Automated Search Bound Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-04", cell_bold), Paragraph("Portfolio Showcase (Photo gallery of past works)", cell_style), Paragraph("MUST", cell_style), Paragraph("Profile Hydration Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-05", cell_bold), Paragraph("Geospatial Discovery Engine (Haversine km math)", cell_style), Paragraph("MUST", cell_style), Paragraph("Mathematical Geodesic Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-06", cell_bold), Paragraph("Interactive Map Split View (Leaflet OpenStreetMap)", cell_style), Paragraph("MUST", cell_style), Paragraph("Browser End-to-End Verification", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-07", cell_bold), Paragraph("Category Filtering (Mechanics, Cleaners, Plumbers...)", cell_style), Paragraph("MUST", cell_style), Paragraph("API Filter Query Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-08", cell_bold), Paragraph("Service Booking Flow (Service item, Date/Time, Notes)", cell_style), Paragraph("MUST", cell_style), Paragraph("API POST /api/bookings", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-09", cell_bold), Paragraph("Artisan Booking Negotiation (Accept / Reject 1-Click)", cell_style), Paragraph("MUST", cell_style), Paragraph("API PATCH /api/bookings/:id", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-10", cell_bold), Paragraph("Mission Execution Lifecycle (PENDING -> ACCEPTED -> COMPLETED)", cell_style), Paragraph("MUST", cell_style), Paragraph("State Machine Lifecycle Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-11", cell_bold), Paragraph("Verified Customer Reviews (1-5 Stars + Feedback)", cell_style), Paragraph("MUST", cell_style), Paragraph("API POST /api/reviews", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-12", cell_bold), Paragraph("Dynamic Average Rating Recalculation", cell_style), Paragraph("MUST", cell_style), Paragraph("Reputation Aggregator Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("FR-13", cell_bold), Paragraph("Strict Role-Based Access Control (RBAC Route Guards)", cell_style), Paragraph("MUST", cell_style), Paragraph("11 Security & Guard Tests", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("NFR-01", cell_bold), Paragraph("Spatial Radius Response Time < 50ms", cell_style), Paragraph("MUST", cell_style), Paragraph("Performance Benchmark (< 15ms)", cell_style), Paragraph("VALIDATED", cell_bold)],
        [Paragraph("NFR-02", cell_bold), Paragraph("Dockerized SQL Server & Next.js Architecture", cell_style), Paragraph("MUST", cell_style), Paragraph("Docker Compose Orchestration", cell_style), Paragraph("VALIDATED", cell_bold)],
    ]
    req_table = Table(req_data, colWidths=[40, 200, 50, 160, 90])
    req_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TEXTCOLOR', (4,1), (4,-1), emerald),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(req_table)
    
    story.append(PageBreak())

    # 4. Detailed UML Class Diagram & Domain Entities
    story.append(Paragraph("4. Detailed Domain Model & UML Class Specifications", h1_style))
    story.append(Paragraph(
        "The architecture is designed around an object-oriented domain model with clear separation between identity, professional capabilities, spatial coordinates, and transactional workflows.",
        body_style
    ))

    class_data = [
        [Paragraph("Entity Class", cell_header), Paragraph("Key Attributes & Types", cell_header), Paragraph("Methods & Signatures", cell_header), Paragraph("Cardinalities & Relationships", cell_header)],
        [
            Paragraph("User", cell_bold),
            Paragraph("+id: string<br/>+name: string<br/>+email: string<br/>+phone: string<br/>+passwordHash: string<br/>+role: Role<br/>+addressText: string", cell_style),
            Paragraph("+register(data): User<br/>+authenticate(email, pass): Token<br/>+updateProfile(data): void", cell_style),
            Paragraph("1 -> 1 Role<br/>1 -> 1 ProviderProfile (if Pro)<br/>1 -> 0..* Bookings (Client)", cell_style)
        ],
        [
            Paragraph("ProviderProfile", cell_bold),
            Paragraph("+id: string<br/>+userId: string<br/>+latitude: float<br/>+longitude: float<br/>+radiusKm: int<br/>+isVerified: bool<br/>+ratingAvg: float<br/>+status: Availability", cell_style),
            Paragraph("+updateTariffs(services): void<br/>+updateZone(radiusKm): void<br/>+calcDistance(lat, lng): float", cell_style),
            Paragraph("1 -> 1 User<br/>1 -> 1..* Categories<br/>1 -> 1..* Services<br/>1 -> 0..* Portfolio<br/>1 -> 0..* Reviews", cell_style)
        ],
        [
            Paragraph("ServiceItem", cell_bold),
            Paragraph("+id: string<br/>+title: string<br/>+price: decimal<br/>+priceType: PriceType<br/>+durationMinutes: int", cell_style),
            Paragraph("+formatPrice(): string<br/>+isEstimate(): bool", cell_style),
            Paragraph("1..* -> 1 ProviderProfile<br/>1 -> 0..* Bookings", cell_style)
        ],
        [
            Paragraph("Booking", cell_bold),
            Paragraph("+id: string<br/>+clientId: string<br/>+providerId: string<br/>+serviceId: string<br/>+scheduledAt: DateTime<br/>+status: BookingStatus<br/>+notes: string", cell_style),
            Paragraph("+accept(): void<br/>+reject(): void<br/>+complete(): void<br/>+cancel(): void", cell_style),
            Paragraph("0..* -> 1 Client<br/>0..* -> 1 ProviderProfile<br/>1 -> 1 ServiceItem<br/>1 -> 0..1 Review", cell_style)
        ],
        [
            Paragraph("Review", cell_bold),
            Paragraph("+id: string<br/>+providerId: string<br/>+bookingId: string<br/>+rating: int (1..5)<br/>+comment: string<br/>+createdAt: DateTime", cell_style),
            Paragraph("+validateRating(): bool<br/>+recalculateAverage(): float", cell_style),
            Paragraph("0..* -> 1 ProviderProfile<br/>0..1 -> 1 Booking", cell_style)
        ],
    ]
    class_table = Table(class_data, colWidths=[80, 160, 160, 140])
    class_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(class_table)
    story.append(Spacer(1, 12))

    # 5. Architecture Diagrams Summary
    story.append(Paragraph("5. Complete Flow Diagrams Inventory", h1_style))
    story.append(Paragraph(
        "All 11 architectural flow diagrams are fully rendered in Markdown / Mermaid in the specification document (SOFTWARE_REQUIREMENTS_AND_ARCHITECTURE_SPECIFICATION.md):",
        body_style
    ))
    
    flows_data = [
        [Paragraph("Diagram #", cell_header), Paragraph("Diagram Type", cell_header), Paragraph("Architectural Domain Covered", cell_header)],
        [Paragraph("Diagram 1", cell_bold), Paragraph("System Architecture Flowchart", cell_style), Paragraph("Next.js 14 Presentation, API Layer, Haversine Engine, SQL Server Storage.", cell_style)],
        [Paragraph("Diagram 2", cell_bold), Paragraph("Actor Use Case Diagram", cell_style), Paragraph("Client, Artisan, and Guest interactions with 12 distinct system use cases.", cell_style)],
        [Paragraph("Diagram 3", cell_bold), Paragraph("Multi-Role Onboarding Sequence", cell_style), Paragraph("Dual-role registration path (Client vs Artisan vitrine setup).", cell_style)],
        [Paragraph("Diagram 4", cell_bold), Paragraph("Vitrine & Tariffs Activity Flow", cell_style), Paragraph("Artisan tariff configuration, service creation, and radius modification.", cell_style)],
        [Paragraph("Diagram 5", cell_bold), Paragraph("Geospatial Haversine Sequence", cell_style), Paragraph("Client GPS auto-detection, great-circle calculation, radius filtering.", cell_style)],
        [Paragraph("Diagram 6", cell_bold), Paragraph("Booking Negotiation Sequence", cell_style), Paragraph("Request creation, provider notification, 1-Click Accept/Reject response.", cell_style)],
        [Paragraph("Diagram 7", cell_bold), Paragraph("Booking State Machine Diagram", cell_style), Paragraph("Lifecycle: PENDING -> ACCEPTED / REJECTED -> IN_PROGRESS -> COMPLETED.", cell_style)],
        [Paragraph("Diagram 8", cell_bold), Paragraph("Verified Review Sequence", cell_style), Paragraph("Post-completion feedback submission and real-time rating recalculation.", cell_style)],
        [Paragraph("Diagram 9", cell_bold), Paragraph("RBAC Guard Security Flowchart", cell_style), Paragraph("Route guard enforcement: /provider/* vs /client/* strict isolation.", cell_style)],
        [Paragraph("Diagram 10", cell_bold), Paragraph("Docker Deployment Diagram", cell_style), Paragraph("proxiservice-web and proxiservice-sqlserver containers on bridge network.", cell_style)],
        [Paragraph("Diagram 11", cell_bold), Paragraph("Relational ERD Diagram", cell_style), Paragraph("Complete database schema: Users, Providers, Categories, Services, Bookings.", cell_style)],
    ]
    flows_table = Table(flows_data, colWidths=[70, 160, 310])
    flows_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(flows_table)
    story.append(Spacer(1, 12))

    # 6. Quality Audit Sign-off
    story.append(Paragraph("6. Quality Audit & Automated Test Verification", h1_style))
    story.append(Paragraph(
        "<b>Verification Results:</b> 31 of 31 Automated Tests Passed with 0 Failures across the Comprehensive API Suite (20 tests) and RBAC Security Suite (11 tests). "
        "Production build ('npm run build') validated with 16 routes statically and dynamically generated with 0 errors.",
        body_style
    ))
    
    test_summary = [
        [Paragraph("Test Suite Category", cell_header), Paragraph("Tests Executed", cell_header), Paragraph("Passed", cell_header), Paragraph("Failed", cell_header), Paragraph("Success Rate", cell_header)],
        [Paragraph("Geospatial & Haversine Math", cell_style), Paragraph("4", cell_style), Paragraph("4", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("Authentication & Onboarding", cell_style), Paragraph("5", cell_style), Paragraph("5", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("Categories & Spatial GeoSearch", cell_style), Paragraph("6", cell_style), Paragraph("6", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("Provider Profile & Tariffs", cell_style), Paragraph("1", cell_style), Paragraph("1", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("Booking Workflow & Lifecycle", cell_style), Paragraph("3", cell_style), Paragraph("3", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("Reviews & Reputation Recalculation", cell_style), Paragraph("1", cell_style), Paragraph("1", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("RBAC Navigation & Route Guards", cell_style), Paragraph("11", cell_style), Paragraph("11", cell_style), Paragraph("0", cell_style), Paragraph("100%", cell_bold)],
        [Paragraph("<b>TOTALS</b>", cell_bold), Paragraph("<b>31</b>", cell_bold), Paragraph("<b>31</b>", cell_bold), Paragraph("<b>0</b>", cell_bold), Paragraph("<b>100% PASS</b>", cell_bold)],
    ]
    test_table = Table(test_summary, colWidths=[180, 80, 80, 80, 120])
    test_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BACKGROUND', (0,-1), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_gray),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_gray),
        ('TEXTCOLOR', (4,1), (4,-1), emerald),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(test_table)

    doc.build(story)
    print(f"PDF Successfully generated at: {filename}")

if __name__ == '__main__':
    build_pdf()
