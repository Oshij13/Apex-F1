import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  getRaceResults,
  getQualifyingResults,
  getPitstops,
  getCircuitDetails,
  getAISummary,
  getCalendar,
  getTrackSpecs,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Trophy,
  Timer,
  Fuel,
  MapPin,
  Zap,
  Loader2,
  Calendar,
  Sparkles,
  ExternalLink,
  Info,
  X,
  Maximize2,
} from "lucide-react";
import {
  teamColor,
  Team,
  circuitSvgMap,
  countryToFlag,
  getTeamColor,
} from "@/lib/f1-data";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RaceSimulation } from "@/components/RaceSimulation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FutureRaceHub } from "@/components/FutureRaceHub";
import { AIInsightCard } from "@/components/AIInsightCard";

// --- HELPERS ---

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

const getHeroImage = (circuitName: string, country: string) => {
  const c = circuitName.toLowerCase();
  const loc = country.toLowerCase();
  if (
    loc.includes("bahrain") ||
    loc.includes("saudi") ||
    loc.includes("qatar") ||
    loc.includes("uae") ||
    loc.includes("abu dhabi")
  )
    return "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=2000";
  if (
    c.includes("monaco") ||
    c.includes("miami") ||
    c.includes("zandvoort") ||
    loc.includes("australia")
  )
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000";
  return "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=2000";
};

const parseRaceId = (id: string) => {
  const parts = id.split("-");
  if (parts.length === 2)
    return { year: parseInt(parts[0]), round: parseInt(parts[1]) };
  return null;
};

// --- ROUTE ---

export const Route = createFileRoute("/race/$raceId")({
  head: () => ({
    meta: [
      { title: "Race Hub · APEX F1" },
      {
        name: "description",
        content:
          "Formula 1 race results, telemetry, and pre-race intelligence.",
      },
    ],
  }),
  component: RacePage,
});

// --- MAIN PAGE ---

