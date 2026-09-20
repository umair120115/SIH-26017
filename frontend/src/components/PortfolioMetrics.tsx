"use client";

import React from "react";
import { 
  Building2, Layers, IndianRupee, AlertTriangle, 
  Clock, ShieldAlert, TrendingUp, Compass, Scale
} from "lucide-react";
import { PortfolioData } from "../types";

interface PortfolioMetricsProps {
  data: PortfolioData | null;
  loading: boolean;
}

export default function PortfolioMetrics({ data, loading }: PortfolioMetricsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800" />
        ))}
      </div>
    );
  }

  const total = data.total_projects || 1;
  const criticalPct = Math.round(((data.risk_distribution.CRITICAL || 0) / total) * 100);
  const mediumPct = Math.round(((data.risk_distribution.MEDIUM || 0) / total) * 100);
  const lowPct = Math.round(((data.risk_distribution.LOW || 0) / total) * 100);

  return (
    <div className="space-y-4">
      {/* 4 Primary Top Metrics with Architectural Treatment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Footprint */}
        <div className="bg-[#0D1322] border border-slate-800/90 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/40" />
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Monitored Footprint</p>
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mt-1.5 tracking-tight">
                {data.total_acreage_ha.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">hectares</span>
              </h3>
            </div>
            <div className="p-2.5 bg-blue-950/60 text-blue-400 border border-blue-800/50 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <Compass className="w-3.5 h-3.5 mr-1 text-blue-400" />
              <span>Gazetted Projects: <strong className="text-slate-200 font-mono">{data.total_projects}</strong></span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">PostGIS Cadastral Layer</span>
          </div>
        </div>

        {/* Metric 2: Capital At Risk */}
        <div className="bg-[#0D1322] border border-slate-800/90 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" />
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Outlay Under Appraisal</p>
              </div>
              <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tracking-tight">
                ₹{data.total_cost_cr.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">Crores</span>
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <Scale className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Transport, Energy & Irrigation</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">Schedule I Multiplier</span>
          </div>
        </div>

        {/* Metric 3: Average Expected Delay Days */}
        <div className="bg-[#0D1322] border border-slate-800/90 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/40" />
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Statutory Survival Latency</p>
              </div>
              <h3 className="text-2xl font-bold font-mono text-amber-400 mt-1.5 tracking-tight">
                {data.avg_delay_days} <span className="text-xs font-sans font-normal text-slate-400">days mean</span>
              </h3>
            </div>
            <div className="p-2.5 bg-amber-950/60 text-amber-400 border border-amber-800/50 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Calibrated discrete hazard</span>
            <span className="font-mono text-[10px] text-slate-500">Weibull Baseline</span>
          </div>
        </div>

        {/* Metric 4: Section 19(2) Statutory Lapsing Warning */}
        <div className={`border rounded-xl p-5 shadow-lg relative overflow-hidden group transition-colors ${
          data.critical_lapsing_projects_count > 0 
            ? "bg-[#180E14] border-rose-900/80" 
            : "bg-[#0D1322] border-slate-800/90"
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-[2px] ${
            data.critical_lapsing_projects_count > 0 ? "bg-rose-500" : "bg-slate-700"
          }`} />
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-rose-300">Sec 19(2) Lapsing Countdown</p>
              </div>
              <h3 className="text-2xl font-bold font-mono text-rose-400 mt-1.5 tracking-tight">
                {data.critical_lapsing_projects_count} <span className="text-xs font-sans font-normal text-rose-300/80">projects</span>
              </h3>
            </div>
            <div className="p-2.5 bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-rose-900/40 flex items-center justify-between text-[11px] text-rose-300/90">
            <span className="flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />
              <span>12-Month Hard Limit Expiry</span>
            </span>
            <span className="font-mono text-[10px] text-rose-400 font-bold uppercase">Statutory Alert</span>
          </div>
        </div>

      </div>

      {/* Risk Distribution Breakdown Bar with Institutional Precision */}
      <div className="bg-[#0B101E] border border-slate-800/90 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="text-xs font-medium text-slate-300 flex items-center space-x-2">
          <span className="font-mono uppercase text-[10px] text-slate-500 tracking-wider">Statutory Audit</span>
          <span className="text-slate-600">|</span>
          <span>Portfolio Risk Spectrum:</span>
        </div>

        <div className="w-full md:w-2/3 space-y-1.5">
          <div className="h-2.5 w-full bg-slate-950 rounded-md flex overflow-hidden p-0.5 border border-slate-800">
            <div style={{ width: `${criticalPct}%` }} className="bg-rose-500 h-full rounded-sm transition-all" title={`Critical: ${data.risk_distribution.CRITICAL}`} />
            <div style={{ width: `${mediumPct}%` }} className="bg-amber-500 h-full transition-all" title={`Medium: ${data.risk_distribution.MEDIUM}`} />
            <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full rounded-sm transition-all" title={`Low: ${data.risk_distribution.LOW}`} />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center"><span className="w-2 h-2 rounded-sm bg-rose-500 mr-1.5" /> High / Critical Risk: <strong className="text-slate-200 ml-1">{data.risk_distribution.CRITICAL || 0}</strong> ({criticalPct}%)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-sm bg-amber-500 mr-1.5" /> Medium Risk: <strong className="text-slate-200 ml-1">{data.risk_distribution.MEDIUM || 0}</strong> ({mediumPct}%)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-sm bg-emerald-500 mr-1.5" /> Normal / Low: <strong className="text-slate-200 ml-1">{data.risk_distribution.LOW || 0}</strong> ({lowPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
