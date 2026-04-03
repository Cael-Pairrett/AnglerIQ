import { formatDateLabel, formatMph, formatPercent, formatPressure, formatTemp } from "@/lib/format";
import type { ForecastDay } from "@/types";
import { ScoreBadge } from "@/components/score-badge";

export function ForecastSection({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <section className="space-y-4">
      {forecast.map((day) => (
        <article
          key={day.date}
          className="card-surface rounded-[1.5rem] p-5 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-6"
        >
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="font-sans text-xs uppercase tracking-[0.26em] text-[var(--pine-soft)]">
                {formatDateLabel(day.date)}
              </p>
              {day.projectedOutlook ? <ScoreBadge outlook={day.projectedOutlook} /> : null}
            </div>
            <h3 className="text-xl font-semibold">{day.summary}</h3>
            <p className="mt-3 font-sans text-sm text-[var(--muted)]">
              Best window: <span className="font-semibold text-[var(--foreground)]">{day.bestWindow ?? "Watch sunrise and wind trends"}</span>
            </p>
          </div>

          <div className="mt-5 grid gap-3 font-sans text-sm text-[var(--muted)] lg:mt-0 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pine-soft)]">
                Temperature
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatTemp(day.highF)} / {formatTemp(day.lowF)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pine-soft)]">
                Wind & Rain
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatMph(day.windSpeedMph)} · {formatPercent(day.precipitationChance)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pine-soft)]">
                Pressure
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatPressure(day.pressureInHg)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pine-soft)]">
                Why It Moves
              </p>
              <p className="mt-2 text-sm leading-6">
                {day.projectedOutlook?.reasons?.[0] ?? "Daily trends remain favorable."}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
