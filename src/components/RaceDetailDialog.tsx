import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Timer,
  Fuel,
  Zap,
  MapPin,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  getRaceResults,
  getQualifyingResults,
  getPitstops,
  getSprintResults,
} from "@/lib/api";
import { teamColor, Team } from "@/lib/f1-data";

interface RaceRef {
  year: number;
  round: number;
  name: string;
  circuit: string;
  date: string;
  winner?: string | null;
}

interface Props {
  race: RaceRef | null;
  open: boolean;
  onClose: () => void;
}

type Tab = "results" | "qualifying" | "pitstops" | "sprint";

export function RaceDetailDialog({ race, open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("results");

  const enabled = open && !!race;

  const { data: raceData, isLoading: loadingRace } = useQuery({
    queryKey: ["raceResults", race?.year, race?.round],
    queryFn: () => getRaceResults(race!.year, race!.round),
    enabled,
  });

  const { data: qualifying, isLoading: loadingQual } = useQuery({
    queryKey: ["qualifying", race?.year, race?.round],
    queryFn: () => getQualifyingResults(race!.year, race!.round),
    enabled,
  });

  const { data: pitstops, isLoading: loadingPits } = useQuery({
    queryKey: ["pitstops", race?.year, race?.round],
    queryFn: () => getPitstops(race!.year, race!.round),
    enabled,
  });

  const { data: sprint } = useQuery({
    queryKey: ["sprint", race?.year, race?.round],
    queryFn: () => getSprintResults(race!.year, race!.round),
    enabled,
  });

  if (!race) return null;

  const results = raceData?.results || [];
  const podium = results.slice(0, 3);
  const hasSprint = sprint && sprint.length > 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "results", label: "Race", icon: <Trophy className="h-3 w-3" /> },
    { id: "qualifying", label: "Quali", icon: <Timer className="h-3 w-3" /> },
    { id: "pitstops", label: "Pit Stops", icon: <Fuel className="h-3 w-3" /> },
    ...(hasSprint
      ? [
          {
            id: "sprint" as Tab,
            label: "Sprint",
            icon: <Zap className="h-3 w-3" />,
          },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-surface-1 border-border max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-r from-primary/[0.12] via-primary/[0.04] to-transparent px-6 pt-6 pb-5">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <DialogHeader className="relative">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
              Round {race.round} · {race.year} Season
            </div>
            <DialogTitle className="font-display text-3xl md:text-4xl leading-none mb-1">
              {race.name}
            </DialogTitle>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {race.circuit} ·{" "}
              {new Date(race.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </DialogHeader>
        </div>

        {/* PODIUM (always visible) */}
        {loadingRace ? (
          <div className="flex items-center justify-center gap-3 py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Fetching Race Data...
            </span>
          </div>
        ) : podium.length > 0 ? (
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-end gap-2 max-w-xs mx-auto">
              <PodStep d={podium[1]} pos={2} h="h-16" />
              <PodStep d={podium[0]} pos={1} h="h-24" winner />
              <PodStep d={podium[2]} pos={3} h="h-12" />
            </div>
          </div>
        ) : null}

        {/* TABS */}
        <div className="border-b border-border px-6">
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {tab === "results" && (
            <ResultsTab results={results} loading={loadingRace} />
          )}
          {tab === "qualifying" && (
            <QualifyingTab
              qualifying={qualifying || []}
              loading={loadingQual}
            />
          )}
          {tab === "pitstops" && (
            <PitstopsTab
              pitstops={pitstops || []}
              results={results}
              loading={loadingPits}
            />
          )}
          {tab === "sprint" && hasSprint && <SprintTab sprint={sprint} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── PODIUM STEP ─────────────────────────────────────────────────────────────
function PodStep({
  d,
  pos,
  h,
  winner,
}: {
  d: any;
  pos: number;
  h: string;
  winner?: boolean;
}) {
  if (!d) return null;
  const color = teamColor[d.driver.team as Team] || "var(--muted)";
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="text-[11px] font-bold text-foreground">
        {d.driver.code}
      </div>
      <div className="text-[9px] text-muted-foreground truncate max-w-full">
        {d.driver.team}
      </div>
      <div
        className={`w-full ${h} rounded-t flex items-center justify-center border ${
          winner
            ? "border-primary/40 bg-primary/10"
            : "border-border bg-surface-2"
        }`}
        style={winner ? { boxShadow: `0 0 20px ${color}30` } : {}}
      >
        <div
          className={`font-display ${winner ? "text-4xl text-primary" : "text-2xl text-muted-foreground"}`}
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

// ─── RESULTS TAB ─────────────────────────────────────────────────────────────
function ResultsTab({
  results,
  loading,
}: {
  results: any[];
  loading: boolean;
}) {
  if (loading) return <TabLoader />;
  if (!results.length) return <TabEmpty msg="Race results unavailable." />;
  return (
    <table className="w-full text-[12px]">
      <thead className="sticky top-0 bg-surface-1 border-b border-border">
        <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="px-4 py-2.5 text-left w-10">Pos</th>
          <th className="px-4 py-2.5 text-left">Driver</th>
          <th className="px-4 py-2.5 text-left hidden sm:table-cell">Team</th>
          <th className="px-4 py-2.5 text-center hidden md:table-cell">Grid</th>
          <th className="px-4 py-2.5 text-center">Laps</th>
          <th className="px-4 py-2.5 text-right hidden md:table-cell">
            Time / Status
          </th>
          <th className="px-4 py-2.5 text-right">Pts</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => {
          const color = teamColor[r.driver.team as Team] || "var(--muted)";
          const isFastest = r.fastestLap?.rank === "1";
          return (
            <tr
              key={r.driver.id}
              className="border-b border-border/50 hover:bg-surface-2/40 transition-colors"
            >
              <td className="px-4 py-2.5 font-display text-base">{r.pos}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-[3px] rounded-sm flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="font-display tracking-wide">
                    {r.driver.code}
                  </span>
                  <span className="text-muted-foreground">
                    {r.driver.lastName}
                  </span>
                  {isFastest && (
                    <span className="text-[9px] font-bold text-purple-400 border border-purple-400/40 rounded px-1">
                      FL
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">
                {r.driver.team}
              </td>
              <td className="px-4 py-2.5 text-center text-muted-foreground hidden md:table-cell">
                {r.grid === 0 ? "PL" : r.grid}
              </td>
              <td className="px-4 py-2.5 text-center font-mono">{r.laps}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground hidden md:table-cell">
                {r.time || r.status}
              </td>
              <td className="px-4 py-2.5 text-right font-display text-base">
                {r.pts > 0 ? (
                  r.pts
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── QUALIFYING TAB ───────────────────────────────────────────────────────────
function QualifyingTab({
  qualifying,
  loading,
}: {
  qualifying: any[];
  loading: boolean;
}) {
  if (loading) return <TabLoader />;
  if (!qualifying.length)
    return <TabEmpty msg="Qualifying data not available." />;
  return (
    <table className="w-full text-[12px]">
      <thead className="sticky top-0 bg-surface-1 border-b border-border">
        <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="px-4 py-2.5 text-left w-10">Pos</th>
          <th className="px-4 py-2.5 text-left">Driver</th>
          <th className="px-4 py-2.5 text-right font-mono">Q1</th>
          <th className="px-4 py-2.5 text-right font-mono hidden sm:table-cell">
            Q2
          </th>
          <th className="px-4 py-2.5 text-right font-mono hidden md:table-cell">
            Q3
          </th>
        </tr>
      </thead>
      <tbody>
        {qualifying.map((r) => {
          const color = teamColor[r.driver.team as Team] || "var(--muted)";
          return (
            <tr
              key={r.driver.id}
              className="border-b border-border/50 hover:bg-surface-2/40 transition-colors"
            >
              <td className="px-4 py-2.5 font-display text-base">{r.pos}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-[3px] rounded-sm flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="font-display tracking-wide">
                    {r.driver.code}
                  </span>
                  <span className="text-muted-foreground">
                    {r.driver.lastName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                {r.q1 || <span className="text-border">—</span>}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground hidden sm:table-cell">
                {r.q2 || <span className="text-border">—</span>}
              </td>
              <td className="px-4 py-2.5 text-right font-mono hidden md:table-cell">
                {r.q3 ? (
                  <span className="text-primary font-bold">{r.q3}</span>
                ) : (
                  <span className="text-border">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── PITSTOPS TAB ─────────────────────────────────────────────────────────────
function PitstopsTab({
  pitstops,
  results,
  loading,
}: {
  pitstops: any[];
  results: any[];
  loading: boolean;
}) {
  if (loading) return <TabLoader />;
  if (!pitstops.length) return <TabEmpty msg="Pit stop data not available." />;

  // Group by driver, find driver names from results
  const driverMap: Record<string, string> = {};
  const teamMap: Record<string, string> = {};
  results.forEach((r) => {
    driverMap[r.driver.id] = `${r.driver.code} ${r.driver.lastName}`;
    teamMap[r.driver.id] = r.driver.team;
  });

  // Sort by lap
  const sorted = [...pitstops].sort((a, b) => a.lap - b.lap);

  return (
    <table className="w-full text-[12px]">
      <thead className="sticky top-0 bg-surface-1 border-b border-border">
        <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="px-4 py-2.5 text-left">Driver</th>
          <th className="px-4 py-2.5 text-center">Stop #</th>
          <th className="px-4 py-2.5 text-center">Lap</th>
          <th className="px-4 py-2.5 text-right">Time of Day</th>
          <th className="px-4 py-2.5 text-right">Duration</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((p, i) => {
          const color =
            teamColor[teamMap[p.driverId] as Team] || "var(--muted)";
          const isFast = parseFloat(p.duration) < 25;
          return (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-surface-2/40 transition-colors"
            >
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-[3px] rounded-sm flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-muted-foreground">
                    <Link
                      to="/driver/$driverId"
                      params={{ driverId: p.driverId }}
                      className="hover:underline"
                    >
                      {driverMap[p.driverId] || p.driverId}
                    </Link>
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-center font-mono">{p.stop}</td>
              <td className="px-4 py-2.5 text-center font-mono">{p.lap}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                {p.time}
              </td>
              <td className="px-4 py-2.5 text-right font-mono">
                <span
                  className={
                    isFast ? "text-green-400 font-bold" : "text-foreground"
                  }
                >
                  {p.duration}s
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── SPRINT TAB ───────────────────────────────────────────────────────────────
function SprintTab({ sprint }: { sprint: any[] }) {
  if (!sprint?.length) return <TabEmpty msg="Sprint data unavailable." />;
  return (
    <table className="w-full text-[12px]">
      <thead className="sticky top-0 bg-surface-1 border-b border-border">
        <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="px-4 py-2.5 text-left w-10">Pos</th>
          <th className="px-4 py-2.5 text-left">Driver</th>
          <th className="px-4 py-2.5 text-center">Laps</th>
          <th className="px-4 py-2.5 text-right">Time</th>
          <th className="px-4 py-2.5 text-right">Pts</th>
        </tr>
      </thead>
      <tbody>
        {sprint.map((r) => {
          const color = teamColor[r.driver.team as Team] || "var(--muted)";
          return (
            <tr
              key={r.driver.id}
              className="border-b border-border/50 hover:bg-surface-2/40 transition-colors"
            >
              <td className="px-4 py-2.5 font-display text-base">{r.pos}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-[3px] rounded-sm"
                    style={{ background: color }}
                  />
                  <span className="font-display tracking-wide">
                    {r.driver.code}
                  </span>
                  <span className="text-muted-foreground">
                    {r.driver.lastName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-center font-mono">{r.laps}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                {r.time}
              </td>
              <td className="px-4 py-2.5 text-right font-display text-base">
                {r.pts > 0 ? (
                  r.pts
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function TabLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Loading...
      </span>
    </div>
  );
}

function TabEmpty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
      <ChevronRight className="h-6 w-6 text-muted-foreground/40" />
      <p className="text-[12px] text-muted-foreground">{msg}</p>
    </div>
  );
}
