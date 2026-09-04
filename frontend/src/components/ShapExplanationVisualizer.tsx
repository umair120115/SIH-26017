"use client";

import React, { useState, useEffect } from "react";
import { Project, ShapExplanation, ShapFactor } from "../types";
import { api } from "../services/api";
import { BrainCircuit, Activity, BarChart3, HelpCircle, Layers, RefreshCw } from "lucide-react";

interface ShapExplanationVisualizerProps {
  project: Project | null;
}

export default function ShapExplanationVisualizer({ project }: ShapExplanationVisualizerProps) {
  const [shapData, setShapData] = useState<ShapExplanation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      loadShap();
    }
  }, [project]);

  const loadShap = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const data = await api.getShapExplanation(project);
      setShapData(data);
    } catch (err) {
      console.error("SHAP calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">Please select an infrastructure project to view TreeSHAP explainability attributions.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              TreeSHAP Explainable AI (XAI) Attribution Diagnostics
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact Shapley feature impact decomposition for <strong className="text-slate-200">{project.project_name}</strong> ({project.project_code})
          </p>
        </div>

        <button
          onClick={loadShap}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Computing TreeSHAP..." : "Recalculate"}</span>
        </button>
      </div>

      {loading && (
        <div className="py-12 text-center text-slate-400 animate-pulse">
          <Activity className="w-8 h-8 mx-auto mb-2 text-sky-400 animate-spin" />
          <p className="text-xs">Computing tree traversal feature coalitions...</p>
        </div>
      )}

      {!loading && shapData && (
        <div className="space-y-6">
          {/* Baseline vs Model Output Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Baseline Portfolio Expectation (E[f(x)])
              </span>
              <span className="text-xl font-bold font-mono text-slate-300 mt-1 block">
                {Math.round(shapData.base_value * 100)}%
              </span>
              <span className="text-[10px] text-slate-500">Average historical delay prior</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Model Predicted Delay Probability
              </span>
              <span className={`text-xl font-bold font-mono mt-1 block ${
                shapData.prediction_value > 0.70 ? "text-rose-400" : shapData.prediction_value > 0.35 ? "text-amber-400" : "text-emerald-400"
              }`}>
                {Math.round(shapData.prediction_value * 100)}%
              </span>
              <span className="text-[10px] text-slate-500">Post-feature coalition calculation</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Net Feature Impact Delta
              </span>
              <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">
                {((shapData.prediction_value - shapData.base_value) * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500">Sum of SHAP values ($\Sigma \phi_i$)</span>
            </div>
          </div>

          {/* Aggregated Driver Family Breakdown */}
          {shapData.driver_group_breakdown && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Aggregated Administrative Driver Families
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(shapData.driver_group_breakdown).map(([group, pct]) => (
                  <div key={group} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{group}</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature-Level SHAP Impact Waterfall Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                Individual Feature Attributions (SHAP Values)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Ranked by absolute contribution magnitude
              </span>
            </h4>

            <div className="space-y-2.5">
              {shapData.factors.slice(0, 8).map((factor, idx) => {
                const isRisk = factor.contribution_direction === "increases_risk";
                const widthPct = Math.min(100, Math.abs(factor.shap_value) * 250);

                return (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-white font-bold">{factor.feature_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                          {factor.category}
                        </span>
                      </div>
                      <span className={`font-mono font-bold ${isRisk ? "text-rose-400" : "text-emerald-400"}`}>
                        {factor.shap_value > 0 ? "+" : ""}{factor.shap_value.toFixed(4)} ({isRisk ? "Increases Delay Risk" : "Mitigates Risk"})
                      </span>
                    </div>

                    {/* Visual Impact Bar */}
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.max(5, widthPct)}%` }}
                        className={`h-full rounded-full ${
                          isRisk ? "bg-rose-500 shadow-sm shadow-rose-500/50" : "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                        }`}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400">
                      💡 {factor.plain_english_meaning}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
