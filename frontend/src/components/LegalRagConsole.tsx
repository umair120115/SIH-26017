"use client";

import React, { useState } from "react";
import { RagChunk } from "../types";
import { api } from "../services/api";
import { 
  FileSearch, Upload, Search, BookOpen, 
  FileCheck, Shield, Sparkles, CheckCircle, AlertCircle 
} from "lucide-react";

export default function LegalRagConsole() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RagChunk[]>([]);
  const [searched, setSearched] = useState(false);

  // Ingestion form state
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Section 15 Objection");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; success: boolean } | null>(null);

  const sampleQueries = [
    "High Court stay orders regarding multi-crop irrigated land under Section 10",
    "Section 15 citizen objection regarding circle rate disparity and Section 26",
    "SIA Social Impact Assessment tribal consent under Section 41",
    "Section 19 statutory 12-month lapsing precedents"
  ];

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.queryRag(searchQuery, undefined, 4);
      setResults(data);
    } catch (err) {
      console.error("RAG search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docTitle.trim()) return;
    setUploading(true);
    setUploadMsg(null);

    const formData = new FormData();
    formData.append("project_id", "p-101");
    formData.append("document_title", docTitle);
    formData.append("document_type", docType);
    formData.append("file", file);

    try {
      const res = await api.ingestDocument(formData);
      setUploadMsg({ text: `Successfully vectorized and ingested ${res.chunks_ingested} chunk(s)!`, success: true });
      setDocTitle("");
      setFile(null);
    } catch (err: any) {
      setUploadMsg({ text: `Ingestion failed: ${err.message}`, success: false });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Semantic Vector Search Console */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <FileSearch className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Dynamic Legal RAG Knowledge Base Console
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cosine vector similarity search across court stays, Section 15 citizen objections, and LARR statutory precedents (384-dimensional pgvector embeddings).
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Query legal precedents, court stay rationale, circle rate notifications..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-sky-950/40 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Searching..." : "Vector Search"}</span>
          </button>
        </div>

        {/* Suggested Query Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Suggested Judicial Queries:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q);
                  handleSearch(q);
                }}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3 pt-2">
          {searched && results.length === 0 && !loading && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No matching document chunks found above threshold.
            </div>
          )}

          {results.map((r, idx) => (
            <div
              key={idx}
              className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white">{r.document_title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono">
                    {r.document_type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono font-bold">
                    {Math.round(r.similarity * 100)}% Match
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-serif">
                "{r.content}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Col: Dynamic Document & Court Stay Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5 h-fit">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Dynamic Document Ingestion</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Feed new High Court stay orders or SIA reports into the vector database in real time.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Document Title</label>
            <input
              type="text"
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Calcutta HC Stay Order W.P. 4128"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="Section 15 Objection">Section 15 Objection</option>
              <option value="High Court Stay Order">High Court Stay Order</option>
              <option value="SIA Report">Social Impact Assessment (SIA)</option>
              <option value="Circle Rate Notification">Circle Rate Notification</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">File (.txt, .pdf, .docx, .json)</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file || !docTitle.trim()}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50"
          >
            <Upload className={`w-3.5 h-3.5 ${uploading ? "animate-spin" : ""}`} />
            <span>{uploading ? "Embedding & Ingesting..." : "Vectorize & Ingest Document"}</span>
          </button>
        </form>

        {uploadMsg && (
          <div className={`p-3 rounded-lg text-xs flex items-center space-x-2 ${
            uploadMsg.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            {uploadMsg.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{uploadMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
