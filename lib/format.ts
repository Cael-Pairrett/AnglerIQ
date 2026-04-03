import { formatWindDirection, round } from "@/lib/utils";

export function formatTemp(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return `${round(value)}°F`;
}

export function formatMph(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return `${round(value)} mph`;
}

export function formatPressure(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return `${round(value, 2)} inHg`;
}

export function formatPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return `${round(value)}%`;
}

export function formatDistance(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "N/A";
  return `${round(value, 1)} mi`;
}

export function formatWind(speed?: number, direction?: number) {
  if (speed === undefined || direction === undefined) return "N/A";
  return `${formatMph(speed)} ${formatWindDirection(direction)}`;
}

export function formatDateLabel(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(input));
}

export function formatTimeLabel(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(input));
}
