import { getOnThisDayFact } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Calendar, Loader2 } from "lucide-react";

export function OnThisDayDialog() {
  const {
    data: event,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["onThisDay"],
    queryFn: getOnThisDayFact,
    enabled: false, // Only fetch when opened
  });

  return (
    <Dialog onOpenChange={(open) => open && refetch()}>
      <DialogTrigger asChild>
        <button className="rounded-md border border-border bg-surface-1 px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-border hover:bg-surface-2 flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          On This Day
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-surface-1 border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            ON THIS DAY IN F1
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Retrieving History...
            </span>
          </div>
        ) : event ? (
          <div className="space-y-4 pt-4 animate-fade-in">
            <div className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
              {event.date}
            </div>
            <h3 className="font-display text-xl leading-tight text-foreground">
              {event.event}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No historical records found for today.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
