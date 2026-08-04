export function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-surface-1 p-4 transition-all hover:border-primary/30 ${accent ? "border-primary/30" : "border-border"}`}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {icon && (
          <div className="text-muted-foreground/60 group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
      <div
        className={`mt-2 font-display text-4xl leading-none ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1.5 text-[11px] text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}
