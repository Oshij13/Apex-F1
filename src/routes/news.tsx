import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/lib/api";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ExternalLink, Newspaper, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "F1 Global News · APEX F1" },
      {
        name: "description",
        content:
          "Latest Formula 1 headlines, paddock rumors, and technical analysis.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["f1News"],
    queryFn: getNews,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  if (isLoading) return <LoadingScreen />;

  // Professional Paddock Protocol Filtering
  const professionalKeywords = [
    "fia",
    "regulation",
    "technical",
    "chassis",
    "engine",
    "power unit",
    "stewards",
    "penalty",
    "result",
    "qualifying",
    "standing",
    "points",
    "contract",
    "team",
    "management",
    "binotto",
    "wolff",
    "horner",
    "development",
    "upgrade",
    "aerodynamic",
    "grid",
    "announcement",
  ];

  const personalKeywords = [
    "personal",
    "holiday",
    "relationship",
    "gossip",
    "rumor",
    "dating",
    "fashion",
    "outfit",
    "celebrity",
  ];

  const filteredNews =
    news?.filter((a: any) => {
      const text = (a.title + " " + (a.description || "")).toLowerCase();
      const isProfessional = professionalKeywords.some((kw) =>
        text.includes(kw),
      );
      const isPersonal = personalKeywords.some((kw) => text.includes(kw));
      return isProfessional && !isPersonal;
    }) || [];

  return (
    <div className="pb-20">
      <div className="border-b border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
              HEADLINES
            </h1>
          </div>
          <p className="text-muted-foreground text-[14px] max-w-2xl uppercase tracking-[0.2em] leading-relaxed">
            Official Technical Directives · FIA Management · Championship
            Intelligence
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article: any, i: number) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>

        {(!filteredNews || filteredNews.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-surface-2 p-6">
              <Zap className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              No Intelligence Matches
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              The paddock is currently silent regarding professional technical
              or regulatory directives.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsCard({
  article,
  variant = "default",
}: {
  article: any;
  variant?: "default" | "compact";
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-xl border border-border bg-surface-1 overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 ${variant === "compact" ? "h-full" : ""}`}
    >
      <div
        className={`${variant === "compact" ? "aspect-video" : "aspect-[16/9]"} relative overflow-hidden bg-surface-2`}
      >
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-black uppercase text-black">
            {article.source?.name || "F1 NEWS"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(article.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
        <h3
          className={`mb-3 line-clamp-2 ${variant === "compact" ? "text-[15px]" : "text-[17px]"} font-bold leading-tight text-white group-hover:text-primary transition-colors`}
        >
          {article.title}
        </h3>
        {variant !== "compact" && (
          <p className="mb-6 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
          Read Full Report <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </a>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71V2.1L16 11.2h-6.3L15 21.9l-11-7.19" />
    </svg>
  );
}
