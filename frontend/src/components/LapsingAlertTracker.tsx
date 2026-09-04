"use client";

import React from "react";
import { Project, Alert } from "../types";
import { ShieldAlert, Clock, AlertTriangle, CheckCircle, ArrowRight, FileWarning } from "lucide-react";

interface LapsingAlertTrackerProps {
  projects: Project[];
  alerts: Alert[];
  onSelectProject: (p: Project) => void;
}

export default function LapsingAlertTracker({
  projects,
  alerts,
  onSelectProject,
}: LapsingAlertTrackerProps) {
  // Filter projects actively under Section 11 Notification or Section 15 Hearing without Section 19 declaration
  const pendingSec19Projects = projects.filter((p) => p.s19_declaration_date === null);

  return (
    <div className="space-y-6">
      {/* Statutory Banner Notice */}
      <div className="bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-800/60 rounded-xl p-5 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                Statutory Section 19(2) Compliance & 12-Month Lapsing Monitor
              </h3>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded">
                MANDATORY TIMELINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Under <strong>Section 19(2) of the LARR Act 2013</strong>, if no declaration is published within 
              <strong> twelve months (365 days)</strong> from the date of the preliminary notification under Section 11, 
              the preliminary notification shall be deemed to have been <strong>rescinded and lapsed</strong>, invalidating all prior acquisition proceedings.
            </p>
          </div>
        </div>
      </div>

      {/* Active High-Priority Alerts Grid */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
            Live Statutory Exception Triggers ({alerts.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="bg-slate-900/90 border border-rose-800/40 rounded-xl p-4 shadow-md flex items-start justify-between space-x-3 hover:border-rose-600/70 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                      {al.project_code}
                    </span>
                    <span className="text-xs font-bold text-white">{al.project_name}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{al.message}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Jurisdiction: <span className="text-slate-200">{al.district_name}, {al.state_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 19 Countdown Timeline Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold text-white">
              Statutory 365-Day Progression Timers (Active Section 11 Notices)
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            {pendingSec19Projects.length} projects pending Sec 19 Declaration
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Project Code</th>
                <th className="p-3.5">Title & District</th>
                <th className="p-3.5">Sec 11 Notice Date</th>
                <th className="p-3.5">Days Elapsed</th>
                <th className="p-3.5">Days Remaining (Sec 19)</th>
                <th className="p-3.5">Compliance Progress</th>
                <th className="p-3.5">Statutory Risk</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {pendingSec19Projects.map((prj) => {
                const elapsed = prj.days_since_s11 || 0;
                const remaining = Math.max(0, 365 - elapsed);
                const progressPct = Math.min(100, Math.round((elapsed / 365) * 100));
                const isLapsing = remaining <= 60 || elapsed >= 300;

                return (
                  <tr key={prj.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-sky-400 font-semibold">{prj.project_code}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{prj.project_name}</div>
                      <div className="text-[11px] text-slate-400">{prj.district_name}, {prj.state_name}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{prj.s11_notification_date}</td>
                    <td className="p-3.5 font-bold text-slate-200">{elapsed} days</td>
                    <td className="p-3.5">
                      <span className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                        isLapsing 
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" 
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {remaining} days left
                      </span>
                    </td>
                    <td className="p-3.5 w-48">
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className={`h-full ${
                              isLapsing ? "bg-rose-500" : progressPct > 60 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 text-right">{progressPct}% of 365-day cap</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {isLapsing ? (
                        <span className="inline-flex items-center px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[11px] font-bold">
                          <FileWarning className="w-3 h-3 mr-1" />
                          LAPSING IMMINENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[11px]">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          SECURE
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectProject(prj)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold inline-flex items-center space-x-1"
                      >
                        <span>Audit</span>
                        <ArrowRight className="w-3 h-3" />
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
  );
}
