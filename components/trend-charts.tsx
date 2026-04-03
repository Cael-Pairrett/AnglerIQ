"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatDateLabel } from "@/lib/format";
import type { ForecastDay, HourlyConditions } from "@/types";

export function TrendCharts({
  hourly,
  forecast
}: {
  hourly: HourlyConditions[];
  forecast: ForecastDay[];
}) {
  const hourlyData = hourly.map((entry) => ({
    label: new Date(entry.time).toLocaleTimeString("en-US", { hour: "numeric" }),
    wind: Math.round(entry.windSpeedMph),
    pressure: Number(entry.pressureInHg.toFixed(2)),
    rain: entry.precipitationChance,
    temp: Math.round(entry.temperatureF)
  }));

  const forecastData = forecast.map((entry) => ({
    label: formatDateLabel(entry.date),
    score: entry.projectedOutlook?.score ?? 0
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="card-surface rounded-[1.5rem] p-5">
        <div className="mb-5">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-[var(--pine-soft)]">
            Hourly trend
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Wind, pressure, and rain risk</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="wind" stroke="#1d4f43" strokeWidth={2.5} />
              <Line type="monotone" dataKey="pressure" stroke="#214d67" strokeWidth={2.5} />
              <Line type="monotone" dataKey="rain" stroke="#c08234" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card-surface rounded-[1.5rem] p-5">
        <div className="mb-5">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-[var(--pine-soft)]">
            Daily outlook trend
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Projected fishing score</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#214d67"
                fill="rgba(33,77,103,0.22)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
