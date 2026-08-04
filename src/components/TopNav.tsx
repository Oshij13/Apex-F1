import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Search, Zap, User, Flag, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStandings, getCalendar, getCircuits } from "@/lib/api";

type NavItem = {
  to: string;
  label: string;
  live?: boolean;
};
const navItems: NavItem[] = [
  { to: "/", label: "Dashboard" },
  { to: "/live", label: "Live Race", live: true },
  { to: "/seasons", label: "Seasons" },
  { to: "/teams", label: "Teams" },
  { to: "/drivers", label: "Drivers" },
  { to: "/analytics", label: "Analytics" },
  { to: "/news", label: "News" },
  { to: "/docs", label: "FIA Docs" },
];

export function TopNav() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: drivers } = useQuery({
    queryKey: ["standings"],
    queryFn: getStandings,
  });

  const { data: races } = useQuery({
    queryKey: ["calendar"],
    queryFn: getCalendar,
  });

  const { data: circuits } = useQuery({
    queryKey: ["circuits"],
    queryFn: getCircuits,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lc = q.toLowerCase();

  const driverHits =
    q && drivers
      ? drivers
          .filter((d: any) => d.name.toLowerCase().includes(lc))
          .slice(0, 3)
      : [];

  const raceHits =
    q && races
      ? races
          .filter(
            (r: any) =>
              r.name.toLowerCase().includes(lc) ||
              r.country.toLowerCase().includes(lc),
          )
          .slice(0, 3)
      : [];

  const circuitHits =
    q && circuits
      ? circuits
          .filter(
            (c: any) =>
              c.name.toLowerCase().includes(lc) ||
              c.country.toLowerCase().includes(lc),
          )
          .slice(0, 3)
      : [];

  const allHits = [...driverHits, ...raceHits, ...circuitHits];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" && allHits.length > 0) {
      // Simple first-hit navigation
      if (driverHits[0]) navigate({ to: `/driver/${driverHits[0].id}` });
      else if (raceHits[0]) navigate({ to: `/race/${raceHits[0].id}` });
      setOpen(false);
      setQ("");
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-full items-center gap-1 px-4 lg:px-6">
        <Link to="/" className="mr-4 select-none">
          <span className="font-display text-2xl tracking-[0.18em] text-foreground">
            <span className="text-primary">APEX</span>F1
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const active =
              path === item.to || (item.to !== "/" && path.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium uppercase tracking-wider transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.live && <span className="live-dot" />}
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[5px] h-[2px] bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="relative" ref={searchRef}>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search drivers, circuits, races..."
            className="w-48 md:w-64 rounded-md border border-border bg-surface-1 py-1.5 pl-8 pr-3 text-[13px] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50"
          />

          {open && q && allHits.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border bg-surface-1 shadow-2xl animate-in fade-in slide-in-from-top-2">
              {/* DRIVERS */}
              {driverHits.length > 0 && (
                <div className="border-b border-border p-2">
                  <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    <User className="h-3 w-3" /> Drivers
                  </div>
                  {driverHits.map((d: any) => (
                    <Link
                      key={d.id}
                      to="/driver/$driverId"
                      params={{ driverId: d.id }}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      className="flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-surface-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 text-[10px] font-bold">
                          {d.lastName.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="text-[13px]">{d.name}</div>
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground">
                        {d.team}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* RACES */}
              {raceHits.length > 0 && (
                <div className="border-b border-border p-2">
                  <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Flag className="h-3 w-3" /> Grands Prix
                  </div>
                  {raceHits.map((r: any) => (
                    <Link
                      key={r.id}
                      to="/race/$raceId"
                      params={{ raceId: r.id }}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-2"
                    >
                      <span className="text-sm">{r.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] truncate">{r.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Round {r.round} · {r.country}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* CIRCUITS */}
              {circuitHits.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    <MapPin className="h-3 w-3" /> Circuits
                  </div>
                  {circuitHits.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-2"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-surface-3">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] truncate">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {c.location}, {c.country}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-2 flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
          2026 Season
        </div>
      </div>
    </nav>
  );
}
