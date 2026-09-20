"use client";

import React, { useState } from "react";
import { 
  X, Sparkles, Sliders, ShieldAlert, CheckCircle2, 
  ArrowRight, Clock, Layers, Landmark, FileText, 
  RotateCcw, AlertTriangle, ChevronRight, Activity
} from "lucide-react";
import { Project, ShapExplanation, PrescriptiveData } from "../types";
import { api } from "../services/api";

interface CustomProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

export default function CustomProjectModal({ isOpen, onClose, onProjectCreated }: CustomProjectModalProps) {
  // Preset Templates for Evaluators / Judges
  const presets = [
    {
      name: "Tribal Corridor Stalemate",
      desc: "Triggers Section 19(2) 12-month lapsing alarm & Section 41 Gram Sabha consent hurdles",
      data: {
        project_name: "Gondwana Tribal Expressway Phase 2",
        project_type: "National Highway",
        sector: "Transport",
        state_name: "Maharashtra",
        district_name: "Gadchiroli",
        total_acreage_ha: 450.0,
        num_land_parcels: 320,
        private_to_govt_ratio: 3.5,
        sc_st_land_percentage: 42.0,
        multi_crop_irrigated_percentage: 8.0,
        required_consent_percentage: 80,
        non_owner_to_owner_paf_ratio: 0.8,
        circle_rate_disparity_ratio: 1.8,
        rr_cost_share_percentage: 28.0,
        rural_multiplier_factor: 1.75,
        district_litigation_rate: 8.5,
        revenue_staff_vacancy_rate: 38.0,
        avg_s15_resolution_days: 75.0,
        s11_notification_date: new Date(Date.now() - 315 * 86400000).toISOString().split("T")[0],
      }
    },
    {
      name: "Circle Rate Litigation Crisis",
      desc: "High market-to-circle valuation mismatch causing widespread Section 64 court references",
      data: {
        project_name: "Golden Quadrilateral Industrial Spur",
        project_type: "Industrial Corridor Mega Hub",
        sector: "Urban Development",
        state_name: "Gujarat",
        district_name: "Surat",
        total_acreage_ha: 680.0,
        num_land_parcels: 540,
        private_to_govt_ratio: 5.2,
        sc_st_land_percentage: 4.0,
        multi_crop_irrigated_percentage: 20.0,
        required_consent_percentage: 70,
        non_owner_to_owner_paf_ratio: 0.3,
        circle_rate_disparity_ratio: 3.4,
        rr_cost_share_percentage: 16.0,
        rural_multiplier_factor: 1.5,
        district_litigation_rate: 18.0,
        revenue_staff_vacancy_rate: 22.0,
        avg_s15_resolution_days: 45.0,
        s11_notification_date: new Date(Date.now() - 140 * 86400000).toISOString().split("T")[0],
      }
    },
    {
      name: "Low-Risk Solar Park",
      desc: "Standard government revenue land with negligible consent & valuation friction",
      data: {
        project_name: "Thar Mega Ultra Solar Park",
        project_type: "Renewable Solar Energy Park",
        sector: "Energy",
        state_name: "Gujarat",
        district_name: "Kutch",
        total_acreage_ha: 1200.0,
        num_land_parcels: 85,
        private_to_govt_ratio: 0.4,
        sc_st_land_percentage: 2.0,
        multi_crop_irrigated_percentage: 0.0,
        required_consent_percentage: 0,
        non_owner_to_owner_paf_ratio: 0.1,
        circle_rate_disparity_ratio: 1.1,
        rr_cost_share_percentage: 6.0,
        rural_multiplier_factor: 1.0,
        district_litigation_rate: 1.5,
        revenue_staff_vacancy_rate: 8.0,
        avg_s15_resolution_days: 18.0,
        s11_notification_date: new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0],
      }
    }
  ];

  const defaultForm = presets[0].data;
  const [formData, setFormData] = useState<any>(defaultForm);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    prediction: any;
    shap: ShapExplanation | null;
    prescriptions: PrescriptiveData | null;
  } | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (presetData: any) => {
    setFormData(presetData);
    setEvaluationResult(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setEvaluationResult(null);
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const [pred, shap, presc] = await Promise.all([
        api.predictDelay(formData),
        api.getShapExplanation(formData),
        api.getPrescriptions(formData)
      ]);
      setEvaluationResult({
        prediction: pred,
        shap,
        prescriptions: presc
      });
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleInjectToPortfolio = async () => {
    setIsSaving(true);
    try {
      const created = await api.createProject(formData);
      onProjectCreated(created);
      onClose();
    } catch (err) {
      console.error("Save project error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b101e] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-100">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Interactive Land Acquisition Case Evaluator
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  CALA / JUDICIAL TEST MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Input arbitrary statutory parameters or load real test cases to evaluate delay probability, TreeSHAP attributions, and statutory remedies under LARR Act 2013.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Presets for Evaluators */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
              Select One-Click Realistic Case Presets
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetSelect(p.data)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    formData.project_name === p.data.project_name
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/20"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <p className="text-xs font-bold flex items-center justify-between">
                    <span>{p.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl">
            
            {/* Left Column: Identity & Physical Footprint */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center">
                <Landmark className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Project Identity & Cadastral Scope
              </h3>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => handleInputChange("project_name", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state_name}
                    onChange={(e) => handleInputChange("state_name", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district_name}
                    onChange={(e) => handleInputChange("district_name", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Total Acreage (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.total_acreage_ha}
                    onChange={(e) => handleInputChange("total_acreage_ha", parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Land Parcels (Khasras)</label>
                  <input
                    type="number"
                    value={formData.num_land_parcels}
                    onChange={(e) => handleInputChange("num_land_parcels", parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Section 11 Notification Date
                </label>
                <input
                  type="date"
                  value={formData.s11_notification_date}
                  onChange={(e) => handleInputChange("s11_notification_date", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Mandates Section 19 declaration within 12 calendar months (365 days)
                </span>
              </div>
            </div>

            {/* Right Column: Statutory & Delay Levers */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Statutory, Valuation & Administrative Levers
              </h3>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Circle Rate Disparity Ratio
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formData.circle_rate_disparity_ratio}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={formData.circle_rate_disparity_ratio}
                  onChange={(e) => handleInputChange("circle_rate_disparity_ratio", parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">
                  Market price vs circle valuation (&gt;2.2x triggers severe Sec 64 dispute)
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Revenue Survey Staff Vacancy Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formData.revenue_staff_vacancy_rate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={formData.revenue_staff_vacancy_rate}
                  onChange={(e) => handleInputChange("revenue_staff_vacancy_rate", parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">
                  Shortage of Patwaris/surveyors delaying Sec 12 ground demarcations
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">SC/ST Land %</label>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {formData.sc_st_land_percentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={formData.sc_st_land_percentage}
                    onChange={(e) => handleInputChange("sc_st_land_percentage", parseFloat(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">Sec 41/42 consent</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Multi-Crop %</label>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {formData.multi_crop_irrigated_percentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={formData.multi_crop_irrigated_percentage}
                    onChange={(e) => handleInputChange("multi_crop_irrigated_percentage", parseFloat(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">Sec 10 food security</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Prior Consent Required
                  </label>
                  <select
                    value={formData.required_consent_percentage}
                    onChange={(e) => handleInputChange("required_consent_percentage", parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value={0}>0% (Government Direct)</option>
                    <option value={70}>70% (Public-Private PPP)</option>
                    <option value={80}>80% (Private Entity Acquisition)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Rural Multiplier
                  </label>
                  <select
                    value={formData.rural_multiplier_factor}
                    onChange={(e) => handleInputChange("rural_multiplier_factor", parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value={1.0}>1.0x (Urban Proximity)</option>
                    <option value={1.25}>1.25x (Semi-Rural)</option>
                    <option value={1.5}>1.50x (Standard Rural)</option>
                    <option value={2.0}>2.00x (Deep Hinterland)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => handlePresetSelect(presets[0].data)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Preset</span>
            </button>

            <button
              type="button"
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
              <span>{isEvaluating ? "Executing Multi-Head AI Models..." : "Run AI Delay Prediction & Solve"}</span>
            </button>
          </div>

          {/* DYNAMIC RESULTS DRAWER */}
          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Real-Time AI Multi-Head Diagnostics & Statutory Audit
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Exact TreeSHAP contributors computed via Booster
                </span>
              </div>

              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Delay Probability</p>
                  <p className="text-xl font-mono font-bold text-white mt-1">
                    {(evaluationResult.prediction.delay_probability * 100).toFixed(1)}%
                  </p>
                  <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded ${
                    evaluationResult.prediction.risk_category === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : evaluationResult.prediction.risk_category === "MEDIUM"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {evaluationResult.prediction.risk_category} RISK
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Expected Mean Delay</p>
                  <p className="text-xl font-mono font-bold text-amber-400 mt-1">
                    +{evaluationResult.prediction.expected_delay_days} <span className="text-xs font-normal text-slate-400">days</span>
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">Survival hazard head</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Days Since Sec 11</p>
                  <p className="text-xl font-mono font-bold text-slate-100 mt-1">
                    {evaluationResult.prediction.days_since_s11} <span className="text-xs font-normal text-slate-400">/ 365</span>
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {evaluationResult.prediction.days_remaining_s19} days to 12-mo limit
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  evaluationResult.prediction.lapsing_risk_s19
                    ? "bg-rose-950/30 border-rose-800 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-300"
                }`}>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Sec 19(2) Lapse Status</p>
                  <p className="text-sm font-bold mt-1">
                    {evaluationResult.prediction.lapsing_risk_s19 ? "CRITICAL RISK OF LAPSE" : "Statutory Safe Window"}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {evaluationResult.prediction.lapsing_risk_s19
                      ? "Requires immediate emergency declaration"
                      : "Proceeding within compliance"}
                  </span>
                </div>
              </div>

              {/* SHAP Drivers and Prescriptions in 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* TreeSHAP Top Drivers */}
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                    Top Root-Cause Drivers (TreeSHAP)
                  </h4>
                  <div className="space-y-2">
                    {evaluationResult.shap?.factors.slice(0, 3).map((factor, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-200">{factor.plain_english_meaning}</span>
                          <span className={`font-mono font-bold ${
                            factor.contribution_direction === "increases_risk" ? "text-rose-400" : "text-emerald-400"
                          }`}>
                            {factor.shap_value > 0 ? `+${(factor.shap_value * 100).toFixed(1)}%` : `${(factor.shap_value * 100).toFixed(1)}%`}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Domain: {factor.category} · Direction: {factor.contribution_direction.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescriptive Legal Solutions */}
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Prescribed Statutory Remedies
                  </h4>
                  <div className="space-y-2">
                    {evaluationResult.prescriptions?.optimizations.slice(0, 2).map((opt, idx) => (
                      <div key={idx} className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-xs">
                        <p className="font-bold text-emerald-400">{opt.recommended_action}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Legal Basis: {opt.legal_basis}</p>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{opt.actionable_blueprint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Inject to Live Portfolio */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-300">
                    Ready to include this project in the live executive portfolio?
                  </p>
                  <p className="text-[11px] text-slate-400">
                    This will persist the project, place it on the Leaflet GIS map, and update national portfolio aggregations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleInjectToPortfolio}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Injecting..." : "Add to Active Live Portfolio"}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function PlusCircle(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
