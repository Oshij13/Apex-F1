import { Link } from "@tanstack/react-router";
import {
  Clock,
  Info,
  Zap,
  Sparkles,
  MapPin,
  Loader2,
  ExternalLink,
  X,
  Maximize2,
  MessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAISummary, getTrackSpecs } from "@/lib/api";
import { useState } from "react";
import { circuitSvgMap } from "@/lib/f1-data";
import { AIInsightCard } from "./AIInsightCard";

const formatIST = (dateStr: string | null) => {
  if (!dateStr) return "TBD";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      weekday: "short",
    }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
};

export function FutureRaceHub({ displayData, circuit, year }: any) {
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  const { data: specs, isLoading: specsLoading } = useQuery({
    queryKey: ["trackSpecs", displayData?.Circuit?.circuitName],
    queryFn: () => getTrackSpecs(displayData!.Circuit.circuitName),
    enabled: !!displayData?.Circuit?.circuitName,
  });

  const { data: trackAnalysis, isLoading: aiLoading } = useQuery({
    queryKey: ["aiTrackAnalysis", displayData?.Circuit?.circuitId],
    queryFn: () =>
      getAISummary(
        `Provide a technical analysis of the ${displayData?.Circuit?.circuitName} circuit for the upcoming ${year} race. Focus on track characteristics, tire wear, and DRS zones in 3 technical sentences.`,
      ),
    enabled: !!displayData?.Circuit?.circuitName,
    staleTime: Infinity,
  });

  // Determine the minimal SVG source
  const minimalSvg =
    displayData?.Circuit?.circuitId &&
    circuitSvgMap[displayData.Circuit.circuitId]
      ? `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/black/${circuitSvgMap[displayData.Circuit.circuitId]}`
      : circuit?.wiki?.thumbnail?.source ||
        circuit?.wiki?.originalimage?.source;

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-10">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h2 className="font-display text-3xl uppercase tracking-tighter text-white">
            Weekend Schedule (IST)
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <ScheduleCard label="Practice 1" time={displayData.sessions?.fp1} />
            
            {displayData.sessions?.sprint ? (
              <>
                <ScheduleCard
                  label="Sprint Quali"
                  time={displayData.sessions?.sprintQualifying}
                />
                <ScheduleCard
                  label="Sprint"
                  time={displayData.sessions.sprint}
                  accent
                />
              </>
            ) : (
              <>
                <ScheduleCard label="Practice 2" time={displayData.sessions?.fp2} />
                <ScheduleCard label="Practice 3" time={displayData.sessions?.fp3} />
              </>
            )}

            <ScheduleCard
              label="Qualifying"
              time={displayData.sessions?.qualifying}
              highlight
            />
            <ScheduleCard
              label="Grand Prix"
              time={displayData.sessions?.gp}
              primary
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Track
                Specifications
              </h3>
            </div>
            {specsLoading ? (
              <div className="space-y-4 animate-pulse py-4">
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-6 py-2">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                    Length (km)
                  </p>
                  <p className="text-lg font-display text-white">
                    {specs?.length || "5.412"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                    Turns
                  </p>
                  <p className="text-lg font-display text-white">
                    {specs?.turns || "15"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                    Sectors
                  </p>
                  <p className="text-lg font-display text-white">
                    {specs?.sectors || "3"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                    Elevation
                  </p>
                  <p className="text-lg font-display text-white">
                    {specs?.elevation
                      ? `${specs.elevation.toString().replace(/[Mm]$| meters$/i, "").trim()} meters`
                      : "—"}
                  </p>
                </div>
                <div className="col-span-2 pt-4 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                    Lap Record
                  </p>
                  <p className="text-sm font-mono text-primary font-bold">
                    {typeof specs?.record === "object"
                      ? `${specs.record.time} (${specs.record.driver || specs.record.holder || specs.record.holders?.[0]?.driver || "—"})`
                      : specs?.record || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <AIInsightCard
            title="AI Track Analysis"
            prompt={`Provide a high-depth technical analysis of the ${displayData?.Circuit?.circuitName} circuit for the upcoming ${year} race. 
            Focus on track characteristics, tire wear patterns, and DRS zone strategy.
            STRICT INSTRUCTIONS:
            1. Return a JSON object with a "content" key.
            2. DO NOT use any markdown formatting (no bold **, no italics _, no headers #).
            3. Use EXACTLY 100 words.
            4. Output ONLY the JSON.`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <InfoBlock
          title="Official Briefing"
          icon={<MessageSquare className="h-3.5 w-3.5 text-primary" />}
        >
          <p className="text-[12px] italic text-white/60 leading-relaxed">
            "Teams are arriving with high-downforce configurations for the
            upcoming {displayData?.name}. Strategic tire management will be
            critical for the race distance."
          </p>
        </InfoBlock>
        <InfoBlock
          title="Circuit History"
          icon={<Info className="h-3.5 w-3.5 text-white/40" />}
        >
          <div className="space-y-4">
            <p className="text-[12px] leading-relaxed text-white/60 line-clamp-8">
              {circuit?.wiki?.extract ||
                "Circuit information is being updated."}
            </p>
            {circuit?.wiki?.content_urls?.desktop?.page && (
              <a
                href={circuit.wiki.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1 font-bold uppercase tracking-widest"
              >
                Link to the Wikipedia Page{" "}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </InfoBlock>
      </div>

      {/* MODAL VIEW - FULL DETAIL (WIKIPEDIA) */}
      {isLayoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12 animate-in fade-in duration-300">
          <button
            onClick={() => setIsLayoutOpen(false)}
            className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[110]"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={circuit?.wiki?.originalimage?.source}
              className="max-h-full max-w-full object-contain filter invert brightness-[2] contrast-[1.2]"
              alt="Full Detailed Track Layout"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({ label, time, highlight, accent, primary }: any) {
  return (
    <div
      className={`rounded-lg p-4 border ${primary ? "bg-primary/10 border-primary/20" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05] transition-colors"}`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${highlight ? "text-amber-500" : accent ? "text-purple-400" : "text-white/40"}`}
      >
        {label}
      </div>
      <div className="text-sm font-semibold text-white/90">
        {formatIST(time)}
      </div>
    </div>
  );
}

function InfoBlock({ title, icon, children, accent }: any) {
  return (
    <div
      className={`rounded-xl border p-6 ${accent ? "border-primary/25 bg-primary/5" : "border-white/5 bg-white/[0.02]"}`}
    >
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
