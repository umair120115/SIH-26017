# ⚡ DoLR LARR Act 2013 — Backend & ML Intelligence Service

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.12-blue.svg)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%20100--Tree-red.svg)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/Explainability-Exact%20TreeSHAP-ff69b4.svg)](https://shap.readthedocs.io/)
[![pgvector](https://img.shields.io/badge/Vector%20DB-PostgreSQL%20%2B%20pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Sentence-Transformers](https://img.shields.io/badge/Embeddings-all--MiniLM--L6--v2-orange.svg)](https://www.sbert.net/)

The production-grade intelligence, predictive machine learning, and semantic legal RAG service for the **Department of Land Resources (DoLR), Ministry of Rural Development (SIH26017)**.

---

## 🏛️ System Features & Intelligence Architecture

### 1. 🧠 Multi-Head XGBoost Inference Engine (`app/ml_engine.py`)
- Loaded from pre-trained 100-tree binary logistic model (`models/model.json`).
- Ingests 14 statutory, financial, and geospatial features.
- Computes overall delay probability ($P(\text{Delay}) \in [0, 1]$) and Discrete-Time Survival Hazard Analysis estimating expected delay duration in days.

### 2. 🔍 Exact TreeSHAP Attribution Diagnostics
- Computes exact local Shapley attributions via `xgb.Booster.predict(pred_contribs=True)`.
- Categorizes feature attributions into 4 statutory driver families:
  - 🏛️ **Statutory Timelines**: Section 19(2) 12-month lapsing window proximity, SIA completion timeline.
  - ⚖️ **Litigation & Stay Orders**: Active High Court stay orders, Section 15 objection density per hectare.
  - 💰 **Valuation Disparities**: Circle rate vs market transaction disparity ratio, Solatium allocation.
  - 🌿 **Social & Tribal Clearances**: Section 41/42 Gram Sabha tribal consent, Stage-II forest clearance, Section 10 multi-crop restrictions.

### 3. 🎯 Counterfactual Prescriptive Optimizer (`app/optimizer.py`)
- Evaluates policy modifications (increasing compensation multipliers, deploying fast-track Section 15 objection benches, expediting Gram Sabha consent).
- Calculates exact $\Delta$ Risk Reduction (%) and statutory days saved.
- Automatically generates administrative advisory memos.

### 4. 📚 Dynamic Legal Semantic RAG (`app/ingestion.py`)
- Indexes legal precedents, High Court stay judgments, Section 15 dispute orders, and Supreme Court rulings.
- Utilizes `pgvector` with HNSW Cosine Indexing and dense 384-dimensional `all-MiniLM-L6-v2` embeddings (with resilient token feature-hashing projection fallback).

### 5. 📄 Google Docs Real-Time Sync (`app/google_sync.py`)
- Automatically generates and appends statutory advisory memos into shared Google Docs for District Collectors and Land Acquisition Officers.

---

## 📁 Repository Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entrypoint & REST routing
│   ├── schemas.py           # Pydantic v2 validation models
│   ├── ml_engine.py         # XGBoost inference & TreeSHAP attributions
│   ├── ingestion.py         # pgvector legal document RAG chunking & vector search
│   ├── database.py          # PostgreSQL / Supabase connection manager
│   ├── optimizer.py         # Counterfactual prescriptive engine
│   ├── google_sync.py       # Google Docs automated memo sync
│   └── synthetic_generator.py # Synthetic sample project generator
├── models/
│   └── model.json           # Pre-trained 100-tree XGBoost model artifact
├── tests/
│   └── test_api.py          # Backend test suite
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
├── .env                     # Local environment configuration (git-ignored)
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python**: `3.10+` or `3.12+`
- **PostgreSQL / Supabase** *(Optional - runs resilient local store if omitted)*

### 2. Setup Virtual Environment & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/<your-username>/SIH_BACKEND.git
cd SIH_BACKEND

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
CUSTOM_MODEL_PATH=models/model.json
EMBEDDING_MODEL=all-MiniLM-L6-v2
GOOGLE_DOC_ID=
GOOGLE_CREDS_PATH=credentials.json
```

### 4. Launch FastAPI Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```
- **Server URL**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **Redoc**: `http://localhost:8000/redoc`

---

## 🧪 Running Automated Tests

Run the full API test suite:
```bash
python tests/test_api.py
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & system operational status |
| `POST` | `/shap-explain` | Runs multi-head XGBoost inference and returns exact TreeSHAP attributions |
| `POST` | `/simulate-whatif` | Simulates counterfactual policy interventions |
| `POST` | `/prescribe-optimize` | Generates optimal statutory remedies and syncs advisory memo to Google Docs |
| `POST` | `/knowledge/ingest` | Chunks and embeds legal judgments into vector database |
| `POST` | `/knowledge/query` | Semantic vector search for matching legal precedents |

---

## 📄 License
This project is open-source software licensed under the **Apache License 2.0**.
