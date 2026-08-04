import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getDriverDetails, getWikiSummary } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trophy, Award, Flag, Target } from "lucide-react";
import { teamColor, Team, aiInsights, getTeamColor } from "@/lib/f1-data";
import { AIInsightCard } from "@/components/AIInsightCard";
import { StatCard } from "@/components/StatCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/driver/$driverId")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `Driver Profile · APEX F1` },
        { name: "description", content: "F1 driver career stats and bio." },
      ],
    };
  },
  component: DriverPage,
});

function DriverPage() {
  const { driverId } = useParams({ from: "/driver/$driverId" });

  const { data: d, isLoading } = useQuery({
    queryKey: ["driverDetails", driverId],
    queryFn: () => getDriverDetails(driverId as string),
  });

  const { data: wiki } = useQuery({
    queryKey: ["wiki", d?.givenName, d?.familyName],
    queryFn: () => getWikiSummary(`${d?.givenName} ${d?.familyName}`),
    enabled: !!d?.familyName,
  });

  if (isLoading) return <LoadingScreen />;
  if (!d)
    return (
      <div className="p-12 text-center text-muted-foreground">
        Driver not found.
      </div>
    );

  const currentTeam = (d.currentStanding?.Constructors[0]?.name as Team) || (d.teams && d.teams[d.teams.length - 1]);
  const currentPoints = parseInt(d.currentStanding?.points || "0");
  const currentWins = parseInt(d.currentStanding?.wins || "0");

  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: `radial-gradient(ellipse at top right, ${getTeamColor(currentTeam)}, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute -right-6 top-4 font-display text-[260px] leading-none text-stroke select-none">
          {d.permanentNumber || "??"}
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <Link
            to="/drivers"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Drivers
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <span style={{ color: getTeamColor(currentTeam) }}>● </span>
            {currentTeam} · #{d.permanentNumber} · {d.nationality}
          </div>
          <div className="flex items-end gap-5 flex-wrap">
            <h1 className="font-display text-7xl md:text-9xl leading-none tracking-tighter">
              {d.givenName.toUpperCase()}{" "}
              <span className="text-primary">{d.familyName.toUpperCase()}</span>
            </h1>
            <span className="font-display text-5xl md:text-7xl mb-1 opacity-80">
              {d.nationality.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted-foreground">
            <span>
              <strong className="text-foreground">{d.code || "LEG"}</strong> Driver Code
            </span>
            {d.isActive && (
              <span>
                <strong className="text-foreground">{currentPoints}</strong> 2026 Points
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* CAREER STATS */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Career Wins"
            value={d.totalWins ?? 0}
            sub={d.isActive ? `${currentWins} this season` : "Total Wins"}
            icon={<Trophy className="h-4 w-4" />}
            accent
          />
          <StatCard
            label="Podiums"
            value={d.totalPodiums ?? 0}
            sub={d.isActive ? `${d.currentPodiums ?? 0} this season` : "Total Podiums"}
            icon={<Award className="h-4 w-4" />}
          />
          <StatCard
            label="Pole Positions"
            value={d.totalPoles ?? 0}
            sub={d.isActive ? `${d.currentPoles ?? 0} this season` : "Total Poles"}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            label="Race Starts"
            value={d.totalStarts ?? 0}
            sub="Across all seasons"
            icon={<Flag className="h-4 w-4" />}
          />
        </div>

        {!d.isActive ? (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* HISTORICAL LEGACY */}
            <div className="rounded-xl border border-border bg-surface-1 p-6">
              <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Career Legacy
              </h3>
              {wiki?.extract ? (
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {wiki.extract}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/60 italic">
                  Retrieving historical archives...
                </p>
              )}
            </div>

            {/* LEGACY BIO */}
            <div className="rounded-xl border border-border bg-surface-1 p-6">
              <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Driver Profile
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Date of Birth</span>
                  <span className="text-sm font-medium">{d.dateOfBirth}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Nationality</span>
                  <span className="text-sm font-medium">{d.nationality}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Final Team</span>
                  <span className="text-sm font-display text-foreground">{currentTeam || "Unknown"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-info">F1 Legend</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* ROW 1: PERFORMANCE & TEAMMATE */}
          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                2026 Performance — Quali vs Race
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-info" /> Qualifying
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Race
                </div>
              </div>
            </div>
            <div className="relative h-[250px] w-full overflow-hidden pt-4">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
                className="overflow-visible"
              >
                {[1, 5, 10, 15, 20].map((pos) => {
                  const y = 40 + ((pos - 1) * (200 - 80)) / 19;
                  return (
                    <line
                      key={pos}
                      x1={40}
                      y1={y}
                      x2={760}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.3"
                    />
                  );
                })}
                <path
                  d={
                    d.performance.length > 0
                      ? d.performance
                          .map((p: any, i: number) => {
                            const x =
                              40 +
                              (i * (800 - 80)) /
                                Math.max(d.performance.length - 1, 1);
                            const y =
                              40 +
                              ((Math.min(p.qualiPos || 20, 20) - 1) *
                                (200 - 80)) /
                                19;
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                          })
                          .join(" ")
                      : ""
                  }
                  fill="none"
                  stroke="var(--info)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={
                    d.performance.length > 0
                      ? d.performance
                          .map((p: any, i: number) => {
                            const x =
                              40 +
                              (i * (800 - 80)) /
                                Math.max(d.performance.length - 1, 1);
                            const y =
                              40 +
                              ((Math.min(p.racePos || 20, 20) - 1) *
                                (200 - 80)) /
                                19;
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                          })
                          .join(" ")
                      : ""
                  }
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {d.performance.map((p: any, i: number) => {
                  const x =
                    40 +
                    (i * (800 - 80)) / Math.max(d.performance.length - 1, 1);
                  const qY =
                    40 +
                    ((Math.min(p.qualiPos || 20, 20) - 1) * (200 - 80)) / 19;
                  const rY =
                    40 +
                    ((Math.min(p.racePos || 20, 20) - 1) * (200 - 80)) / 19;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={qY}
                        r="4"
                        fill="var(--info)"
                        stroke="black"
                        strokeWidth="1"
                      />
                      <circle
                        cx={x}
                        cy={rY}
                        r="4"
                        fill="var(--primary)"
                        stroke="black"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-0 left-0 flex w-full justify-between px-[35px] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {d.performance.map((p: any, i: number) => (
                  <span key={i}>{p.code}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Teammate Comparison
            </h3>
            <div className="space-y-6">
              <ComparisonBar
                label="Points"
                aValue={currentPoints}
                bValue={d.teammate?.points ?? 0}
                aCode={d.code}
                bCode={d.teammate?.code ?? "TEAM"}
              />
              <ComparisonBar
                label="Wins"
                aValue={currentWins}
                bValue={d.teammate?.wins ?? 0}
                aCode={d.code}
                bCode={d.teammate?.code ?? "TEAM"}
              />
              <ComparisonBar
                label="Podiums"
                aValue={d.currentPodiums ?? 0}
                bValue={d.teammate?.podiums ?? 0}
                aCode={d.code}
                bCode={d.teammate?.code ?? "TEAM"}
              />
              <ComparisonBar
                label="Poles"
                aValue={d.currentPoles ?? 0}
                bValue={d.teammate?.poles ?? 0}
                aCode={d.code}
                bCode={d.teammate?.code ?? "TEAM"}
              />
            </div>
          </div>

          {/* ROW 2: CAMPAIGN & BIO */}
          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              2026 Campaign Dossier
            </h3>
            <div className="grid gap-2">
              {d.performance.length > 0 ? (
                d.performance.map((p: any, i: number) => {
                  const isWin = p.racePos === 1;
                  const isPodium = p.racePos <= 3;
                  const delta = (p.qualiPos || 20) - (p.racePos || 20);

                  return (
                    <div
                      key={i}
                      className={`group flex items-center justify-between rounded-lg border border-border/40 p-3 transition-all hover:bg-surface-2 ${isWin ? "bg-primary/5 border-primary/20" : "bg-surface-1"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-2 font-display text-lg font-bold text-muted-foreground group-hover:text-foreground">
                          {p.code}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Round {i + 1}
                          </div>
                          <div className="text-sm font-medium">
                            {isWin ? (
                              <span className="text-primary">GRAND PRIX WINNER</span>
                            ) : isPodium ? (
                              <span>Podium Finish</span>
                            ) : (
                              <span>Technical Classification</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                            Quali / Race
                          </div>
                          <div className="text-sm font-display">
                            P{p.qualiPos} →{" "}
                            <span
                              className={
                                isWin
                                  ? "text-primary font-bold"
                                  : isPodium
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                              }
                            >
                              P{p.racePos}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`min-w-[45px] text-[10px] font-bold ${delta > 0 ? "text-success" : delta < 0 ? "text-destructive" : "text-muted-foreground"}`}
                        >
                          {delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[12px] italic text-muted-foreground/60">
                  No race data available for the 2026 season yet.
                </div>
              )}
            </div>
          </div>

          {/* ROW 2 - RIGHT: TECHNICAL BIO */}
          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Driver Technical Bio
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Date of Birth
                </span>
                <span className="text-sm font-medium">{d.dateOfBirth}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Age (2026)
                </span>
                <span className="text-sm font-medium">
                  {new Date().getFullYear() -
                    new Date(d.dateOfBirth).getFullYear()}{" "}
                  Yrs
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Permanent Number
                </span>
                <span className="text-sm font-display text-primary">
                  #{d.permanentNumber}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Height / Weight
                </span>
                <span className="text-sm font-medium">1.74m / 68kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  G-Force Tolerance
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-4 rounded-full ${i <= 5 ? "bg-primary" : "bg-muted-foreground/20"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* AI ANALYSIS */}
        <AIInsightCard
          title={`Career Analysis · ${d.familyName}`}
          prompt={`Write a high-depth technical career dossier about Formula 1 driver ${d.givenName} ${d.familyName}. Focus on their driving style, technical evolution, and major achievements.
          STRICT INSTRUCTIONS:
          1. Return a JSON object with a "content" key.
          2. DO NOT use any markdown formatting (no bold **, no italics _, no headers #).
          3. Total length MUST be approximately 250 words.
          4. Output ONLY the JSON.`}
        />
      </div>
    </div>
  );
}

function ComparisonBar({ label, aValue, bValue, aCode, bCode }: any) {
  const total = aValue + bValue;
  const aPct = total === 0 ? 50 : (aValue / total) * 100;
  
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>{aCode}</span>
        <span className="text-foreground">{label}</span>
        <span>{bCode}</span>
      </div>
      <div className="mb-1 flex items-center justify-between font-display text-xl">
        <div className="flex items-baseline gap-1">
          <span className="text-primary">{aValue}</span>
        </div>
        <div className="flex items-baseline gap-1 flex-row-reverse">
          <span className="text-muted-foreground/60">{bValue}</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2 flex">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: `${aPct}%` }} 
        />
        <div
          className="h-full bg-muted-foreground/30 transition-all duration-1000"
          style={{ width: `${100 - aPct}%` }}
        />
      </div>
    </div>
  );
}
