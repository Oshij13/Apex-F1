import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Flag,
  Trophy,
  Zap,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  getStandings,
  getNews,
  getConstructorStandings,
  getSeasonResults,
  getCalendar,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  teamColor,
  nextRace,
  liveRace,
  Team,
  races as mockRaces,
  countryToFlag,
  getTeamColor,
} from "@/lib/f1-data";
import { StatCard } from "@/components/StatCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { OnThisDayDialog } from "@/components/OnThisDayDialog";
import { LoadingScreen } from "@/components/LoadingScreen";

// Helper to map country names to ISO codes for FlagCDN
const countryToIso = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("bahrain")) return "bh";
  if (n.includes("saudi")) return "sa";
  if (
    n.includes("australia") ||
    n.includes("melbourne") ||
    n.includes("australian")
  )
    return "au";
  if (n.includes("japan") || n.includes("japanese")) return "jp";
  if (n.includes("china") || n.includes("chinese")) return "cn";
  if (
    n.includes("miami") ||
    n.includes("usa") ||
    n.includes("united states") ||
    n.includes("vegas") ||
    n.includes("austin") ||
    n.includes("american")
  )
    return "us";
  if (
    n.includes("italy") ||
    n.includes("imola") ||
    n.includes("monza") ||
    n.includes("emilia") ||
    n.includes("italian")
  )
    return "it";
  if (n.includes("monaco") || n.includes("monegasque")) return "mc";
  if (
    n.includes("spain") ||
    n.includes("barcelona") ||
    n.includes("catalunya") ||
    n.includes("spanish")
  )
    return "es";
  if (n.includes("canada") || n.includes("montreal") || n.includes("canadian"))
    return "ca";
  if (
    n.includes("austria") ||
    n.includes("spielberg") ||
    n.includes("austrian")
  )
    return "at";
  if (
    n.includes("britain") ||
    n.includes("uk") ||
    n.includes("united kingdom") ||
    n.includes("silverstone") ||
    n.includes("british")
  )
    return "gb";
  if (
    n.includes("hungary") ||
    n.includes("budapest") ||
    n.includes("hungarian")
  )
    return "hu";
  if (n.includes("belgium") || n.includes("spa") || n.includes("belgian"))
    return "be";
  if (
    n.includes("netherlands") ||
    n.includes("zandvoort") ||
    n.includes("dutch")
  )
    return "nl";
  if (
    n.includes("azerbaijan") ||
    n.includes("baku") ||
    n.includes("azerbaijani")
  )
    return "az";
  if (n.includes("singapore") || n.includes("singaporean")) return "sg";
  if (n.includes("mexico") || n.includes("mexican")) return "mx";
  if (
    n.includes("brazil") ||
    n.includes("são paulo") ||
    n.includes("interlagos") ||
    n.includes("brazilian")
  )
    return "br";
  if (n.includes("qatar")) return "qa";
  if (n.includes("abu dhabi") || n.includes("uae") || n.includes("emirates"))
    return "ae";
  return "";
};

