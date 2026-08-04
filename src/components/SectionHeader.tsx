export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