function RacePage() {
  const { raceId } = useParams({ from: "/race/$raceId" });
  const parsed = parseRaceId(raceId);
  const year = parsed?.year ?? 2026;
  const round = parsed?.round ?? 1;

  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  const { data: raceData, isLoading: raceLoading } = useQuery({
    queryKey: ["raceResults", year, round],
    queryFn: () => getRaceResults(year, round),
    retry: false,
  });

  const { data: calendar } = useQuery({
    queryKey: ["calendar", 2026],
    queryFn: getCalendar,
  });

  const upcomingRace = useMemo(() => {
    if (raceData) return null;
    return calendar?.find(
      (r: any) => r.round === round && r.season === year.toString(),
    );
  }, [calendar, raceData, round, year]);

  const displayData = raceData || upcomingRace;
  const isUpcoming = !raceData;

  const { data: qualifying } = useQuery({
    queryKey: ["qualifying", year, round],
    queryFn: () => getQualifyingResults(year, round),
    enabled: !!raceData,
  });

  const { data: pitstops } = useQuery({
    queryKey: ["pitstops", year, round],
    queryFn: () => getPitstops(year, round),
    enabled: !!raceData,
  });

  const { data: circuit, isLoading: circuitLoading } = useQuery({
    queryKey: ["circuit", displayData?.Circuit?.circuitId],
    queryFn: () => getCircuitDetails(displayData!.Circuit.circuitId),
    enabled: !!displayData?.Circuit?.circuitId,
  });

  const { data: specs, isLoading: specsLoading } = useQuery({
    queryKey: ["trackSpecs", displayData?.Circuit?.circuitName],
    queryFn: () => getTrackSpecs(displayData!.Circuit.circuitName),
    enabled: !!raceData && !!displayData?.Circuit?.circuitName,
  });

  const { data: aiRaceRecap, isLoading: aiLoading } = useQuery({
    queryKey: ["aiRaceRecap", year, round],
    queryFn: () =>
      getAISummary(
        `As a Senior F1 Technical Analyst, provide a high-depth technical dossier on the ${year} ${displayData?.name || "race"}. 
        Analyze the engineering strategies, podium deltas, and aerodynamic outcomes in a surgical narrative.
        STRICT INSTRUCTIONS:
        1. Return a JSON object with a "content" key.
        2. DO NOT use any markdown formatting (no bold **, no italics _, no headers #).
        3. Use approximately 100-150 words.
        4. Output ONLY the JSON.`,
      ),
    enabled: !!raceData,
    staleTime: Infinity,
  });

  if (raceLoading && !upcomingRace) return <LoadingScreen />;
  if (!displayData)
    return (
      <div className="p-12 text-center text-muted-foreground">
        Race not found
      </div>
    );

  const results = raceData?.results || [];
  const podium = results.slice(0, 3);

  // Determine the minimal SVG source
  const minimalSvg =
    displayData?.Circuit?.circuitId &&
    circuitSvgMap[displayData.Circuit.circuitId]
      ? `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/black/${circuitSvgMap[displayData.Circuit.circuitId]}`
      : circuit?.wiki?.thumbnail?.source ||
        circuit?.wiki?.originalimage?.source;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* HERO SECTION */}
      <div className="relative h-[400px] w-full overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={getHeroImage(
              displayData?.Circuit?.circuitName || "",
              displayData?.Circuit?.Location?.country || "",
            )}
            alt="Race background"
            className="h-full w-full object-cover grayscale"
          />
        </div>

        <div className="container relative z-20 mx-auto flex h-full items-end pb-12 px-6">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Link
                to="/seasons"
                className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white mb-5 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Seasons
              </Link>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 flex items-center gap-1.5">
                  <span className="text-[12px] leading-none mb-0.5">
                    {countryToFlag(
                      displayData?.Circuit?.Location?.country || "",
                    )}
                  </span>
                  Round {displayData?.round} • {year} Season
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-white/40 uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />{" "}
                  {formatIST(displayData?.sessions?.gp || displayData?.date)}
                </span>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter md:text-8xl leading-none text-white">
                {(displayData?.name || displayData?.raceName || "TBA").replace(
                  "Grand Prix",
                  "",
                )}
                <span className="block text-primary">Grand Prix</span>
              </h1>
            </div>

            {/* CIRCUIT LAYOUT - MINIMAL VERSION */}
            <div
              className="hidden md:block w-full max-w-[380px] rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-5 shadow-2xl mb-2 group overflow-hidden cursor-pointer"
              onClick={() => setIsLayoutOpen(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Circuit Layout
                </h3>
                <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold group-hover:text-primary/40 transition-colors">
                  (Click to view the detailed version)
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-black/40 flex items-center justify-center p-4 rounded-lg">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-3 w-3 text-white/40" />
                </div>
                {circuitLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white/10" />
                ) : (
                  <img
                    src={minimalSvg}
                    className="max-h-[100%] w-auto filter invert brightness-[2] contrast-[1.2] transition-transform duration-500 group-hover:scale-105"
                    alt="Minimal Track Layout"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {isUpcoming ? (
          <FutureRaceHub
            displayData={displayData}
            circuit={circuit}
            year={year}
          />
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              {/* PODIUM */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-primary" /> Podium
                </h3>
                <div className="flex items-end gap-4 max-w-md mx-auto">
                  <PodStep d={podium[1]} pos={2} h="h-28" />
                  <PodStep d={podium[0]} pos={1} h="h-44" winner />
                  <PodStep d={podium[2]} pos={3} h="h-20" />
                </div>
              </div>

              {/* TABS */}
              <Tabs defaultValue="results" className="w-full">
                <TabsList className="mb-8 w-full justify-start rounded-none border-b border-white/5 bg-transparent p-0 h-12 gap-8">
                  <TabsTrigger value="results" className="tab-btn-modern">
                    Race Results
                  </TabsTrigger>
                  <TabsTrigger value="qualifying" className="tab-btn-modern">
                    Qualifying
                  </TabsTrigger>
                  <TabsTrigger value="pitstops" className="tab-btn-modern">
                    Pit Stops
                  </TabsTrigger>
                  {Number(year) >= 2018 && (
                    <TabsTrigger value="simulation" className="tab-btn-modern">
                      Race Simulations
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="results">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <RaceResultsTable results={results} />
                  </div>
                </TabsContent>
                <TabsContent value="qualifying">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <QualifyingTable qualifying={qualifying || []} />
                  </div>
                </TabsContent>
                <TabsContent value="pitstops">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <PitstopsTable
                      pitstops={pitstops || []}
                      results={results}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="simulation">
                  <RaceSimulation year={year} round={round} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <AIInsightCard
                title="AI Race Analysis"
                prompt={`As a Senior F1 Technical Analyst, provide a high-depth technical dossier on the ${year} ${displayData?.name || "race"}. 
                Analyze the engineering strategies, podium deltas, and aerodynamic outcomes in a surgical narrative.
                STRICT INSTRUCTIONS:
                1. Return a JSON object with a "content" key.
                2. DO NOT use any markdown formatting (no bold **, no italics _, no headers #).
                3. Use EXACTLY 100 words.
                4. Output ONLY the JSON.`}
              />

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 h-auto transition-all duration-300">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Track
                  Specifications
                </h3>
                {specsLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-y-4">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">
                        Length (km)
                      </p>
                      <p className="text-[13px] font-medium text-white/80">
                        {specs?.length || "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">
                        Turns
                      </p>
                      <p className="text-[13px] font-medium text-white/80">
                        {specs?.turns || "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">
                        Sectors
                      </p>
                      <p className="text-[13px] font-medium text-white/80">
                        {specs?.sectors || "3"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">
                        Elevation
                      </p>
                      <p className="text-[13px] font-medium text-white/80">
                        {specs?.elevation
                          ? `${specs.elevation.toString().replace(/[Mm]$| meters$/i, "").trim()} meters`
                          : "—"}
                      </p>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-white/5">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold mb-1">
                        Lap Record
                      </p>
                      <p className="text-[12px] font-mono text-primary break-words">
                        {typeof specs?.record === "object" ? (
                          <span className="inline-block">
                            {specs.record.time}
                            {specs.record.holders ? (
                              specs.record.holders
                                .sort(
                                  (a: any, b: any) =>
                                    Number(a.year) - Number(b.year),
                                )
                                .map((h: any, i: number) => (
                                  <span key={i} className="ml-1">
                                    ({h.driver}, {h.year})
                                  </span>
                                ))
                            ) : (
                              <span className="ml-1">
                                ({specs.record.driver}
                                {specs.record.year
                                  ? `, ${specs.record.year}`
                                  : ""}
                                )
                              </span>
                            )}
                          </span>
                        ) : (
                          specs?.record || "—"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CIRCUIT INFO MOVED TO SIDEBAR */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-primary" /> Circuit History
                </h3>
                <div className="space-y-4">
                  {circuitLoading ? (
                    <div className="animate-pulse h-4 bg-white/5 rounded w-full" />
                  ) : (
                    <>
                      <p className="text-[12px] leading-relaxed text-white/60 line-clamp-6">
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
              src={minimalSvg || circuit?.wiki?.originalimage?.source}
              className="max-h-full max-w-full object-contain filter invert brightness-[2] contrast-[1.2]"
              alt="Detailed Track Layout"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PodStep({ d, pos, h, winner }: any) {
  if (!d) return null;
  const color = getTeamColor(d.driver.team);
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <Link
        to="/driver/$driverId"
        params={{ driverId: d.driver.id }}
        className="font-display text-[15px] text-white/80 hover:text-primary transition-colors"
      >
        {d.driver.lastName}
      </Link>
      <div
        className="text-[10px] mb-2 uppercase tracking-widest font-bold"
        style={{ color }}
      >
        {d.driver.team}
      </div>
      <div
        className={`w-full ${h} rounded-t-md flex items-center justify-center border transition-all ${winner ? "bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30" : "bg-white/[0.02] border-white/5"}`}
      >
        <div
          className={`font-display ${winner ? "text-6xl text-primary" : "text-4xl text-white/20"}`}
        >
          {pos}
        </div>
      </div>
      <div
        className="h-[3px] w-full rounded-sm"
        style={{ background: color }}
      />
    </div>
  );
}

function RaceResultsTable({ results }: { results: any[] }) {
  if (!results.length)
    return <p className="p-6 text-white/40">No results available.</p>;
  return (
    <table className="w-full text-[12px]">
      <thead className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5 bg-white/[0.01]">
        <tr>
          <th className="px-4 py-3 text-left w-12">Pos</th>
          <th className="px-4 py-3 text-left">Driver</th>
          <th className="px-4 py-3 text-left hidden sm:table-cell">Team</th>
          <th className="px-4 py-3 text-center">Laps</th>
          <th className="px-4 py-3 text-right">Pts</th>
        </tr>
      </thead>
      <tbody className="text-white/80">
        {results.map((r) => (
          <tr
            key={r.driver.id}
            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
          >
            <td className="px-4 py-3 font-display text-base text-white">
              {r.pos}
            </td>
            <td className="px-4 py-3">
              <Link
                to="/driver/$driverId"
                params={{ driverId: r.driver.id }}
                className="flex items-center gap-2"
              >
                <div
                  className="h-4 w-[3px] rounded-sm"
                  style={{ background: getTeamColor(r.driver.team) }}
                />
                <span className="font-display tracking-wide">
                  {r.driver.code}
                </span>{" "}
                <span className="text-white/60">{r.driver.lastName}</span>
              </Link>
            </td>
            <td className="px-4 py-3 text-white/40 hidden sm:table-cell">
              {r.driver.team}
            </td>
            <td className="px-4 py-3 text-center font-mono relative">
              <span>{r.laps}</span>
              {!r.status?.includes("Finished") &&
                !r.status?.includes("+") &&
                !r.status?.includes("Lap") && (
                  <span className="absolute ml-1.5 text-[9px] text-yellow-500/60 font-bold whitespace-nowrap leading-none mt-1">
                    (DNF)
                  </span>
                )}
            </td>
            <td className="px-4 py-3 text-right font-display text-base text-primary">
              {r.pts}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function QualifyingTable({ qualifying }: { qualifying: any[] }) {
  if (!qualifying.length)
    return <p className="p-6 text-white/40">Data unavailable.</p>;
  return (
    <table className="w-full text-[12px]">
      <thead className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5 bg-white/[0.01]">
        <tr>
          <th className="px-4 py-3 text-left w-12">Pos</th>
          <th className="px-4 py-3 text-left">Driver</th>
          <th className="px-4 py-3 text-right">Q1</th>
          <th className="px-4 py-3 text-right">Q2</th>
          <th className="px-4 py-3 text-right">Q3</th>
        </tr>
      </thead>
      <tbody className="text-white/80">
        {qualifying.map((r) => (
          <tr key={r.driver.id} className="border-b border-white/5">
            <td className="px-4 py-3 font-display text-base text-white">
              {r.pos}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-[3px] rounded-sm"
                  style={{ background: getTeamColor(r.driver.team) }}
                />
                <span className="font-display tracking-wide">
                  {r.driver.lastName}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-right font-mono text-white/40">
              {r.q1 || "—"}
            </td>
            <td className="px-4 py-3 text-right font-mono text-white/40">
              {r.q2 || "—"}
            </td>
            <td className="px-4 py-3 text-right font-mono text-primary font-bold">
              {r.q3 || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PitstopsTable({
  pitstops,
  results,
}: {
  pitstops: any[];
  results: any[];
}) {
  if (!pitstops.length)
    return <p className="p-6 text-white/40">No results available.</p>;
  const nameMap: Record<string, string> = {};
  results.forEach((r) => (nameMap[r.driver.id] = r.driver.lastName));
  return (
    <table className="w-full text-[12px]">
      <thead className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5">
        <tr>
          <th className="px-4 py-3 text-left">Driver</th>
          <th className="px-4 py-3 text-center">Stop</th>
          <th className="px-4 py-3 text-right">Duration</th>
        </tr>
      </thead>
      <tbody className="text-white/80">
        {pitstops.map((p, i) => (
          <tr key={i} className="border-b border-white/5">
            <td className="px-4 py-3 text-white/60">
              {nameMap[p.driverId] || p.driverId}
            </td>
            <td className="px-4 py-3 text-center font-mono">{p.stop}</td>
            <td className="px-4 py-3 text-right font-mono text-primary">
              {p.duration}s
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