const nationalityToFlag = (nat: string) => {
  const flags: Record<string, string> = {
    Italian: "🇮🇹",
    British: "🇬🇧",
    Monegasque: "🇲🇨",
    Dutch: "🇳🇱",
    Spanish: "🇪🇸",
    Mexican: "🇲🇽",
    Australian: "🇦🇺",
    French: "🇫🇷",
    German: "🇩🇪",
    Canadian: "🇨🇦",
    Japanese: "🇯🇵",
    Thai: "🇹🇭",
    Danish: "🇩🇰",
    American: "🇺🇸",
    Finnish: "🇫🇮",
    Chinese: "🇨🇳",
    Brazilian: "🇧🇷",
    "New Zealander": "🇳🇿",
  };
  return flags[nat] || "🏁";
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APEX F1 — Live Formula 1 Statistics & Race Analytics" },
      {
        name: "description",
        content:
          "Real-time F1 telemetry, 75 years of race history, AI-powered insights. The most complete Formula 1 data platform.",
      },
      {
        property: "og:title",
        content: "APEX F1 — Live Formula 1 Statistics & Race Analytics",
      },
      {
        property: "og:description",
        content:
          "Real-time F1 telemetry, 75 years of race history, AI-powered insights.",
      },
    ],
  }),
  component: HomePage,
});

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function HomePage() {
  const { data: driversData, isLoading: loadingDrivers } = useQuery({
    queryKey: ["standings"],
    queryFn: getStandings,
  });

  const { data: constructorsData, isLoading: loadingCons } = useQuery({
    queryKey: ["constructorStandings"],
    queryFn: getConstructorStandings,
  });

  const { data: racesData, isLoading: loadingRaces } = useQuery({
    queryKey: ["races", 2026],
    queryFn: () => getSeasonResults(2026),
  });

  const { data: newsData } = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
  });

  const { data: calendarData, isLoading: loadingCalendar } = useQuery({
    queryKey: ["calendar", 2026],
    queryFn: getCalendar,
  });

  const activeDrivers = driversData || [];
  // Prefer Official API Calendar data over mock
  const activeRaces = ((calendarData as any[]) || mockRaces)
    .map((m: any) => {
      const apiR = (racesData || []).find((r: any) => r.round === m.round);
      const mockR = mockRaces.find((mr: any) => mr.round === m.round);
      return {
        ...m,
        flag: countryToFlag(
          m.name || m.raceName || m.Circuit?.circuitName || "",
        ),
        iso: countryToIso(m.name || m.raceName || m.Circuit?.circuitName || ""),
        winner: apiR?.winner || mockR?.winner || m.winner || "—",
        fastestLap:
          apiR?.fastestLap || mockR?.fastestLap || m.fastestLap || "—",
        status:
          apiR?.status ||
          m.status ||
          (new Date(m.date) < new Date() ? "done" : "upcoming"),
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  const cons = constructorsData || [];

  const top10 = [...activeDrivers]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const today = new Date().toISOString();
  const recent = activeRaces
    .filter(
      (r: any) =>
        r.status === "done" || (r.date < today && r.status !== "upcoming"),
    )
    .reverse()
    .slice(0, 5);

  const upcoming = activeRaces
    .filter((r: any) => r.status === "upcoming" || r.date >= today)
    .filter((r: any) => !recent.find((rec: any) => rec.id === r.id));

  const nextR = upcoming[0] || activeRaces[activeRaces.length - 1];

  // Only show 'Live' if the race date is today or the API says it's actively live
  const isWeekend = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.abs(now.getTime() - d.getTime());
    return diff < 48 * 60 * 60 * 1000; // Within 48 hours of race date
  };

  const liveR = activeRaces.find(
    (r: any) => r.status === "live" && isWeekend(r.date),
  );

  const cd = useCountdown(nextR?.date || new Date().toISOString());

  const totalRaces = activeRaces.filter((r: any) => r.date < today).length;
  const totalWins = activeDrivers.reduce((s: number, d: any) => s + d.wins, 0);
  const totalPodiums = totalRaces * 3;

  if (loadingDrivers || loadingRaces || loadingCons || loadingCalendar) {
    return <LoadingScreen />;
  }

  return (
    <div className="pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 select-none font-display text-[280px] leading-none text-stroke">
          F1
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-5">
            <span className="live-dot" />{" "}
            {liveR
              ? `Round ${liveR.round} · ${liveR.name} underway`
              : `Round ${nextR?.round} · ${nextR?.name} coming up`}
          </div>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
            EVERY LAP.
            <br />
            <span className="text-primary">EVERY APEX.</span>
            <br />
            EVERY STORY.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
            The pro-grade Formula 1 data terminal. Live timing, 75 years of race
            history, AI-generated narratives, and analytics tools used by
            serious fans.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/live"
              className="group flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_rgba(225,6,0,0.6)]"
            >
              <span className="live-dot bg-white" /> Enter Live Race Mode
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/seasons"
              className="rounded-md border border-border bg-surface-1 px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-border hover:bg-surface-2"
            >
              Browse Archive
            </Link>
            <OnThisDayDialog />
          </div>

          <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
            {[
              { v: "75", l: "Seasons" },
              { v: "1,130+", l: "Grands Prix" },
              { v: "790+", l: "Drivers" },
              { v: "77", l: "Champions" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-5xl leading-none">{s.v}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* COUNTDOWN + LIVE STRIP */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/[0.12] to-surface-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span
                    className={
                      liveR
                        ? "live-dot"
                        : "h-2 w-2 rounded-full bg-muted-foreground/30"
                    }
                  />{" "}
                  {liveR ? "Race Ongoing" : "Latest Results"}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-7 w-12 flex items-center justify-center overflow-hidden">
                    {liveR?.iso || recent[0]?.iso ? (
                      <img
                        src={`https://flagcdn.com/w80/${(liveR?.iso || recent[0]?.iso).toLowerCase()}.png`}
                        className="h-full w-full object-contain"
                        alt="Flag"
                      />
                    ) : (
                      <span className="text-2xl">🏁</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl uppercase">
                      {liveR?.name || recent[0]?.name || "Season Archive"}
                    </h3>
                    <div className="text-[12px] text-muted-foreground">
                      {liveR?.circuit || recent[0]?.circuit || "Circuit"} ·{" "}
                      {liveR ? "Lap 42 / 52" : "Completed"}
                    </div>
                  </div>
                </div>
              </div>
              {liveR ? (
                <Link
                  to="/live"
                  className="rounded-md bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Watch Live →
                </Link>
              ) : (
                <Link
                  to="/race/$raceId"
                  params={{ raceId: recent[0] ? recent[0].id : "" }}
                  className="rounded-md bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  View Results →
                </Link>
              )}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
              <div>
                <div className="font-display text-2xl uppercase">
                  {liveR ? (
                    <Link
                      to="/driver/$driverId"
                      params={{ driverId: "norris" }}
                      className="hover:text-primary transition-colors"
                    >
                      L. Norris
                    </Link>
                  ) : (
                    (() => {
                      const winnerName = recent[0]?.winner || "—";
                      const driver = activeDrivers.find(
                        (d: any) => d.name === winnerName,
                      );
                      return driver ? (
                        <Link
                          to="/driver/$driverId"
                          params={{ driverId: driver.id }}
                          className="hover:text-primary transition-colors"
                        >
                          {winnerName}
                        </Link>
                      ) : (
                        winnerName
                      );
                    })()
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                  {liveR ? "Fastest Lap" : "Session"}
                </div>
                <div className="font-mono text-lg uppercase">
                  {liveR ? "1:27.991" : "Final"}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                  Status
                </div>
                <div
                  className={`flex items-center gap-1.5 ${liveR ? "text-positive" : "text-muted-foreground"}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${liveR ? "bg-positive" : "bg-muted-foreground/40"}`}
                  />{" "}
                  <span className="text-sm font-semibold uppercase">
                    {liveR ? "Ongoing" : "Completed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Calendar className="h-3 w-3" /> Next Race
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-6 w-10 flex items-center justify-center overflow-hidden">
                {nextR?.iso ? (
                  <img
                    src={`https://flagcdn.com/w80/${nextR.iso.toLowerCase()}.png`}
                    className="h-full w-full object-contain"
                    alt="Flag"
                  />
                ) : (
                  <span className="text-xl">🏁</span>
                )}
              </div>
              <div>
                <h3 className="font-display text-xl leading-tight uppercase">
                  {nextR?.name || "Next Grand Prix"}
                </h3>
                <div className="text-[11px] text-muted-foreground">
                  {nextR?.circuit || "TBD"}
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {[
                { v: cd.days, l: "DAYS" },
                { v: cd.hours, l: "HRS" },
                { v: cd.minutes, l: "MIN" },
                { v: cd.seconds, l: "SEC" },
              ].map((u) => (
                <div
                  key={u.l}
                  className="rounded-md bg-surface-2 py-3 text-center"
                >
                  <div className="font-display text-2xl text-primary">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {u.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Flag className="h-4 w-4" />}
            label="Races Completed"
            value={`${totalRaces}/${activeRaces.length}`}
            sub="2026 season progress"
          />
          <StatCard
            icon={<Trophy className="h-4 w-4" />}
            label="Total Race Wins"
            value={totalWins.toString()}
            sub="Across all drivers"
            accent
          />
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Podium Finishes"
            value={totalPodiums.toString()}
            sub="Driver podiums"
          />
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Championship Lead"
            value={`${top10[0]?.points - top10[1]?.points || 0} PTS`}
            sub={`${top10[0]?.lastName || "—"} over ${top10[1]?.lastName || "—"}`}
          />
        </div>

        {/* STANDINGS */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Driver Standings
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="live-dot" /> Live
              </span>
            </div>
            <div className="space-y-1">
              {top10.map((d, i) => (
                <Link
                  key={d.id}
                  to="/driver/$driverId"
                  params={{ driverId: d.id }}
                  className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-2"
                >
                  <div
                    className={`w-7 text-center font-display text-2xl ${i < 3 ? "text-primary" : "text-muted-foreground/60"}`}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="h-8 w-1 rounded-sm"
                    style={{ background: getTeamColor(d.team) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">
                      {d.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {d.team}
                    </div>
                  </div>
                  <div className="font-display text-2xl tabular-nums">
                    {d.points}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-surface-1 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Next Grand Prix · {nextR?.name || "Upcoming"}
              </div>
              <div className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                POINTS
              </div>
            </div>
            <div className="space-y-2">
              {cons.map((c: any, i: number) => {
                const max = cons[0].points;
                const pct = (c.points / max) * 100;
                return (
                  <div key={c.id} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-6 text-center font-display text-lg ${i < 3 ? "text-primary" : "text-muted-foreground/60"}`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 text-[13px] font-medium">
                        {c.name}
                      </div>
                      <div className="font-display text-xl tabular-nums">
                        {c.points}
                      </div>
                    </div>
                    <div className="ml-9 h-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: c.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RECENT RACES + CALENDAR */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Recent Results
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
              {recent.map((r: any) => (
                <Link
                  key={r.id}
                  to="/race/$raceId"
                  params={{ raceId: `2026-${r.round}-${r.id}` }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/40 p-3 transition-colors hover:border-primary/30"
                >
                  <div className="h-7 w-11 flex items-center justify-center overflow-hidden">
                    {r.iso ? (
                      <img
                        src={`https://flagcdn.com/w80/${r.iso.toLowerCase()}.png`}
                        className="h-full w-full object-contain"
                        alt="Flag"
                      />
                    ) : (
                      <span className="text-2xl">🏁</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Winner: {r.winner}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                      Fastest Lap
                    </div>
                    <div className="font-mono text-[12px] text-primary font-bold">
                      {r.fastestLap !== "—" ? r.fastestLap : ""}
                    </div>
                    {r.fastestLap === "—" && (
                      <div className="font-mono text-[12px] text-white/20">
                        --:--:--
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Upcoming Calendar
            </h3>
            <div className="space-y-1 max-h-[250px] overflow-y-auto scrollbar-hide pr-1">
              {upcoming.map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-2"
                >
                  <div className="font-mono text-[10px] font-bold text-primary w-7">
                    R{r.round}
                  </div>
                  <div className="h-5 w-8 flex items-center justify-center overflow-hidden">
                    {r.iso ? (
                      <img
                        src={`https://flagcdn.com/w80/${r.iso.toLowerCase()}.png`}
                        className="h-full w-full object-contain"
                        alt="Flag"
                      />
                    ) : (
                      <span className="text-xs">🏁</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] truncate">{r.name}</div>
                      {r.sessions?.sprint && (
                        <span className="rounded-[2px] bg-amber-500/10 px-1 py-0.5 text-[8px] font-bold uppercase tracking-tighter text-amber-500 border border-amber-500/20">
                          Sprint
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(r.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                  {r.status === "next" && (
                    <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Next
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI INSIGHT */}
        <AIInsightCard
          title="Season Strategic Analysis"
          prompt="Provide a 2-sentence expert analysis of the current 2026 F1 season momentum based on recent races."
        />
      </div>
    </div>
  );
}
