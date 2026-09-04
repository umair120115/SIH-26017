"use client";

import React from "react";
import { Project } from "../types";
import { X, Building2, MapPin, IndianRupee, Layers, Clock, AlertTriangle, ShieldCheck, FileText } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onViewDiagnostics: (project: Project) => void;
  onViewPrescriptions: (project: Project) => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onViewDiagnostics,
  onViewPrescriptions,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const isCritical = project.risk_category === "CRITICAL";
  const isMedium = project.risk_category === "MEDIUM";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20 font-bold">
                {project.project_code}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                isCritical 
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                  : isMedium 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {project.risk_category} RISK ({Math.round((project.delay_probability || 0) * 100)}%)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1.5">{project.project_name}</h3>
            <p className="text-xs text-slate-400 flex items-center mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {project.district_name}, {project.state_name} · Sector: {project.sector}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Statutory Milestone Dates */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-sky-400" />
              LARR Act 2013 Statutory Lifecycle Progression
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Sec 11 Preliminary Notice</span>
                <strong className="text-white font-mono">{project.s11_notification_date}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Sec 15 Citizen Hearing</span>
                <strong className="text-white font-mono">{project.s15_hearing_date || "Pending"}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Sec 19 Declaration (12m Cap)</span>
                <strong className={project.lapsing_risk_s19 ? "text-rose-400 font-mono font-bold" : "text-white font-mono"}>
                  {project.s19_declaration_date || (project.lapsing_risk_s19 ? "⚠️ Imminent Lapse" : "In Progress")}
                </strong>
              </div>
            </div>
          </div>

          {/* Project Footprint & Physical Specs */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-emerald-400" />
              Acquisition Footprint & Social Demographics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Total Footprint</span>
                <strong className="text-white">{project.total_acreage_ha} ha ({project.num_land_parcels} parcels)</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Project Outlay</span>
                <strong className="text-emerald-400 font-mono">₹{project.project_cost_cr} Cr</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Circle Rate Disparity</span>
                <strong className="text-amber-400 font-mono">{project.circle_rate_disparity_ratio}x Market Rate</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Multi-Crop Irrigated %</span>
                <strong className="text-white font-mono">{project.multi_crop_irrigated_percentage}% (Sec 10 Cap)</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SC/ST Tribal Land %</span>
                <strong className="text-white font-mono">{project.sc_st_land_percentage}% (Sec 41/42)</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Revenue Staff Vacancy</span>
                <strong className="text-white font-mono">{project.revenue_staff_vacancy_rate}% Survey Shortage</strong>
              </div>
            </div>
          </div>

          {/* Stage Hazard Distribution */}
          {project.stage_wise_hazard && (
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Lifecycle Stage Hazard Breakdown
              </h4>
              <div className="space-y-2">
                {Object.entries(project.stage_wise_hazard).map(([stageName, haz]) => (
                  <div key={stageName} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{stageName}</span>
                      <span className="font-mono font-bold text-slate-200">{Math.round(haz * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${Math.round(haz * 100)}%` }}
                        className={`h-full ${haz > 0.7 ? "bg-rose-500" : haz > 0.4 ? "bg-amber-500" : "bg-emerald-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={() => {
              onClose();
              onViewDiagnostics(project);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>TreeSHAP Diagnostics</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onViewPrescriptions(project);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-950/40"
          >
            <span>Generate Statutory Remedies</span>
          </button>
        </div>

      </div>
    </div>
  );
}
