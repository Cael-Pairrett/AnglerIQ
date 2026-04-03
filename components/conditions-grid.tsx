import { CloudRain, Gauge, MoonStar, Sunrise, Thermometer, Wind } from "lucide-react";
import { formatMph, formatPercent, formatPressure, formatTemp, formatTimeLabel } from "@/lib/format";
import type { CurrentConditions, WaterConditions } from "@/types";

const stats = (
  current: CurrentConditions,
  water: WaterConditions
) => [
  {
    label: "Temperature",
    value: formatTemp(current.temperatureF),
    detail: `Feels like ${formatTemp(current.feelsLikeF)}`,
    icon: Thermometer
  },
  {
    label: "Wind",
    value: formatMph(current.windSpeedMph),
    detail: `${current.windDirectionDeg}°`,
    icon: Wind
  },
  {
    label: "Pressure",
    value: formatPressure(current.pressureInHg),
    detail: `Humidity ${formatPercent(current.humidity)}`,
    icon: Gauge
  },
  {
    label: "Precipitation",
    value: formatPercent(current.precipitationChance),
    detail: `Clouds ${formatPercent(current.cloudCover)}`,
    icon: CloudRain
  },
  {
    label: "Sunrise / Sunset",
    value: `${formatTimeLabel(current.sunrise)} / ${formatTimeLabel(current.sunset)}`,
    detail: "Local light window",
    icon: Sunrise
  },
  {
    label: "Moon / Water",
    value: current.moonPhase,
    detail: water.waterTempF ? `Water ${formatTemp(water.waterTempF)}` : "Water temp unavailable",
    icon: MoonStar
  }
];

export function ConditionsGrid({
  current,
  water
}: {
  current: CurrentConditions;
  water: WaterConditions;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats(current, water).map(({ label, value, detail, icon: Icon }) => (
        <article key={label} className="card-surface rounded-[1.4rem] p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(29,79,67,0.1)] text-[var(--pine)]">
            <Icon className="h-5 w-5" />
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.24em] text-[var(--pine-soft)]">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
          <p className="mt-2 font-sans text-sm text-[var(--muted)]">{detail}</p>
        </article>
      ))}
    </section>
  );
}
