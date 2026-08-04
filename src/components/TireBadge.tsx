import type { Tire } from "@/lib/f1-data";
import { tireColor } from "@/lib/f1-data";

const labels: Record<Tire, string> = {
  S: "Soft",
  M: "Medium",
  H: "Hard",
  I: "Inter",
  W: "Wet",
  P: "Pitting",
};

export function TireBadge({
  compound,
  age,
  size = "sm",
}: {
  compound: Tire;
  age?: number;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-7 w-7 text-[12px]" : "h-5 w-5 text-[10px]";
  return (
    <div className="flex items-center gap-1.5" title={labels[compound]}>
      <div
        className={`relative flex items-center justify-center rounded-full border-2 font-bold ${dim}`}
        style={{ borderColor: tireColor[compound], color: tireColor[compound] }}
      >
        {compound}
      </div>
      {age !== undefined && (
        <span className="font-mono text-[11px] text-muted-foreground">
          {age}L
        </span>
      )}
    </div>
  );
}
