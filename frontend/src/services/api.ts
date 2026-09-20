import {
  PortfolioData, Project, ShapExplanation, PrescriptiveData,
  WhatIfResult, Alert, RagChunk
} from "../types";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

export const api = {
  async getPortfolio(state?: string, district?: string, riskBand?: string): Promise<PortfolioData> {
    const params = new URLSearchParams();
    if (state && state !== "All") params.append("state", state);
    if (district && district !== "All") params.append("district", district);
    if (riskBand && riskBand !== "All") params.append("risk_band", riskBand);
    
    const res = await fetch(`${API_BASE_URL}/portfolio?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch portfolio data");
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!res.ok) throw new Error("Failed to fetch project details");
    return res.json();
  },

  async createProject(features: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
    if (!res.ok) throw new Error("Failed to evaluate and register project");
    return res.json();
  },

  async predictDelay(features: Partial<Project>): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
    if (!res.ok) throw new Error("Failed to predict project delay");
    return res.json();
  },

  async getShapExplanation(features: Partial<Project>): Promise<ShapExplanation> {
    const res = await fetch(`${API_BASE_URL}/shap-explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
    if (!res.ok) throw new Error("Failed to compute SHAP explanation");
    return res.json();
  },

  async getPrescriptions(features: Partial<Project>): Promise<PrescriptiveData> {
    const res = await fetch(`${API_BASE_URL}/prescribe-optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
    if (!res.ok) throw new Error("Failed to generate prescriptive remedies");
    return res.json();
  },

  async simulateWhatIf(projectFeatures: Partial<Project>, resolvedFactors: string[]): Promise<WhatIfResult> {
    const res = await fetch(`${API_BASE_URL}/simulate-whatif`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_features: projectFeatures,
        resolved_factors: resolvedFactors,
      }),
    });
    if (!res.ok) throw new Error("Failed to run counterfactual simulation");
    return res.json();
  },

  async getAlerts(): Promise<Alert[]> {
    const res = await fetch(`${API_BASE_URL}/alerts`);
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
  },

  async queryRag(queryText: string, projectId?: string, topK: number = 3): Promise<RagChunk[]> {
    const res = await fetch(`${API_BASE_URL}/knowledge/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        query_text: queryText,
        top_k: topK,
      }),
    });
    if (!res.ok) throw new Error("Failed to query knowledge base");
    const data = await res.json();
    return data.results;
  },

  async ingestDocument(formData: FormData): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/knowledge/ingest`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to ingest document");
    return res.json();
  },

  async generateSynthetic(count: number = 10): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/projects/generate-synthetic?count=${count}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to generate synthetic data");
    return res.json();
  }
};
