import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getConstructorStandings, getStandings } from "@/lib/api";
import { getTeamColor } from "@/lib/f1-data";
import { teamDetails } from "@/lib/team-data";
import { useState } from "react";
import { 
  Trophy, 
  Users, 
  Zap, 
  Target, 
  Globe, 
  HardHat, 
  History, 
  Wallet,
  Sparkles,
  ChevronLeft,
  ArrowUpRight,
  Award
} from "lucide-react";

export const Route = createFileRoute("/team/$teamId")({
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { teamId } = Route.useParams();
  const [viewMode, setViewMode] = useState<"2026" | "all-time">("2026");

  const { data: constructors } = useQuery({
    queryKey: ["constructorStandings"],
    queryFn: getConstructorStandings,
  });

  const { data: allDrivers } = useQuery({
    queryKey: ["standings"],
    queryFn: getStandings,
  });

  const detail = teamDetails[teamId.toLowerCase()];
  if (!detail) return <div className="p-20 text-center">Team Intelligence Not Found.</div>;

  const currentStats = constructors?.find((c: any) => c.id.toLowerCase() === teamId.toLowerCase());
  const currentDrivers = allDrivers?.filter((d: any) => d.team.toLowerCase().includes(detail.name.toLowerCase())) || [];
  const color = getTeamColor(detail.name);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 pb-20">
      <Link 
        to="/teams" 
        className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-white"
      >
        <ChevronLeft size={14} /> Back to Constructors
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-1 p-8 md:p-12">
        {/* Abstract Background Elements */}
        <div 
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-[0.05] blur-3xl"
          style={{ background: color }}
        />
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <History size={300} />
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-1.5 rounded-full" style={{ background: color }} />
                <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                  {detail.name}
                </h1>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.3em]">
                {detail.fullTitle}
              </p>
            </div>

            <div className="flex bg-surface-2 p-1 rounded-xl border border-border">
              <button
                onClick={() => setViewMode("2026")}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "2026" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                }`}
              >
                2026 Season
              </button>
              <button
                onClick={() => setViewMode("all-time")}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "all-time" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                }`}
              >
                All-Time Legacy
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* CORE STATS CARD */}
            <div className="col-span-full grid gap-4 md:grid-cols-4">
              <StatCard 
                label={viewMode === "2026" ? "Points" : "Wins"} 
                value={viewMode === "2026" ? (currentStats?.points || 0) : detail.allTime.wins} 
                icon={<Trophy className="text-primary" />}
              />
              <StatCard 
                label={viewMode === "2026" ? "Standings Rank" : "World Titles"} 
                value={viewMode === "2026" ? `#${constructors?.findIndex((c: any) => c.id === currentStats?.id) + 1 || "-"}` : detail.allTime.titles} 
                icon={<Award className="text-primary" />}
              />
              <StatCard 
                label="Budget Tier" 
                value={viewMode === "2026" ? detail.budget2026 : detail.allTime.budgetScale} 
                icon={<Wallet className="text-primary" />}
              />
              <StatCard 
                label="Power Unit" 
                value={detail.powerUnit} 
                icon={<Zap className="text-primary" />}
              />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="md:col-span-2 space-y-6">
              {/* DRIVERS SECTION */}
              <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                    <Users size={16} className="text-primary" /> {viewMode === "2026" ? "Active Lineup" : "Hall of Fame Drivers"}
                  </h3>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {viewMode === "2026" ? (
                    currentDrivers.map((d: any) => (
                      <Link
                        key={d.id}
                        to="/driver/$driverId"
                        params={{ driverId: d.id }}
                        className="group flex items-center justify-between rounded-xl border border-border bg-surface-1 p-4 transition-all hover:border-primary/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{d.flag}</span>
                          <div>
                            <div className="text-[13px] font-bold group-hover:text-primary transition-colors">{d.name}</div>
                            <div className="text-[9px] text-muted-foreground uppercase">Points: {d.points}</div>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  ) : (
                    detail.allTime.famousDrivers.map((d) => (
                      <div key={d.name} className="flex items-center justify-between rounded-xl border border-border bg-surface-1 p-4">
                        <div>
                          <div className="text-[13px] font-bold">{d.name}</div>
                          <div className="text-[9px] text-muted-foreground uppercase">{d.years}</div>
                        </div>
                        <Target size={14} className="text-primary opacity-20" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TECHNICAL INFO */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    <Globe size={16} className="text-primary" /> Operations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Base Location</div>
                      <div className="text-sm font-medium">{detail.base}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Team Principal</div>
                      <div className="text-sm font-medium">{detail.chief}</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    <HardHat size={16} className="text-primary" /> Technical Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Established</div>
                      <div className="text-sm font-medium">{detail.established}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Championship Wins</div>
                      <div className="text-sm font-medium">{detail.allTime.wins} Grand Prix</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Podiums</div>
                      <div className="text-sm font-medium">{detail.allTime.podiums} Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR / INSIGHTS */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Sparkles size={100} />
                </div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-4 text-primary">
                  <Sparkles size={16} /> AI Synthetic Insight
                </h3>
                <p className="text-sm leading-relaxed text-white/80 font-medium italic">
                  {viewMode === "all-time" 
                    ? detail.allTime.aiInsight 
                    : `${detail.name}'s 2026 performance indicators show a ${currentStats?.points > 400 ? "dominant" : "developing"} technical profile. With a points-per-race efficiency of ${Math.round((currentStats?.points || 0) / 11)}, they are currently operating at a Tier-1 capacity in terms of aerodynamic resource allocation.`}
                </p>
              </div>

              {/* ALL TIME TROPHY COUNTER */}
              <div className="rounded-2xl border border-border bg-surface-1 p-6 text-center">
                <div className="flex justify-center gap-8 mb-4">
                  <div>
                    <div className="text-3xl font-display text-primary">{detail.allTime.titles}</div>
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Constructors</div>
                  </div>
                  <div className="h-10 w-[1px] bg-border self-center" />
                  <div>
                    <div className="text-3xl font-display text-primary">{detail.allTime.driverTitles}</div>
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Drivers</div>
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-widest pt-4 border-t border-border">
                  Legacy Achievements
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2/40 p-5 transition-all hover:border-primary/20 hover:bg-surface-3/40">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {icon} {label}
      </div>
      <div className="font-display text-3xl text-white">{value}</div>
    </div>
  );
}
