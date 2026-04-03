import { cn } from "@/lib/utils";
import type { FishingOutlook, OutlookRating } from "@/types";

const toneMap: Record<OutlookRating, string> = {
  Excellent: "bg-emerald-500/15 text-emerald-800 border-emerald-700/15",
  Good: "bg-teal-500/15 text-teal-900 border-teal-700/15",
  Fair: "bg-amber-500/15 text-amber-900 border-amber-700/15",
  Poor: "bg-rose-500/15 text-rose-900 border-rose-700/15"
};

export function ScoreBadge({
  outlook
}: {
  outlook: Pick<FishingOutlook, "score" | "rating">;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2 font-sans text-sm font-semibold",
        toneMap[outlook.rating]
      )}
    >
      <span>{outlook.rating}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span>{outlook.score}/100</span>
    </div>
  );
}
