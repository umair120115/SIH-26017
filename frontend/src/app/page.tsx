"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData, Project, Alert } from "../types";
import { api } from "../services/api";
import NavigationHeader from "../components/NavigationHeader";
import PortfolioMetrics from "../components/PortfolioMetrics";
import GisMapViewer from "../components/GisMapViewer";
import LapsingAlertTracker from "../components/LapsingAlertTracker";
import ShapExplanationVisualizer from "../components/ShapExplanationVisualizer";
import PrescriptiveSolutionsCard from "../components/PrescriptiveSolutionsCard";
import WhatIfSimulator from "../components/WhatIfSimulator";
import LegalRagConsole from "../components/LegalRagConsole";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { Search, Filter, ShieldAlert, ArrowRight, Eye, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portData, alertData] = await Promise.all([
        api.getPortfolio(selectedState, undefined, selectedRisk),
        api.getAlerts(),
      ]);
      setPortfolio(portData);
      setAlerts(alertData);
      if (portData.projects.length > 0 && !selectedProject) {
        setSelectedProject(portData.projects[0]);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedState, selectedRisk]);

  const handleGenerateSynthetic = async () => {
    setIsGenerating(true);
    try {
      await api.generateSynthetic(8);
      await fetchData();
    } catch (err) {
      console.error("Synthetic generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredProjects = (portfolio?.projects || []).filter((p) => {
    const matchesSearch =
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Authority Header */}
      <NavigationHeader
        selectedState={selectedState}
        onSelectState={setSelectedState}
        selectedRisk={selectedRisk}
        onSelectRisk={setSelectedRisk}
        onRefresh={fetchData}
        onGenerateSynthetic={handleGenerateSynthetic}
        isGenerating={isGenerating}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        criticalAlertCount={portfolio?.critical_lapsing_projects_count || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Executive KPI Metrics */}
        <PortfolioMetrics data={portfolio} loading={loading} />

        {/* TAB 1: EXECUTIVE OVERVIEW & GIS MAP */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* GIS Map & Selected Inspector */}
            <GisMapViewer
              projects={portfolio?.projects || []}
              onSelectProject={(p) => {
                setSelectedProject(p);
                setModalProject(p);
              }}
              selectedProject={selectedProject}
            />

            {/* Project Portfolio Grid / Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    Active Infrastructure Acquisition Pipeline
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time risk scoring, statutory lapsing countdowns, and delay probability
                  </p>
                </div>

                {/* Table Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by project name, code, district..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Project Title</th>
                      <th className="p-3">State / District</th>
                      <th className="p-3">Current Stage</th>
                      <th className="p-3">Footprint / Cost</th>
                      <th className="p-3">Delay Risk Prob</th>
                      <th className="p-3">Expected Delay</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredProjects.map((prj) => {
                      const isCritical = prj.risk_category === "CRITICAL";
                      const isMedium = prj.risk_category === "MEDIUM";

                      return (
                        <tr
                          key={prj.id}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            selectedProject?.id === prj.id ? "bg-slate-800/30" : ""
                          }`}
                        >
                          <td className="p-3 font-mono text-sky-400 font-bold">{prj.project_code}</td>
                          <td className="p-3 font-bold text-white max-w-xs truncate">{prj.project_name}</td>
                          <td className="p-3 text-slate-300">{prj.district_name}, {prj.state_name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[11px]">
                              {prj.current_stage}
                            </span>
                          </td>
                          <td className="p-3">
                            {prj.total_acreage_ha} ha <span className="text-slate-500">(₹{prj.project_cost_cr} Cr)</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                              isCritical 
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                                : isMedium 
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {prj.risk_category} ({Math.round((prj.delay_probability || 0) * 100)}%)
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-400">
                            +{prj.expected_delay_days || 0}d
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedProject(prj);
                                setModalProject(prj);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                              title="Audit Project Record"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECTION 19(2) 12-MONTH LAPSING TRACKER */}
        {activeTab === "lapsing" && (
          <LapsingAlertTracker
            projects={portfolio?.projects || []}
            alerts={alerts}
            onSelectProject={(p) => {
              setSelectedProject(p);
              setModalProject(p);
            }}
          />
        )}

        {/* TAB 3: TREESHAP EXPLAINABILITY & WHAT-IF SIMULATOR */}
        {activeTab === "explainability" && (
          <div className="space-y-6">
            {/* Project Picker */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-300">Select Project for SHAP Attribution:</span>
              <select
                value={selectedProject?.id || ""}
                onChange={(e) => {
                  const found = portfolio?.projects.find((p) => p.id === e.target.value);
                  if (found) setSelectedProject(found);
                }}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none cursor-pointer max-w-md"
              >
                {portfolio?.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.project_code}] {p.project_name} ({p.risk_category} Risk)
                  </option>
                ))}
              </select>
            </div>

            <ShapExplanationVisualizer project={selectedProject} />
            <WhatIfSimulator project={selectedProject} />
          </div>
        )}

        {/* TAB 4: PRESCRIPTIVE REMEDIES & GOOGLE DOCS SYNC */}
        {activeTab === "prescriptive" && (
          <div className="space-y-6">
            {/* Project Picker */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-300">Select Project for Statutory Remedies:</span>
              <select
                value={selectedProject?.id || ""}
                onChange={(e) => {
                  const found = portfolio?.projects.find((p) => p.id === e.target.value);
                  if (found) setSelectedProject(found);
                }}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none cursor-pointer max-w-md"
              >
                {portfolio?.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.project_code}] {p.project_name} ({p.risk_category} Risk)
                  </option>
                ))}
              </select>
            </div>

            <PrescriptiveSolutionsCard project={selectedProject} />
          </div>
        )}

        {/* TAB 5: DYNAMIC LEGAL RAG KNOWLEDGE BASE */}
        {activeTab === "rag" && (
          <LegalRagConsole />
        )}

      </main>

      {/* Audit Modal */}
      <ProjectDetailModal
        project={modalProject}
        onClose={() => setModalProject(null)}
        onViewDiagnostics={(p) => {
          setSelectedProject(p);
          setActiveTab("explainability");
        }}
        onViewPrescriptions={(p) => {
          setSelectedProject(p);
          setActiveTab("prescriptive");
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>
          Smart India Hackathon 2026 · Problem Statement SIH26017 · Ministry of Rural Development (DoLR)
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Predictive Analytics & Decision-Support Platform under Right to Fair Compensation & Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013
        </p>
      </footer>
    </div>
  );
}
