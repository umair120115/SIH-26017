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
import CustomProjectModal from "../components/CustomProjectModal";
import { Search, Filter, ShieldAlert, ArrowRight, Eye, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
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
    <div className="min-h-screen bg-[#080C16] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      
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
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
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

            {/* National Land Acquisition Gazette Register Table */}
            <div className="bg-[#0D1322] border border-slate-800/90 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                      Gazette Registry
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Active Land Acquisition Pipeline (RFCTLARR Compliance Roster)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Statutory stage monitoring, 12-month Section 19 lapsing countdowns, and TreeSHAP delay probability
                  </p>
                </div>

                {/* Table Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by project name, code, district..."
                    className="w-full bg-[#080C16] border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080C16] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Gazette Code</th>
                      <th className="p-3">Infrastructure Project</th>
                      <th className="p-3">State / District</th>
                      <th className="p-3">Statutory Stage</th>
                      <th className="p-3">Acreage & Cost</th>
                      <th className="p-3">Delay Risk Tier</th>
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
                          <td className="p-3 font-mono text-blue-400 font-bold">{prj.project_code}</td>
                          <td className="p-3 font-semibold text-white max-w-xs truncate">{prj.project_name}</td>
                          <td className="p-3 text-slate-300">{prj.district_name}, {prj.state_name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-[#080C16] border border-slate-800 rounded font-mono text-[11px] text-slate-300">
                              {prj.current_stage}
                            </span>
                          </td>
                          <td className="p-3 font-mono">
                            {prj.total_acreage_ha} ha <span className="text-slate-500">(₹{prj.project_cost_cr} Cr)</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] uppercase tracking-wider ${
                              isCritical 
                                ? "bg-rose-950/80 text-rose-400 border border-rose-800/60" 
                                : isMedium 
                                ? "bg-amber-950/80 text-amber-400 border border-amber-800/60" 
                                : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
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
                              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium inline-flex items-center space-x-1 border border-slate-750 transition-colors cursor-pointer"
                              title="Audit Statutory Project File"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Inspect</span>
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

      {/* Interactive Custom Case Evaluation Modal for Judges & Officers */}
      <CustomProjectModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onProjectCreated={(newProject) => {
          setSelectedProject(newProject);
          fetchData();
        }}
      />

      {/* Sovereign National Portal Footer */}
      <footer className="border-t border-slate-800/90 bg-[#060913] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-semibold text-amber-500 font-mono text-[11px]">सत्यमेव जयते</span>
              <span className="text-slate-600">|</span>
              <p className="font-semibold text-slate-200">
                Department of Land Resources (DoLR) · Ministry of Rural Development · Government of India
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              PRAGATI-LARR Statutory Decision Support System (SIH26017) · National Land Records Modernization Programme (NLRMP)
            </p>
          </div>

          <div className="text-center md:text-right space-y-1 font-mono text-[11px] text-slate-500">
            <p>
              Statutory Benchmark: <strong className="text-slate-300">RFCTLARR Act, 2013 (Act No. 30 of 2013)</strong>
            </p>
            <p className="text-[10px] text-slate-600">
              Sections 11, 15, 19, 23, 26, 38, 41, 42 & Schedules I–IV Compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
