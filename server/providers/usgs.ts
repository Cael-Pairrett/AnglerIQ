import { endpoints } from "@/lib/config";
import { milesBetween } from "@/lib/utils";
import type { WaterConditions } from "@/types";

interface UsgsValue {
  value: string;
  dateTime: string;
}

interface UsgsSeries {
  sourceInfo?: {
    siteName?: string;
    geoLocation?: {
      geogLocation?: {
        latitude: number;
        longitude: number;
      };
    };
  };
  variable?: {
    variableName?: string;
  };
  values?: Array<{
    value?: UsgsValue[];
  }>;
}

interface UsgsResponse {
  value?: {
    timeSeries?: UsgsSeries[];
  };
}

export async function getWaterConditions(
  latitude: number,
  longitude: number
): Promise<WaterConditions | null> {
  const url = new URL(`${endpoints.usgs}/iv/`);
  url.searchParams.set("format", "json");
  url.searchParams.set("sites", "");
  url.searchParams.set("bBox", `${longitude - 0.3},${latitude - 0.3},${longitude + 0.3},${latitude + 0.3}`);
  url.searchParams.set("parameterCd", "00065,00060");

  const response = await fetch(url, { next: { revalidate: 60 * 30 } });
  if (!response.ok) {
    throw new Error("USGS request failed");
  }

  const data = (await response.json()) as UsgsResponse;
  const series = data.value?.timeSeries ?? [];
  if (series.length === 0) return null;

  const station = series[0];
  const geo = station.sourceInfo?.geoLocation?.geogLocation;
  const values = station.values?.[0]?.value;
  if (!geo || !values || values.length === 0) return null;

  const latest = values[values.length - 1];
  const gaugeSeries = series.find((entry) =>
    entry.variable?.variableName?.toLowerCase().includes("gage")
  );
  const dischargeSeries = series.find((entry) =>
    entry.variable?.variableName?.toLowerCase().includes("discharge")
  );

  const gaugeValue = gaugeSeries?.values?.[0]?.value?.at(-1)?.value;
  const dischargeValue = dischargeSeries?.values?.[0]?.value?.at(-1)?.value;

  return {
    status: "confirmed",
    source: "usgs",
    stationName: station.sourceInfo?.siteName ?? "Nearby USGS Station",
    distanceMiles: milesBetween(latitude, longitude, geo.latitude, geo.longitude),
    gaugeHeightFt: gaugeValue ? Number(gaugeValue) : undefined,
    dischargeCfs: dischargeValue ? Number(dischargeValue) : undefined,
    trendNote: "Pulled from the nearest available USGS gauge station.",
    lastUpdated: latest.dateTime
  };
}
