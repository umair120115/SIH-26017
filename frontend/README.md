# 🌐 DoLR LARR Act 2013 — Frontend Executive Command Center

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38b2ac.svg)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22c55e.svg)](https://recharts.org/)
[![Leaflet](https://img.shields.io/badge/GIS%20Mapping-Leaflet%201.9-10b981.svg)](https://leafletjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)

An enterprise-grade, real-time command and analytics dashboard built for the **Department of Land Resources (DoLR), Ministry of Rural Development (SIH26017)** to monitor land acquisition projects, visualize explainable AI risk factors (TreeSHAP), simulate policy interventions, conduct semantic legal precedent research, and map high-risk acquisition corridors across India.

---

## 🏛️ Problem Statement (SIH26017)
Early identification, diagnostic root-cause explanation, and prescriptive policy intervention for major national infrastructure projects facing delays under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (LARR Act 2013)**.

---

## ✨ Features & UI Components

### 1. 📊 Executive Portfolio KPI Ribbon (`PortfolioMetrics.tsx`)
- High-level executive statistics: Active Projects, Total Stalled Capex (₹ Cr), Critical High-Risk Projects, Average Predicted Delay Days, and Precedent Retrieval count.

### 2. 🗺️ Interactive GIS Cadastral & Hotspot Viewer (`GisMapViewer.tsx`)
- Dynamic map rendering project locations with color-coded risk markers (🟢 Low, 🟡 Moderate, 🔴 High Risk).
- State-wise territorial boundaries, project capex, affected families count, and direct link to project diagnostics.

### 3. 🧠 TreeSHAP Explainability Visualizer (`ShapExplanationVisualizer.tsx`)
- Interactive dual-view diagnostic panel:
  - **Statutory Driver Breakdown**: Groups attributions into Valuation, Litigation, Social/Tribal, and Statutory Proximity families.
  - **Feature Waterfall Bar Chart**: Recharts bar chart displaying exact positive ($\Delta +$) and negative ($\Delta -$) Shapley margin contributions to delay risk.

### 4. 🎯 What-If Policy Intervention Simulator (`WhatIfSimulator.tsx`)
- Real-time policy slider controls:
  - Circle Rate Disparity Multiplier ($1.0\times - 3.0\times$)
  - Citizen Objection Fast-Track Resolution Bench (% resolved)
  - Gram Sabha Tribal Consent Expedited Agreement (Section 41)
  - Rapid Land Survey Demarcation (Section 12)
- Real-time calculation of **$\Delta$ Risk Reduction (%)** and **Statutory Days Saved**.

### 5. 📚 Dynamic Legal RAG & Precedent Console (`LegalRagConsole.tsx`)
- Semantic vector search console querying landmark High Court stay orders, Section 15 objection rulings, and Supreme Court Section 19(2) lapsing precedents with match confidence scores.

### 6. ⚠️ Section 19(2) Statutory Lapsing Alert Tracker (`LapsingAlertTracker.tsx`)
- Real-time countdown tracking days elapsed since Section 11 preliminary notification against the mandatory 12-month statutory time-bar under Section 19(2).

### 7. 📄 Prescriptive Solutions & Advisory Memo Card (`PrescriptiveSolutionsCard.tsx`)
- Prescribed legal remedies under LARR Act Sections 26, 12, 10, and 41/42 with one-click export to Google Docs.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16.3.4 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Custom Glassmorphism, CSS Modules
- **Charts & Graphs**: Recharts 2.15
- **GIS & Maps**: Leaflet 1.9, React-Leaflet
- **Icons**: Lucide React
- **API Client**: Native `fetch` with TypeScript interfaces

---

## 📁 Frontend Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global Tailwind & glassmorphism theme tokens
│   │   ├── layout.tsx          # Root HTML layout with Google Inter typography
│   │   └── page.tsx            # Main executive dashboard grid assembly
│   ├── components/
│   │   ├── GisMapViewer.tsx            # Leaflet map container & project pin popups
│   │   ├── LapsingAlertTracker.tsx     # Section 19(2) deadline alerts
│   │   ├── LegalRagConsole.tsx         # Semantic RAG legal search interface
│   │   ├── NavigationHeader.tsx        # Top navbar with ministry branding & live badge
│   │   ├── PortfolioMetrics.tsx        # Executive summary KPI cards
│   │   ├── PrescriptiveSolutionsCard.tsx # Prescriptive policy interventions
│   │   ├── ProjectDetailModal.tsx      # Deep-dive project modal with compensation calc
│   │   ├── ShapExplanationVisualizer.tsx # Recharts TreeSHAP contribution visualizer
│   │   └── WhatIfSimulator.tsx         # Real-time counterfactual policy sliders
│   ├── services/
│   │   └── api.ts              # REST client connecting to FastAPI backend
│   └── types/
│       └── index.ts            # TypeScript interfaces for projects, SHAP, and RAG
├── public/                     # Static icons and assets
├── package.json                # Dependencies and build scripts
├── tsconfig.json               # TypeScript compiler options
└── next.config.ts              # Next.js configuration
```

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js**: `v18.17.0+` or `v20+`
- **npm**: `v9+`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/SIH_REPO.git
cd SIH_REPO

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔗 Backend API Integration

The frontend connects seamlessly to the FastAPI backend service running on `http://localhost:8000`:
- `POST /shap-explain`: Generates project delay probability and exact TreeSHAP feature attributions.
- `POST /simulate-whatif`: Evaluates counterfactual scenario simulations.
- `POST /prescribe-optimize`: Generates statutory remedies and triggers Google Docs advisory memo sync.
- `POST /knowledge/query`: Executes semantic vector search against legal precedent database.

---

## 📄 License
This project is open-source software licensed under the **Apache License 2.0**.
