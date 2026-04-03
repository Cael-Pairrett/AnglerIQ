import { endpoints } from "@/lib/config";
import { getMoonPhase } from "@/lib/moon";
import type { CurrentConditions, ForecastDay, HourlyConditions } from "@/types";

interface OpenMeteoResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    relative_humidity_2m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
    precipitation_probability: number[];
    cloud_cover: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
  };
}

function cToF(value: number) {
  return value * (9 / 5) + 32;
}

function hPaToInHg(value: number) {
  return value * 0.0295299830714;
}

function summaryFromCode(code: number) {
  if (code < 3) return "Mostly stable weather keeps conditions fishable.";
  if (code < 60) return "Cloud cover may help the bite if wind stays manageable.";
  return "Wet weather raises volatility and may reduce comfort.";
}

export async function getWeatherBundle(
  latitude: number,
  longitude: number
): Promise<{
  current: CurrentConditions;
  hourly: HourlyConditions[];
  forecast: ForecastDay[];
}> {
  const url = new URL(endpoints.openMeteo);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "wind_speed_10m",
      "wind_direction_10m",
      "weather_code",
      "cloud_cover",
      "surface_pressure",
      "relative_humidity_2m"
    ].join(",")
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "wind_speed_10m",
      "surface_pressure",
      "precipitation_probability",
      "cloud_cover"
    ].join(",")
  );
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "weather_code",
      "sunrise",
      "sunset"
    ].join(",")
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { next: { revalidate: 60 * 30 } });

  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  if (!current || !daily || !hourly) {
    throw new Error("Weather response missing required fields");
  }

  return {
    current: {
      observedAt: current.time,
      temperatureF: current.temperature_2m ?? cToF(current.temperature_2m),
      feelsLikeF:
        current.apparent_temperature ?? cToF(current.apparent_temperature),
      windSpeedMph: current.wind_speed_10m,
      windDirectionDeg: current.wind_direction_10m,
      weatherCode: current.weather_code,
      cloudCover: current.cloud_cover,
      pressureInHg: hPaToInHg(current.surface_pressure),
      humidity: current.relative_humidity_2m,
      precipitationChance: hourly.precipitation_probability[0] ?? 0,
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      moonPhase: getMoonPhase(current.time)
    },
    hourly: hourly.time.slice(0, 18).map((time, index) => ({
      time,
      temperatureF: hourly.temperature_2m[index],
      windSpeedMph: hourly.wind_speed_10m[index],
      pressureInHg: hPaToInHg(hourly.surface_pressure[index]),
      precipitationChance: hourly.precipitation_probability[index],
      cloudCover: hourly.cloud_cover[index]
    })),
    forecast: daily.time.slice(0, 6).map((date, index) => ({
      date,
      highF: daily.temperature_2m_max[index],
      lowF: daily.temperature_2m_min[index],
      precipitationChance: daily.precipitation_probability_max[index],
      windSpeedMph: daily.wind_speed_10m_max[index],
      pressureInHg: hPaToInHg(hourly.surface_pressure[Math.min(index * 3, hourly.surface_pressure.length - 1)]),
      cloudCover: hourly.cloud_cover[Math.min(index * 3, hourly.cloud_cover.length - 1)],
      summary: summaryFromCode(daily.weather_code[index])
    }))
  };
}
