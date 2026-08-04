import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Award, Briefcase, Calendar } from "lucide-react";
import { getTeamColor } from "@/lib/f1-data";
import { principalDetails } from "@/lib/principal-data";
import { AIInsightCard } from "@/components/AIInsightCard";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/principal/$teamId")({
  head: () => ({
    meta: [
      { title: `Team Principal Profile · APEX F1` },
      { name: "description", content: "Formula 1 Team Principal statistics and management profile." },
    ],
  }),
  component: PrincipalPage,
});

function PrincipalPage() {
  const { teamId } = useParams({ from: "/principal/$teamId" });
  const principal = principalDetails[teamId];

  if (!principal) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Team Principal not found.
      </div>
    );
  }

  const teamColor = getTeamColor(principal.team);
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(principal.dateOfBirth.split("-")[0]);

  return (
    <div className="pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: `radial-gradient(ellipse at top right, ${teamColor}, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute -right-6 top-4 font-display text-[200px] leading-none text-stroke select-none">
          {principal.team.substring(0, 3).toUpperCase()}
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <Link
            to="/drivers"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Intelligence Hub
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <span style={{ color: teamColor }}>● </span>
            {principal.team} · {principal.role} · {principal.nationality}
          </div>
          <div className="flex items-end gap-5 flex-wrap">
            <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tighter">
              {principal.name.split(" ")[0].toUpperCase()}{" "}
              <span className="text-primary">{principal.name.split(" ").slice(1).join(" ").toUpperCase()}</span>
            </h1>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted-foreground">
            <span>
              <strong className="text-foreground">{age}</strong> Years Old
            </span>
            <span>
              <strong className="text-foreground">{principal.yearsActive}</strong> Years Active
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* STATS ROW */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Championships"
            value={principal.championships}
            sub="Under Leadership"
            icon={<Trophy className="h-4 w-4" />}
            accent
          />
          <StatCard
            label="Race Wins"
            value={principal.raceWins}
            sub="Under Leadership"
            icon={<Award className="h-4 w-4" />}
          />
          <StatCard
            label="Years Active"
            value={principal.yearsActive}
            sub="As Team Boss"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard
            label="Team"
            value={principal.team}
            sub={principal.role}
            icon={<Briefcase className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* MANAGEMENT DOSSIER */}
          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Management Style & Philosophy
            </h3>
            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <p className="text-base text-foreground font-medium">
                {principal.managementStyle}
              </p>
              <div className="h-px w-full bg-border/40" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground mt-4 mb-2">
                Career Background
              </h3>
              <p>
                {principal.background}
              </p>
            </div>
          </div>

          {/* QUICK FACTS */}
          <div className="rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Executive Bio
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Nationality
                </span>
                <span className="text-sm font-medium">{principal.nationality}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Date of Birth
                </span>
                <span className="text-sm font-medium">{principal.dateOfBirth}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Current Role
                </span>
                <span className="text-sm font-medium">{principal.role}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Organization
                </span>
                <span className="text-sm font-display" style={{ color: teamColor }}>
                  {principal.team}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI ANALYSIS */}
        <AIInsightCard
          title={`Leadership Analysis · ${principal.name}`}
          prompt={`Write a highly detailed organizational analysis of Formula 1 Team Principal ${principal.name} leading ${principal.team}. Focus on their specific leadership style, how they manage engineering teams, their political approach to the FIA and media, and their long-term strategic vision for the team. 
          STRICT INSTRUCTIONS:
          1. Return a JSON object with a "content" key.
          2. DO NOT use any markdown formatting.
          3. Total length MUST be approximately 200 words.
          4. Output ONLY the JSON.`}
        />
      </div>
    </div>
  );
}
