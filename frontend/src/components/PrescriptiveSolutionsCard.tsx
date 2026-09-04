"use client";

import React, { useState } from "react";
import { Project, PrescriptiveData } from "../types";
import { api } from "../services/api";
import { ShieldCheck, RefreshCw, FileText, ArrowRight, CheckCircle2, Sparkles, Scale } from "lucide-react";

interface PrescriptiveSolutionsCardProps {
  project: Project | null;
}

export default function PrescriptiveSolutionsCard({ project }: PrescriptiveSolutionsCardProps) {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptiveData | null>(null);
  const [synced, setSynced] = useState(false);

  const calculatePrescriptions = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const data = await api.getPrescriptions(project);
      setPrescriptions(data);
      setSynced(data.google_doc_synced);
    } catch (err) {
      console.error("Prescriptions pipeline error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <Scale className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">Select an infrastructure project to generate statutory LARR Act prescriptive action blueprints.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Module Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              LARR Act 2013 Statutory Prescriptive Optimizer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Converts ML delay drivers into administrative blueprints and syncs live executive advisory briefs to Google Docs.
          </p>
        </div>

        <button
          onClick={calculatePrescriptions}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 self-start sm:self-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Optimizing Path..." : "Generate Statutory Remedies"}</span>
        </button>
      </div>

      {/* State Badge and Live Google Docs sync indicator */}
      {prescriptions && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Project:</span>
              <strong className="text-white">{prescriptions.project_name}</strong>
              <span className={`px-2 py-0.5 rounded font-bold ${
                prescriptions.risk_category === "CRITICAL" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {prescriptions.risk_category} RISK
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className={synced ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                {synced ? "Synced Live to Google Docs!" : "Advisory Memo Generated (Local Mode)"}
              </span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Prescribed Statutory Blueprints ({prescriptions.optimizations.length})
            </h4>

            {prescriptions.optimizations.map((plan, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded font-mono font-bold">
                    Trigger Driver: {plan.trigger_driver} ({plan.impact_score})
                  </span>
                  <span className="text-slate-400">
                    Statutory Grounding: <strong className="text-sky-400 font-semibold">{plan.legal_basis}</strong>
                  </span>
                </div>

                <div className="text-white font-bold text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{plan.recommended_action}</span>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>{plan.actionable_blueprint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
