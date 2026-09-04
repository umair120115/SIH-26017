"use client";

import React from "react";
import { 
  Building2, Layers, IndianRupee, AlertTriangle, 
  Clock, ShieldAlert, TrendingUp, CheckCircle2 
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
      {/* 4 Primary Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Footprint */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Monitored Footprint</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {data.total_acreage_ha.toLocaleString()} <span className="text-sm font-normal text-slate-400">ha</span>
              </h3>
            </div>
            <div className="p-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Across <strong className="text-slate-200">{data.total_projects}</strong> active infrastructure projects</span>
          </div>
        </div>

        {/* Metric 2: Capital At Risk */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Outlay Under Monitoring</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                ₹{data.total_cost_cr.toLocaleString()} <span className="text-sm font-normal text-slate-400">Cr</span>
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            <span>Transport, Energy & Irrigation Sectors</span>
          </div>
        </div>

        {/* Metric 3: Average Expected Delay Days */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Expected Mean Delay (Survival Head)</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">
                {data.avg_delay_days} <span className="text-sm font-normal text-slate-400">days</span>
              </h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span>Calibrated discrete hazard progression</span>
          </div>
        </div>

        {/* Metric 4: Section 19(2) Statutory Lapsing Warning */}
        <div className={`border rounded-xl p-5 shadow-lg relative overflow-hidden ${
          data.critical_lapsing_projects_count > 0 
            ? "bg-rose-950/30 border-rose-800/80" 
            : "bg-slate-900/80 border-slate-800"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Sec 19(2) 12-Month Lapsing Risk</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">
                {data.critical_lapsing_projects_count} <span className="text-sm font-normal text-slate-400">projects</span>
              </h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            <span>Requires urgent Section 19 declaration</span>
          </div>
        </div>

      </div>

      {/* Risk Distribution Breakdown Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
          <span>Portfolio Risk Classification:</span>
        </div>

        <div className="w-full md:w-2/3 space-y-1.5">
          <div className="h-3 w-full bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-slate-800">
            <div style={{ width: `${criticalPct}%` }} className="bg-rose-500 h-full rounded-l-full transition-all" title={`Critical: ${data.risk_distribution.CRITICAL}`} />
            <div style={{ width: `${mediumPct}%` }} className="bg-amber-500 h-full transition-all" title={`Medium: ${data.risk_distribution.MEDIUM}`} />
            <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full rounded-r-full transition-all" title={`Low: ${data.risk_distribution.LOW}`} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1" /> Critical: {data.risk_distribution.CRITICAL || 0} ({criticalPct}%)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1" /> Medium: {data.risk_distribution.MEDIUM || 0} ({mediumPct}%)</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> Low: {data.risk_distribution.LOW || 0} ({lowPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
