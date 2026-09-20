"use client";

import React from "react";
import { 
  Shield, RefreshCw, Sparkles, MapPin, Sliders, 
  Building2, AlertOctagon, FileText, BrainCircuit, BookOpen
} from "lucide-react";

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
    { id: "overview", label: "01. Executive Command Hub", icon: Building2 },
    { 
      id: "lapsing", 
      label: "02. Sec 19(2) Lapsing Radar", 
      icon: AlertOctagon,
      badge: criticalAlertCount > 0 ? criticalAlertCount : undefined 
    },
    { id: "explainability", label: "03. TreeSHAP Attribution & What-If", icon: BrainCircuit },
    { id: "prescriptive", label: "04. Sec 26 Prescriptions & Remedies", icon: FileText },
    { id: "rag", label: "05. RFCTLARR Legal Intelligence", icon: BookOpen },
  ];

  return (
    <header className="border-b border-slate-800/90 bg-[#090E1A]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Sovereign Administrative Strip */}
      <div className="bg-[#050811] border-b border-slate-800/60 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-500/90 tracking-wider">सत्यमेव जयते</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300 font-medium">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600 hidden md:inline">·</span>
          <span className="text-slate-400 hidden md:inline">MINISTRY OF RURAL DEVELOPMENT</span>
          <span className="text-slate-600 hidden lg:inline">·</span>
          <span className="text-slate-400 hidden lg:inline">DEPARTMENT OF LAND RESOURCES (DoLR)</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CALA BENCH: <strong className="text-white">SPECIAL LAND ACQUISITION OFFICER</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">TOKEN #GOI-DoLR-26017</span>
          </div>
          <span className="hidden sm:inline text-slate-500 text-[10px]">
            STATUTORY ENFORCEMENT PORTAL (ACT NO. 30 OF 2013)
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Authority Logo */}
          <div className="flex items-center space-x-3.5">
            {/* National Ashoka Emblem Badge */}
            <div className="p-2.5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/80 shadow-md flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-amber-400/90" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Stylized Ashoka Chakra / Sovereign Pillar Symbol */}
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5">
                  PRAGATI-LARR <span className="text-blue-400 font-mono text-xs font-semibold px-2 py-0.5 bg-blue-950/60 border border-blue-800/60 rounded">v2.0</span>
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 rounded">
                  150-TREE STATUTORY ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-normal mt-0.5">
                Statutory Delay Risk Forecasting, Section 19 Lapsing Radar & TreeSHAP Attribution
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Evaluate Custom Case / Judge Tester Button */}
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 text-white rounded-lg text-xs font-medium flex items-center shadow-md shadow-blue-950/50 border border-blue-400/40 transition-all cursor-pointer font-sans"
              title="Open Interactive Statutory Case Evaluator"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-blue-100" />
              <span>+ Ingest & Evaluate Project</span>
            </button>

            {/* State Filter */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs shadow-inner">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedState}
                onChange={(e) => onSelectState(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
              >
                {states.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    State: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs shadow-inner">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRisk}
                onChange={(e) => onSelectRisk(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
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
              className="hidden lg:flex px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium items-center transition-all disabled:opacity-50"
              title="Simulate 8 additional authentic statutory acquisition dockets"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1.5 text-amber-400 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Synthesizing..." : "Simulate Dockets"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs transition-colors"
              title="Refresh Portfolio & Resync Statutory Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto pb-2.5 scrollbar-none border-t border-slate-800/80 pt-2.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                  isActive
                    ? "bg-slate-800/90 text-white border-blue-500/50 shadow-sm shadow-blue-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
