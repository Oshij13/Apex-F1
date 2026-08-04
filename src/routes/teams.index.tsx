import { createFileRoute, Link } from "@tanstack/react-router";
import { getConstructorStandings, getStandings } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getTeamColor } from "@/lib/f1-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Trophy, Users, Zap, Award } from "lucide-react";

export const Route = createFileRoute("/teams/")({
  head: () => ({
    meta: [
      { title: "Teams 2026 · APEX F1" },
      {
        name: "description",
        content:
          "Explore the 2026 Formula 1 grid. Official constructor standings, driver lineups, and performance data.",
      },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { data: constructors, isLoading: loadingCons } = useQuery({
    queryKey: ["constructorStandings"],
    queryFn: getConstructorStandings,
  });

  const { data: drivers } = useQuery({
    queryKey: ["standings"],
    queryFn: getStandings,
  });

  if (loadingCons) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 pb-20">
        <SectionHeader eyebrow="The Constructors" title="2026 Grid" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-surface-1 border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 pb-20">
      <SectionHeader eyebrow="World Championship" title="The Constructors" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {constructors?.map((c: any, i: number) => {
          const teamDrivers =
            drivers?.filter((d: any) => d.team.includes(c.name)) || [];
          const color = getTeamColor(c.name);

          return (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-1 p-6 transition-all hover:border-primary/30"
            >
              {/* Background Glow */}
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.03] transition-opacity group-hover:opacity-[0.07] blur-3xl"
                style={{ background: color }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ background: color }}
                    />
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wide leading-none">
                        {c.name}
                      </h3>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                        Rank #{i + 1}
                      </div>
                    </div>
                  </div>
                  <div className="font-display text-4xl text-primary tabular-nums">
                    {c.points}
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-1">
                      Pts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-xl border border-border bg-surface-2/40 p-3">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      <Trophy className="h-3 w-3" /> Wins
                    </div>
                    <div className="font-display text-2xl">{c.wins}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-2/40 p-3">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" /> Efficiency
                    </div>
                    <div className="font-display text-2xl text-primary">
                      {Math.round(
                        (c.points / (constructors[0].points || 1)) * 100,
                      )}
                      %
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="h-3 w-3" /> Driver Lineup
                  </div>
                  <div className="flex flex-col gap-2">
                    {teamDrivers.map((d: any) => (
                      <Link
                        key={d.id}
                        to="/driver/$driverId"
                        params={{ driverId: d.id }}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2 transition-colors hover:border-primary/40 hover:bg-surface-3/40"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] opacity-70">
                            {d.flag}
                          </span>
                          <span className="text-[13px] font-medium">
                            {d.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-primary">
                          #{d.number}
                        </span>
                      </Link>
                    ))}
                    {teamDrivers.length === 0 && (
                      <div className="text-[11px] text-muted-foreground italic px-3 py-2 border border-dashed border-border rounded-lg">
                        Lineup data loading...
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-[14px] font-bold">75</div>
                      <div className="text-[8px] uppercase text-muted-foreground">
                        Podiums
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-bold">12</div>
                      <div className="text-[8px] uppercase text-muted-foreground">
                        Titles
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/team/$teamId"
                    params={{ teamId: c.id }}
                    className="rounded-md bg-surface-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-primary hover:bg-surface-3 transition-all"
                  >
                    Details ›
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
