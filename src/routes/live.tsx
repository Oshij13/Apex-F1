import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLiveTiming, getWeather, getCalendar, getStatuses } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { teamColor, Team, aiInsights } from "@/lib/f1-data";
import { TireBadge } from "@/components/TireBadge";
import { PositionDelta } from "@/components/PositionDelta";
import { AIInsightCard } from "@/components/AIInsightCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import {
  Activity,
  Cloud,
  Flag,
  Gauge,
  Thermometer,
  Wind,
  Calendar as CalendarIcon,
  Timer,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Race Intelligence · APEX F1" },
      {
        name: "description",
        content:
          "Real-time F1 telemetry, sector splits, and AI strategy insights.",
      },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: calendar } = useQuery({
    queryKey: ["calendar"],
    queryFn: getCalendar,
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const liveRace = calendar?.find((r: any) => r.status === "live");
  const nextRace =
    calendar?.find((r: any) => new Date(r.date) > now) || calendar?.[0];
  const displayRace = liveRace || nextRace;

  const { data: timing, isLoading: loadingTiming } = useQuery({
    queryKey: ["liveTiming"],
    queryFn: getLiveTiming,
    refetchInterval: 2000,
    enabled: !!liveRace,
    retry: 1,
  });

  const { data: weather } = useQuery({
    queryKey: ["weather"],
    queryFn: getWeather,
    refetchInterval: 30000,
    enabled: !!liveRace,
  });

  if (loadingTiming) return <LoadingScreen />;

  const formatIST = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(dateStr));
    } catch (e) {
      return null;
    }
  };

  const sessions = displayRace?.sessions || {};

  if (!liveRace) {
    return (
      <div className="pb-20">
        {/* NEXT RACE COUNTDOWN */}
        <div className="border-b border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-md bg-primary/15 px-2.5 py-1">
                <Timer className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Upcoming
                </span>
              </div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                Next Event: {displayRace?.name}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter md:text-8xl leading-none text-white mb-4">
                  {(displayRace?.name || "").replace("Grand Prix", "")}
                  <span className="block text-primary">Grand Prix</span>
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <Flag className="h-4 w-4" /> {displayRace?.circuit}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Enter Race Hub button removed */}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            {/* WEEKEND SCHEDULE IST */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl uppercase tracking-tight">
                  Weekend Schedule{" "}
                  <span className="text-muted-foreground text-[12px] font-bold ml-2">
                    (IST)
                  </span>
                </h2>
              </div>

              <div className="grid gap-2">
                <ScheduleRow
                  label="Practice 1"
                  time={formatIST(sessions.fp1)}
                />
                {sessions.sprint ? (
                  <>
                    <ScheduleRow
                      label="Sprint Quali"
                      time={formatIST(sessions.sprintQualifying)}
                    />
                    <ScheduleRow
                      label="Sprint Race"
                      time={formatIST(sessions.sprint)}
                      highlight
                    />
                  </>
                ) : (
                  <>
                    <ScheduleRow
                      label="Practice 2"
                      time={formatIST(sessions.fp2)}
                    />
                    <ScheduleRow
                      label="Practice 3"
                      time={formatIST(sessions.fp3)}
                    />
                  </>
                )}
                <ScheduleRow
                  label="Qualifying"
                  time={formatIST(sessions.qualifying)}
                />
                <ScheduleRow
                  label="Grand Prix"
                  time={formatIST(sessions.gp)}
                  highlight
                />
              </div>

              <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
                <p className="text-muted-foreground text-[13px] mb-4">
                  For in-depth strategic analysis and technical track
                  specifications:
                </p>
                <Link
                  to="/race/$raceId"
                  params={{ raceId: displayRace?.id }}
                  className="text-primary font-bold uppercase tracking-widest text-[12px] hover:underline flex items-center justify-center gap-2"
                >
                  Go to this page for full intelligence{" "}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              <AIInsightCard
                title="Race Intelligence Preview"
                prompt={`Provide a brief strategic preview for the upcoming ${displayRace?.name}. Focus on the unique challenges of the ${displayRace?.circuit} in 3 sentences.`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live content remains below...
  const leaderboard = timing?.drivers || timing || [];
  const sessionInfo = timing?.sessionInfo || {};
  const lap = sessionInfo.lap || 42;
  const totalLaps = sessionInfo.totalLaps || 52;

  return (
    <div className="pb-12">
      {/* RACE CONTROL HEADER */}
      <div className="border-b border-border bg-surface-1">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-primary/15 px-2.5 py-1">
              <span className="live-dot" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Live
              </span>
            </div>
            <span className="text-2xl">🏁</span>
            <div>
              <div className="font-display text-xl leading-none">
                {liveRace?.name || "Grand Prix"}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {liveRace?.circuit || "Circuit"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto text-[12px]">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Lap
              </div>
              <div className="font-display text-2xl tabular-nums">
                <span className="text-primary">{lap}</span>
                <span className="text-muted-foreground/50">/{totalLaps}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 rounded-md border border-positive/30 bg-positive/10 px-2.5 py-1">
              <Flag className="h-3 w-3 text-positive" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-positive">
                Track Clear
              </span>
            </div>
            <div className="hidden lg:block font-mono text-[12px] text-muted-foreground tabular-nums">
              {now.toLocaleTimeString("en-GB", { hour12: false })} UTC
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-surface-2 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000"
            style={{ width: `${(lap / totalLaps) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] grid gap-4 px-5 pt-5 lg:grid-cols-[1fr_360px]">
        {/* TIMING TOWER */}
        <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2/50 px-4 py-2.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Timing Tower
            </h3>
            <span className="ml-auto text-[10px] uppercase text-muted-foreground tracking-wider">
              {sessionInfo.status || "Live Feed"}
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[12px]">
              <thead className="bg-surface-2/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-2 py-2 w-10 text-center">Pos</th>
                  <th className="px-2 py-2 w-8"></th>
                  <th className="px-2 py-2 text-left">Driver</th>
                  <th className="px-2 py-2 text-right">Gap</th>
                  <th className="px-2 py-2 text-right hidden md:table-cell">
                    Last Lap
                  </th>
                  <th className="px-1 py-2 text-center hidden lg:table-cell">
                    S1
                  </th>
                  <th className="px-1 py-2 text-center hidden lg:table-cell">
                    S2
                  </th>
                  <th className="px-1 py-2 text-center hidden lg:table-cell">
                    S3
                  </th>
                  <th className="px-2 py-2 text-center">Tire</th>
                  <th className="px-2 py-2 text-center">DRS</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((d: any, i: number) => (
                  <tr
                    key={d.driverId || i}
                    className="border-b border-border/50 hover:bg-surface-2/40"
                  >
                    <td className="px-2 py-2 text-center font-display text-lg">
                      {d.position || i + 1}
                    </td>
                    <td className="px-1 py-2">
                      <PositionDelta
                        pos={d.position || i + 1}
                        prev={d.prevPosition || i + 1}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-[3px] rounded-sm"
                          style={{
                            background:
                              teamColor[d.teamName as Team] || "var(--muted)",
                          }}
                        />
                        <Link
                          to="/driver/$driverId"
                          params={{ driverId: d.driverId || d.id }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <div className="font-display text-[14px]">
                            {d.driverName || d.lastName || "Driver"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {d.teamName || d.team}
                          </div>
                        </Link>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-[12px]">
                      {d.gap ||
                        (i === 0 ? "LEADER" : `+${(i * 1.5).toFixed(3)}s`)}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-[12px] hidden md:table-cell">
                      {d.lastLapTime || "--"}
                    </td>
                    <td className="px-1 py-2 text-center font-mono text-[11px] hidden lg:table-cell text-muted-foreground">
                      {d.s1 || "--"}
                    </td>
                    <td className="px-1 py-2 text-center font-mono text-[11px] hidden lg:table-cell text-muted-foreground">
                      {d.s2 || "--"}
                    </td>
                    <td className="px-1 py-2 text-center font-mono text-[11px] hidden lg:table-cell text-muted-foreground">
                      {d.s3 || "--"}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center">
                        <TireBadge
                          compound={d.tireCompound || "S"}
                          age={d.tireAge || 0}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {d.drsActive ? (
                        <span className="rounded bg-positive/20 px-1.5 py-0.5 text-[9px] font-bold text-positive">
                          DRS
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    {/* STATUS */}
                    <td className="px-2 py-2 text-center">
                      <div className="w-[100px] text-[10px] uppercase font-bold tracking-tighter">
                        {d.status === "running" || d.status === "Finished" ? (
                          <span className="text-positive">Running</span>
                        ) : (
                          <span className="text-destructive">
                            {d.status || "Out"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface-1 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Cloud className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Conditions
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Cond
                icon={<Thermometer className="h-3 w-3" />}
                label="Air"
                value={`${weather?.air_temp || "22"}°C`}
              />
              <Cond
                icon={<Thermometer className="h-3 w-3 text-primary" />}
                label="Track"
                value={`${weather?.track_temp || "34"}°C`}
              />
              <Cond
                icon={<Wind className="h-3 w-3" />}
                label="Wind"
                value={`${weather?.wind_speed || "12"} km/h`}
              />
              <Cond
                icon={<Cloud className="h-3 w-3" />}
                label="Humidity"
                value={`${weather?.humidity || "45"}%`}
              />
            </div>
          </div>

          <AIInsightCard
            title="Live Strategy Read"
            prompt={`Analyze the live situation of the ${liveRace?.name || "current"} Grand Prix. Based on the current timing data, what is the most critical strategic battle?`}
          />
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({
  label,
  time,
  highlight,
}: {
  label: string;
  time: string | null;
  highlight?: boolean;
}) {
  const isScheduled = !!time;
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3.5 transition-all ${highlight && isScheduled ? "bg-primary/5 border-primary/20" : "bg-surface-1/50 border-border/50"}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`h-2 w-2 rounded-full ${highlight && isScheduled ? "bg-primary animate-pulse" : isScheduled ? "bg-muted-foreground/50" : "bg-muted-foreground/10"}`}
        />
        <span
          className={`text-[12px] font-bold uppercase tracking-widest ${isScheduled ? (highlight ? "text-white" : "text-muted-foreground") : "text-muted-foreground/30"}`}
        >
          {label}
        </span>
      </div>
      <div
        className={`font-mono text-[13px] ${isScheduled ? "text-primary" : "text-muted-foreground/20 italic"}`}
      >
        {time || "Not Scheduled"}
      </div>
    </div>
  );
}

function Cond({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-surface-2/40 p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-mono text-[14px] font-semibold">{value}</div>
    </div>
  );
}
