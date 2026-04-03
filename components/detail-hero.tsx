import { Fish, MapPin, ShieldAlert, TimerReset } from "lucide-react";
import type { LocationIntelligenceBundle } from "@/types";
import { ScoreBadge } from "@/components/score-badge";
import { FavoriteButton } from "@/components/favorite-button";

export function DetailHero({ bundle }: { bundle: LocationIntelligenceBundle }) {
  const { location, outlook } = bundle;

  return (
    <section className="terrain-lines rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(243,247,244,0.95),rgba(228,235,231,0.88))] p-6 shadow-[0_20px_50px_rgba(16,36,30,0.08)] lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[rgba(29,79,67,0.1)] px-4 py-2 font-sans text-xs uppercase tracking-[0.24em] text-[var(--pine-soft)]">
            <Fish className="h-4 w-4" />
            {location.waterbodyType} intelligence
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{location.name}</h1>
          <p className="mt-3 inline-flex items-center gap-2 font-sans text-sm text-[var(--muted)]">
            <MapPin className="h-4 w-4 text-[var(--lake)]" />
            {location.regionLabel}
          </p>
          <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)]">
            {outlook.explanation}
          </p>
        </div>

        <div className="flex min-w-[280px] flex-col gap-3 rounded-[1.6rem] bg-[rgba(255,255,255,0.55)] p-5">
          <div className="flex items-center justify-between gap-3">
            <ScoreBadge outlook={outlook} />
            <FavoriteButton location={location} />
          </div>
          <div className="grid gap-3 font-sans text-sm text-[var(--foreground)]">
            <div className="rounded-[1.2rem] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--pine-soft)]">
                Confidence
              </p>
              <p className="mt-2 text-lg font-semibold">{outlook.confidence}</p>
            </div>
            <div className="rounded-[1.2rem] bg-white/70 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--pine-soft)]">
                <TimerReset className="h-4 w-4" />
                Best time to go
              </p>
              <p className="mt-2 text-lg font-semibold">{outlook.bestTimeWindow}</p>
            </div>
            <div className="rounded-[1.2rem] bg-white/70 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--pine-soft)]">
                <ShieldAlert className="h-4 w-4" />
                Main cautions
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-6">
                {outlook.cautions.slice(0, 2).map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
