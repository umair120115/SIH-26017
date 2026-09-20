"use client";

import React from "react";
import { Shield, Activity, RefreshCw, Landmark, Sparkles, MapPin, Sliders, Lock } from "lucide-react";

interface NavigationHeaderProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  selectedRisk: string;
  onSelectRisk: (risk: string) => void;
  onRefresh: () => void;
  onGenerateSynthetic: () => void;
  isGenerating: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  criticalAlertCount: number;
  onOpenCustomModal: () => void;
}

export default function NavigationHeader({
  selectedState,
  onSelectState,
  selectedRisk,
  onSelectRisk,
  onRefresh,
  onGenerateSynthetic,
  isGenerating,
  activeTab,
  onTabChange,
  criticalAlertCount,
  onOpenCustomModal,
}: NavigationHeaderProps) {
  const states = ["All", "Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Odisha"];
  const riskBands = ["All", "LOW", "MEDIUM", "CRITICAL"];

  const navTabs = [
    { id: "overview", label: "Executive Command Hub" },
    { id: "lapsing", label: "Sec 19(2) Lapsing Tracker", badge: criticalAlertCount > 0 ? criticalAlertCount : undefined },
    { id: "explainability", label: "TreeSHAP Diagnostics & What-If" },
    { id: "prescriptive", label: "Statutory Prescriptions & Docs Sync" },
    { id: "rag", label: "Legal RAG Knowledge Base" },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Authority Logo */}
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-sky-600 rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/20">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">
                  DoLR · LARR ACT 2013
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  AI PREDICTIVE SUITE v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ministry of Rural Development · Government of India (SIH26017)
              </p>
            </div>

            {/* Authenticated Government Session Indicator */}
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-400 text-[11px]">Auth:</span>
              <span className="font-semibold text-slate-200">CALA / Competent Authority</span>
              <span className="text-slate-700">|</span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                TOKEN #26017-GOI
              </span>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Evaluate Custom Case / Judge Tester Button */}
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all cursor-pointer"
              title="Open Interactive Case Evaluator for Judges & Evaluators"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-emerald-100" />
              <span>+ Evaluate Custom Project</span>
            </button>

            {/* State Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedState}
                onChange={(e) => onSelectState(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
              >
                {states.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    State: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRisk}
                onChange={(e) => onSelectRisk(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
              >
                {riskBands.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-slate-200">
                    Risk: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Synthetic Benchmark Data */}
            <button
              onClick={onGenerateSynthetic}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-medium flex items-center transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Simulating..." : "+ Synthetic Data"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs transition-colors"
              title="Refresh Portfolio"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/50 pt-2">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
