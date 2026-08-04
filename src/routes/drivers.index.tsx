import { createFileRoute, Link } from "@tanstack/react-router";
import { getStandings } from "@/lib/api";
import { searchDriversAI } from "@/lib/ai-search";
import { useQuery } from "@tanstack/react-query";
import { teamColor, Team, getTeamColor } from "@/lib/f1-data";
import { historicalPrincipals } from "@/lib/principal-data";
import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";
import { Search, History, Users } from "lucide-react";

export const Route = createFileRoute("/drivers/")({
  head: () => ({
    meta: [
      { title: "Drivers Archive · APEX F1" },
      {
        name: "description",
        content:
          "Browse all Formula 1 drivers from 1950 to current. Explore stats, teams, and career data.",
      },
    ],
  }),
  component: DriversList,
});

function DriversList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: drivers, isLoading: loadingActive } = useQuery({
    queryKey: ["standings"],
    queryFn: getStandings,
  });

  const { data: historical, isLoading: loadingHistorical } = useQuery({
    queryKey: ["searchDriversAI", searchTerm],
    queryFn: () => searchDriversAI(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const activeDrivers = drivers || [];
  const filteredActive = activeDrivers.filter((d: any) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchedPrincipals = searchTerm.length > 2 
    ? historicalPrincipals.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.team.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 pb-20">
      <SectionHeader title="Repository" />

      {/* SEARCH BAR */}
      <div className="relative mb-12 max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors ${searchTerm ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <input
          type="text"
          placeholder="Search legends or current grid..."
          className="w-full bg-surface-1 border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300 ${searchTerm ? 'opacity-100 text-primary' : 'opacity-40 text-muted-foreground'}`}>
          {searchTerm ? 'Archive Query' : 'Global Archive'}
        </div>
      </div>

      {/* ACTIVE GRID */}
      {!searchTerm || filteredActive.length > 0 ? (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <Users className="h-3 w-3" /> 2026 World Championship Grid
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(searchTerm ? filteredActive : activeDrivers).map((d: any, i: number) => (
              <DriverCard key={d.id} d={d} index={i} />
            ))}
          </div>
        </section>
      ) : null}

      {/* TECHNICAL LEADERSHIP (THE TECHNICIANS) */}
      {!searchTerm && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-info">
            <Search className="h-3 w-3" /> Technical Leadership · Team Principals
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { name: "Jonathan Wheatley", role: "Team Principal", team: "Red Bull", id: "red_bull" },
              { name: "Toto Wolff", role: "CEO & Team Principal", team: "Mercedes", id: "mercedes" },
              { name: "Fred Vasseur", role: "General Manager", team: "Ferrari", id: "ferrari" },
              { name: "Andrea Stella", role: "Team Principal", team: "McLaren", id: "mclaren" },
              { name: "Mike Krack", role: "Team Principal", team: "Aston Martin", id: "aston_martin" },
              { name: "James Vowles", role: "Team Principal", team: "Williams", id: "williams" },
              { name: "Oliver Oakes", role: "Team Principal", team: "Alpine", id: "alpine" },
              { name: "Ayao Komatsu", role: "Team Principal", team: "Haas", id: "haas" },
              { name: "Laurent Mekies", role: "Team Principal", team: "RB", id: "racing_bulls" },
              { name: "Mattia Binotto", role: "COO & CTO", team: "Audi", id: "audi" },
              { name: "Michael Andretti", role: "Team Principal", team: "Cadillac", id: "cadillac" },
            ].map((t) => (
              <Link
                key={t.id}
                to="/principal/$teamId"
                params={{ teamId: t.id }}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface-1/40 p-4 transition-all hover:bg-surface-1 hover:border-primary/30"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{t.role}</div>
                <div className="font-display text-xl group-hover:text-primary transition-colors">{t.name.toUpperCase()}</div>
                <div className="text-[11px] text-muted-foreground mt-1" style={{ color: getTeamColor(t.team) }}>{t.team}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* STRATEGIC RESERVES (SUPPORT GRID) */}
      {!searchTerm && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-success">
            <Users className="h-3 w-3" /> Strategic Reserves · Development Grid
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { name: "Oliver Bearman", role: "Reserve Driver", team: "Haas / Ferrari", id: "bearman" },
              { name: "Liam Lawson", role: "Reserve Driver", team: "Red Bull / RB", id: "lawson" },
              { name: "Felipe Drugovich", role: "Test Driver", team: "Aston Martin", id: "drugovich" },
              { name: "Zak O'Sullivan", role: "Academy Driver", team: "Williams", id: "osullivan" },
            ].map((r) => (
              <div key={r.name} className="group relative overflow-hidden rounded-xl border border-border bg-surface-1/40 p-4 transition-all hover:bg-surface-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-success mb-1">{r.role}</div>
                <div className="font-display text-xl">{r.name.toUpperCase()}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{r.team}</div>
                <div className="mt-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Ready for Deployment</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HISTORICAL PRINCIPALS (LEGENDS OF THE PIT WALL) */}
      {!searchTerm && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <History className="h-3 w-3" /> Legends of the Pit Wall · Historical Principals
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {historicalPrincipals.map((p) => (
              <Link key={p.id} to="/principal/$teamId" params={{ teamId: p.id }} className="group relative overflow-hidden rounded-xl border border-border bg-surface-1/40 p-4 transition-all hover:bg-surface-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{p.role}</div>
                <div className="font-display text-xl group-hover:text-primary transition-colors">{p.name.toUpperCase()}</div>
                <div className="text-[11px] text-muted-foreground mt-1" style={{ color: getTeamColor(p.team) }}>{p.team} · {p.nationality}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* HISTORICAL ARCHIVE */}
      {searchTerm.length > 2 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <History className="h-3 w-3" /> Archive Results
          </div>
          {loadingHistorical ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-surface-1/50 border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : ((historical?.length || 0) > 0 || matchedPrincipals.length > 0) ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {matchedPrincipals.map((p) => (
                <Link
                  key={p.id}
                  to="/principal/$teamId"
                  params={{ teamId: p.id }}
                  className="group relative overflow-hidden rounded-xl border border-border/40 bg-surface-1/50 p-4 transition-all hover:border-primary/30 hover:bg-surface-1"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{p.role}</div>
                  <div className="font-display text-xl mb-1 group-hover:text-primary transition-colors">
                    {p.name.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-3" style={{ color: getTeamColor(p.team) }}>
                    {p.team} · {p.nationality}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Historical Principal
                  </div>
                </Link>
              ))}
              {historical?.map((d: any) => (
                <Link
                  key={d.id}
                  to="/archive/$driverId"
                  params={{ driverId: d.id }}
                  search={{ name: d.name }}
                  className="group relative overflow-hidden rounded-xl border border-border/40 bg-surface-1/50 p-4 transition-all hover:border-primary/30 hover:bg-surface-1"
                >
                  <div className="font-display text-xl mb-1 group-hover:text-primary transition-colors">
                    {d.name.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-3">
                    {d.nationality} · {d.mostFamousTeam}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {d.role}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No matching profiles found in the historical archive.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function DriverCard({ d, index }: { d: any; index: number }) {
  return (
    <Link
      to="/driver/$driverId"
      params={{ driverId: d.id }}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface-1 p-4 transition-all hover:border-primary/30 hover:-translate-y-0.5"
    >
      <div className="absolute -right-4 -top-4 font-display text-[110px] leading-none text-stroke select-none opacity-50">
        {d.number}
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-5 w-1 rounded-sm"
            style={{ background: getTeamColor(d.team) }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            P{index + 1}
          </span>
          <span className="ml-auto text-lg">{d.flag}</span>
        </div>
        <div className="font-display text-2xl tracking-wide">
          {d.lastName.toUpperCase()}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {d.firstName}
        </div>
        <div
          className="text-[11px] mt-1.5"
          style={{ color: getTeamColor(d.team) }}
        >
          {d.team}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="font-display text-3xl text-primary">
              {d.points}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Pts
            </div>
          </div>
          <div className="flex gap-3 text-right">
            <Mini v={d.wins} l="W" />
            <Mini v={d.podiums || 0} l="Pod" />
            <Mini v={d.poles || 0} l="Pol" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function Mini({ v, l }: { v: number; l: string }) {
  return (
    <div>
      <div className="font-display text-lg">{v}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {l}
      </div>
    </div>
  );
}
