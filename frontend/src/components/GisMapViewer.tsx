"use client";

import React, { useState } from "react";
import { Project } from "../types";
import { MapPin, ShieldAlert, ArrowRight, Compass, Maximize2, Layers } from "lucide-react";

interface GisMapViewerProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedProject: Project | null;
}

export default function GisMapViewer({
  projects,
  onSelectProject,
  selectedProject,
}: GisMapViewerProps) {
  const [filterStage, setFilterStage] = useState<string>("All");

  const stages = [
    "All",
    "Section 11 Notification",
    "Section 15 Hearing",
    "Section 19 Declaration",
    "Section 23 Award",
    "Section 38 Possession",
  ];

  const filtered = filterStage === "All" 
    ? projects 
    : projects.filter((p) => p.current_stage === filterStage);

  // Map coordinate scaler to render India's geographical projection accurately
  // India approx: Lat (8°N to 36°N), Lon (68°E to 97°E)
  const getMapCoordinates = (lat: number, lon: number) => {
    const minLat = 8.0, maxLat = 34.0;
    const minLon = 68.0, maxLon = 92.0;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.min(Math.max(x, 5), 95),
      y: Math.min(Math.max(y, 5), 95)
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Top Map Toolbar */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Geospatial Land Acquisition GIS Map (PostGIS Layer)
          </h3>
          <span className="text-[11px] text-slate-400">
            ({filtered.length} plot clusters active)
          </span>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Filter Stage:</span>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 outline-none cursor-pointer"
          >
            {stages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Content Viewport */}
      <div className="relative flex-1 bg-[#090d16] overflow-hidden">
        {/* Subtle SVG Grid & Geo Boundary Outline */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Stylized Geo contours */}
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
        </svg>

        {/* Latitude & Longitude Coordinate markers */}
        <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 pointer-events-none">
          LAT: 08°04'N – 34°12'N · LON: 68°07'E – 92°25'E (WGS-84 / EPSG:4326)
        </div>

        {/* Dynamic Project Coordinate Pins */}
        {filtered.map((prj) => {
          const coords = getMapCoordinates(prj.latitude || 20.0, prj.longitude || 78.0);
          const isSelected = selectedProject?.id === prj.id;
          const isCritical = prj.risk_category === "CRITICAL";
          const isMedium = prj.risk_category === "MEDIUM";

          const pinColor = isCritical 
            ? "bg-rose-500 shadow-rose-500/50" 
            : isMedium 
            ? "bg-amber-500 shadow-amber-500/50" 
            : "bg-emerald-500 shadow-emerald-500/50";

          return (
            <div
              key={prj.id}
              onClick={() => onSelectProject(prj)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              {/* Radar pulse for Critical projects */}
              {isCritical && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping" />
              )}

              {/* Pin Center */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-150 ${pinColor} ${
                  isSelected ? "ring-4 ring-sky-400 scale-125" : ""
                }`}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>

              {/* Interactive Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 shadow-2xl z-30 min-w-[200px] pointer-events-none">
                <span className="text-[10px] font-mono text-slate-400">{prj.project_code}</span>
                <span className="text-xs font-bold text-slate-100">{prj.project_name}</span>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{prj.district_name}, {prj.state_name}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    isCritical ? "text-rose-400 bg-rose-500/20" : isMedium ? "text-amber-400 bg-amber-500/20" : "text-emerald-400 bg-emerald-500/20"
                  }`}>
                    {prj.risk_category} ({Math.round((prj.delay_probability || 0) * 100)}%)
                  </span>
                </div>
                <div className="mt-1 text-[10px] text-slate-400 flex items-center">
                  <span>Stage: <strong>{prj.current_stage}</strong></span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Project Quick Inspection Drawer */}
        {selectedProject && (
          <div className="absolute bottom-4 right-4 bg-slate-950/95 border border-slate-800 rounded-xl p-4 shadow-2xl max-w-sm backdrop-blur-lg z-30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {selectedProject.project_code}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                selectedProject.risk_category === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : selectedProject.risk_category === "MEDIUM"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {selectedProject.risk_category} RISK ({Math.round((selectedProject.delay_probability || 0) * 100)}%)
              </span>
            </div>

            <h4 className="text-xs font-bold text-white leading-tight">
              {selectedProject.project_name}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block">District:</span>
                <strong>{selectedProject.district_name}, {selectedProject.state_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Footprint:</span>
                <strong>{selectedProject.total_acreage_ha} ha ({selectedProject.num_land_parcels} parcels)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Expected Delay:</span>
                <strong className="text-amber-400">{selectedProject.expected_delay_days || 0} days</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sec 19 Status:</span>
                <strong className={selectedProject.lapsing_risk_s19 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {selectedProject.lapsing_risk_s19 ? "Lapsing Danger" : "Within Timeline"}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* GIS Map Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 text-[10px] text-slate-300 space-y-1.5 backdrop-blur-md">
          <div className="font-semibold text-slate-200">GIS Risk Layers</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical (&gt;70% Delay Hazard)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium (35% - 70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Low (&lt;35% Margin)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
