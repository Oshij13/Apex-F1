import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "@/lib/api";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FileText, ShieldCheck, Scale, Info, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "FIA Official Documentation · APEX F1" },
      {
        name: "description",
        content:
          "Official Formula 1 regulatory documents, status definitions, and stewards' intelligence.",
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const { data: statuses, isLoading } = useQuery({
    queryKey: ["fiaStatuses"],
    queryFn: getStatuses,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  if (isLoading) return <LoadingScreen />;

  const allDocs = (statuses as any) || [];
  const filteredDocs = allDocs.filter(
    (doc: any) =>
      doc.status.toLowerCase().includes(search.toLowerCase()) ||
      doc.statusId.toString().includes(search),
  );

  return (
    <div className="pb-20">
      <div className="border-b border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
              FIA{" "}
              <span className="text-primary italic-none">DOCUMENTATION</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-[14px] max-w-2xl uppercase tracking-[0.2em] leading-relaxed">
            Official regulatory archive · Technical directives · Stewards'
            decision nomenclature
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search regulations or status codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/50 transition-all"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc: any) => (
            <button
              key={doc.statusId}
              onClick={() => setSelectedDoc(doc)}
              className="group text-left rounded-xl border border-border bg-surface-1 p-5 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  REF: 2026-REG-{doc.statusId}
                </span>
              </div>
              <h3 className="mb-2 text-[15px] font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                {doc.status}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground italic">
                <ShieldCheck className="h-3 w-3 text-positive" />
                Click to view dossier
              </div>
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-surface-2 p-6">
              <Scale className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              No Regulatory Match
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm font-bold uppercase tracking-widest">
              Scan failed. Adjust search parameters.
            </p>
          </div>
        )}
      </div>

      {/* DOCUMENT MODAL */}
      {selectedDoc && (
        <DocModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}

import { getAISummary } from "@/lib/api";
import { X } from "lucide-react";

function DocModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const { data: briefing, isLoading } = useQuery({
    queryKey: ["docBriefing", doc.statusId],
    queryFn: () =>
      getAISummary(`Provide a professional FIA Technical Briefing for the status: "${doc.status}" (ID: ${doc.statusId}). 
    Include:
    1. Sporting Significance (The impact on points and position)
    2. Technical Context (Technical reasons for this status)
    3. Regulatory Precedent (Standard FIA handling)
    Style: Professional, concise, official regulatory document. 3-4 paragraphs.
    IMPORTANT: DO NOT USE ANY MARKDOWN OR MARKUP. NO BOLD (**), NO HEADERS (#), NO LISTS (-). Use only plain text with standard spacing.`),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-surface-1 shadow-2xl flex flex-col">
        <div className="border-b border-border p-6 flex items-center justify-between bg-surface-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">
              Official FIA Directive
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
              {doc.status}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-surface-3 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-mono text-[13px] leading-relaxed text-muted-foreground custom-scrollbar">
          <div className="mb-8 border-l-2 border-primary pl-6 py-2">
            <div className="mb-4 grid grid-cols-2 gap-4 uppercase tracking-widest text-[11px] font-bold">
              <div>
                <span className="text-white block">Document No:</span>
                2026-FIA-REG-{doc.statusId.toString().padStart(3, "0")}
              </div>
              <div>
                <span className="text-white block">Date Issued:</span>
                April 24, 2026
              </div>
              <div>
                <span className="text-white block">Classification:</span>
                Regulatory Protocol
              </div>
              <div>
                <span className="text-white block">Distribution:</span>
                All Teams / Stewards
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-surface-2 rounded w-3/4" />
              <div className="h-4 bg-surface-2 rounded w-1/2" />
              <div className="h-4 bg-surface-2 rounded w-5/6" />
              <div className="h-32 bg-surface-2 rounded w-full mt-8" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap prose prose-invert max-w-none">
              {briefing}
            </div>
          )}

          <div className="mt-12 border-t border-border pt-8 text-center italic opacity-50">
            This document is generated for regulatory intelligence purposes in
            the Apex F1 environment.
          </div>
        </div>

        <div className="border-t border-border p-4 bg-surface-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-white/5 border border-border px-6 py-2 text-[12px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
