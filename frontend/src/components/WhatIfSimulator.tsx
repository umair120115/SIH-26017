"use client";

import React, { useState } from "react";
import { Project, WhatIfResult } from "../types";
import { api } from "../services/api";
import { Sliders, Play, CheckSquare, Square, TrendingDown, Clock, ShieldCheck } from "lucide-react";

interface WhatIfSimulatorProps {
  project: Project | null;
}

export default function WhatIfSimulator({ project }: WhatIfSimulatorProps) {
  const [selectedLevers, setSelectedLevers] = useState<string[]>([
    "circle_rate_disparity_ratio",
    "revenue_staff_vacancy_rate",
  ]);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<WhatIfResult | null>(null);

  const availableLevers = [
    {
      id: "circle_rate_disparity_ratio",
      title: "Direct Settlement under Section 26 Proviso 4",
      description: "Direct Collector negotiations with 100% market rate + solatium (sets disparity to 1.0x).",
      tag: "Compensation Lever"
    },
    {
      id: "revenue_staff_vacancy_rate",
      title: "Deploy Emergency Surveyor Squad on Deputation",
      description: "Depute 15 Patwaris from adjacent divisions to clear Sec 12 cadastral surveys (drops vacancy to 5%).",
      tag: "Staffing Lever"
    },
    {
      id: "avg_s15_resolution_days",
      title: "Institute Dedicated Section 15 Hearing Officers",
      description: "Fast-track disposal of citizen written objections within 7-day calendar cycles (drops delay to 15 days).",
      tag: "Administrative Lever"
    },
    {
      id: "district_litigation_rate",
      title: "Pre-Litigation Lok Adalat Conciliation Drive",
      description: "Settle title and boundary disputes outside court before Section 19 declaration.",
      tag: "Legal Lever"
    }
  ];

  const toggleLever = (id: string) => {
    if (selectedLevers.includes(id)) {
      setSelectedLevers(selectedLevers.filter((l) => l !== id));
    } else {
      setSelectedLevers([...selectedLevers, id]);
    }
  };

  const handleSimulate = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const result = await api.simulateWhatIf(project, selectedLevers);
      setSimResult(result);
    } catch (err) {
      console.error("Counterfactual simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Counterfactual What-If Simulation Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate the exact risk reduction and delay days saved by toggling actionable administrative remedies.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading || selectedLevers.length === 0}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-lg shadow-sky-950/40 disabled:opacity-50 self-start sm:self-auto"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Simulating Delta..." : "Run What-If Simulation"}</span>
        </button>
      </div>

      {/* Lever Selection Checkboxes */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Select Actionable Administrative Levers to Resolve:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableLevers.map((lever) => {
            const isChecked = selectedLevers.includes(lever.id);

            return (
              <div
                key={lever.id}
                onClick={() => toggleLever(lever.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "bg-sky-950/30 border-sky-500/50 shadow-md shadow-sky-950/30"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-70"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 text-sky-400 shrink-0">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{lever.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                        {lever.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{lever.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation Results Output */}
      {simResult && (
        <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-bold text-white">
              Counterfactual Simulation Forecast
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Predicted Delay Risk Drop</span>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className="text-base text-slate-400 line-through font-mono font-bold">
                  {simResult.original_risk_score}%
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  → {simResult.simulated_risk_score}%
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">
                ↓ {simResult.risk_reduction_pct}% Net Risk Reduction
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Statutory Days Saved</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1 flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{simResult.delay_days_saved} Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Reduced timeline from {simResult.original_expected_delay_days}d to {simResult.simulated_expected_delay_days}d
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">New Risk Classification</span>
              <div className="mt-1">
                <span className={`px-2.5 py-1 rounded font-bold text-xs inline-block ${
                  simResult.simulated_risk_category === "LOW" 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : simResult.simulated_risk_category === "MEDIUM"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}>
                  {simResult.simulated_risk_category} RISK
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Was {simResult.original_risk_category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
