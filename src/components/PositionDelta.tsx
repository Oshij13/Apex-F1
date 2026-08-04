import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function PositionDelta({ pos, prev }: { pos: number; prev: number }) {
  const delta = prev - pos;
  if (delta === 0)
    return <Minus className="h-3 w-3 text-muted-foreground/50" />;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-positive">
        <ArrowUp className="h-3 w-3" />
        <span className="font-mono text-[10px] font-semibold">{delta}</span>
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-primary">
      <ArrowDown className="h-3 w-3" />
      <span className="font-mono text-[10px] font-semibold">
        {Math.abs(delta)}
      </span>
    </span>
  );
}
