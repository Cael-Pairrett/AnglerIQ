import { ShieldCheck } from "lucide-react";
import type { AreaInsights } from "@/types";

export function InsightsPanel({ insights }: { insights: AreaInsights }) {
  const items = [
    insights.shoreFishing,
    insights.boatFriendly,
    insights.publicRamps,
    insights.bathrooms,
    insights.access,
    insights.timingBias
  ];

  return (
    <section className="card-surface rounded-[1.6rem] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(29,79,67,0.12)] text-[var(--pine)]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.26em] text-[var(--pine-soft)]">
            Area insights
          </p>
          <h3 className="text-2xl font-semibold">Trip-readiness notes</h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-[1.2rem] bg-white/55 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--pine-soft)]">
                {item.label}
              </p>
              <span className="rounded-full bg-[rgba(29,79,67,0.08)] px-2 py-1 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-[var(--pine)]">
                {item.status}
              </span>
            </div>
            <p className="font-sans text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.2rem] bg-[rgba(33,77,103,0.08)] p-4">
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-[var(--lake)]">
          What anglers should know
        </p>
        <ul className="mt-3 space-y-2 font-sans text-sm leading-6 text-[var(--foreground)]">
          {insights.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
