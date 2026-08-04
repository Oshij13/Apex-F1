import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAISummary } from "@/lib/api";

export function AIInsightCard({
  title = "AI Insight",
  text,
  prompt,
  variant = "default",
}: {
  title?: string;
  text?: string;
  prompt?: string;
  variant?: "default" | "compact";
}) {
  const {
    data: aiText,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["aiInsight", prompt],
    queryFn: () => getAISummary(prompt!),
    enabled: !!prompt,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1, // Only retry once on failure
    retryDelay: 2000,
  });

  const sanitizeResponse = (text: string) => {
    if (!text) return text;
    // If it looks like JSON, try to extract just the values or clean it up
    // Robust JSON extraction using regex to handle potential markdown wrappers
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.content) return parsed.content;
        
        // Fallback: extract all string values from the JSON
        const extractValues = (obj: any): string[] => {
          return Object.values(obj).flatMap((val) =>
            typeof val === "string" ? [val] : extractValues(val)
          );
        };
        const values = extractValues(parsed);
        if (values.length > 0) return values.join(" ");
      } catch (e) {
        // Fallback: manual strip if JSON parsing fails
        return jsonMatch[0].replace(/[{}"[\]]/g, "").replace(/\w+:/g, "").trim();
      }
    }
    
    // Remove common AI artifacts and any accidental markdown symbols
    return text
      .replace(/^(Here is the analysis:|Analysis:)\s*/i, "")
      .replace(/[\*_#]/g, "")
      .trim();
  };

  const content = sanitizeResponse(aiText || text || "");

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.02] to-transparent ${
        variant === "compact" ? "p-4" : "p-5"
      }`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {title}
          </span>
          <span className="ml-auto rounded-full border border-primary/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary/80">
            APEX AI
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 py-2 text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[13px] italic">
              Generating intelligence...
            </span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary/50" />
              <span className="text-[12px] italic text-muted-foreground/70">
                AI analysis unavailable
              </span>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        ) : content ? (
          <p
            className={`text-foreground/85 animate-fade-in ${variant === "compact" ? "text-[13px] leading-relaxed" : "text-[14px] leading-[1.75]"}`}
          >
            {content}
          </p>
        ) : (
          <p className="text-[12px] italic text-muted-foreground/60 py-2">
            No insight available.
          </p>
        )}
      </div>
    </div>
  );
}
