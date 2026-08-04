import { createFileRoute, Link } from "@tanstack/react-router";
import { getSeasonResults, getChampionshipWinner } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { countryToIso } from "@/lib/f1-data";

export const Route = createFileRoute("/seasons")({
  head: () => ({
    meta: [
      { title: "Season Archive 1950–2026 · APEX F1" },
      {
        name: "description",
        content:
          "Browse every Formula 1 season from 1950 to today. Champions, race winners, and full results.",
      },
      { property: "og:title", content: "Season Archive 1950–2026 · APEX F1" },
      {
        property: "og:description",
        content: "Every F1 season since 1950, archived and indexed.",
      },
    ],
  }),
  component: SeasonsPage,
});

function SeasonsPage() {
  const [year, setYear] = useState(2026);
  const years = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 2026 - i);

  const { data: champ, isLoading: loadingChamp } = useQuery({
    queryKey: ["championshipWinner", year],
    queryFn: () => getChampionshipWinner(year),
  });

  const { data: races, isLoading: loadingRaces } = useQuery({
    queryKey: ["seasonResults", year],
    queryFn: () => getSeasonResults(year),
  });

  const activeRaces = races || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 pb-20">
      <SectionHeader eyebrow="1950 — 2026" title="Season Archive" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <select
          value={year}
          onChange={(e) => setYear(+e.target.value)}
          className="rounded-md border border-border bg-surface-1 px-4 py-2 text-[14px] outline-none focus:border-primary/50"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y} Season
            </option>
          ))}
        </select>
        <div className="text-[12px] text-muted-foreground">
          {year === 2026 ? "Live · season in progress" : "Archived"}
        </div>
      </div>

      {/* SIMULATION AVAILABILITY ALERT */}
      {year >= 2018 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Race Simulations Archive
            </div>
            <div className="text-[12px] text-white/60">
              Telemetry-driven full race simulations are available for all Grand
              Prixs from{" "}
              <span className="text-white font-semibold">2018 — Present</span>.
            </div>
          </div>
        </div>
      )}

      {/* CHAMPION BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.15] via-primary/[0.05] to-transparent p-6 mb-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-6 flex-wrap">
          <div className="font-display text-7xl md:text-8xl text-primary leading-none">
            {year}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              🏆 World Champion{" "}
              {year === 2026 && (
                <span className="text-primary/70 normal-case tracking-normal ml-1">
                  (Currently)
                </span>
              )}
            </h4>
            <div className="font-display text-4xl uppercase text-primary">
              {loadingChamp ? (
                "Calculating..."
              ) : champ?.driverId ? (
                <Link
                  to="/driver/$driverId"
                  params={{ driverId: champ.driverId }}
                  className="hover:underline"
                >
                  {champ.driver}
                </Link>
              ) : (
                champ?.driver || "Data Unavailable"
              )}
            </div>
            {!loadingChamp && (
              <div className="text-[13px] text-muted-foreground mt-1">
                {champ?.team || "—"}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Stat v={activeRaces.length.toString()} l="Races" />
            <Stat v={champ?.wins || "—"} l="Wins" />
            <Stat v={champ?.points || "—"} l="Pts" />
          </div>
        </div>
      </div>

      {/* RACES */}
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" /> {year} Calendar
        <span className="text-[10px] normal-case tracking-normal font-normal ml-1 text-muted-foreground/60">
          — click any race for full details
        </span>
      </div>

      {loadingRaces ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-20 bg-surface-1 border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {activeRaces.map((r: any) => (
            <Link
              key={r.id}
              to="/race/$raceId"
              params={{ raceId: r.id }}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface-1 p-3.5 transition-all hover:border-primary/40 hover:bg-surface-2/40 hover:shadow-[0_0_16px_-4px_var(--primary)]"
            >
              <div className="font-mono text-[10px] font-bold text-primary w-8 flex-shrink-0">
                R{String(r.round).padStart(2, "0")}
              </div>
              {(() => {
                const iso = countryToIso(`${r.country} ${r.name}`.trim());
                return iso ? (
                  <div className="h-3.5 w-6 flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
                      className="h-full w-full object-contain"
                      alt="Flag"
                    />
                  </div>
                ) : (
                  <div className="w-6 flex-shrink-0 text-[10px] opacity-20">
                    🏁
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{r.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {r.winner
                    ? `🏆 ${r.winner}`
                    : new Date(r.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                </div>
              </div>
              <div className="text-muted-foreground/40 group-hover:text-primary transition-colors text-[10px] font-bold">
                ›
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl">{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {l}
      </div>
    </div>
  );
}
