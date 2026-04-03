import { clamp } from "@/lib/utils";
import type {
  AreaInsights,
  ConfidenceLevel,
  FishingOutlook,
  ForecastDay,
  HourlyConditions,
  TrendDirection,
  WaterConditions
} from "@/types";
import type { CurrentConditions } from "@/types";

function ratingForScore(score: number): FishingOutlook["rating"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Poor";
}

function confidenceForCoverage(water: WaterConditions, insights: AreaInsights) {
  if (water.status === "confirmed" && insights.publicRamps.status !== "unavailable") {
    return "High" as const;
  }
  if (water.status === "confirmed" || insights.access.status !== "unavailable") {
    return "Medium" as const;
  }
  return "Low" as const;
}

function seasonalBonus(month: number, waterbodyType: string) {
  const spring = month >= 2 && month <= 4;
  const fall = month >= 8 && month <= 10;
  if (spring) return waterbodyType === "river" ? 6 : 9;
  if (fall) return 7;
  return 2;
}

function bestWindowFromHourly(hourly: HourlyConditions[]) {
  const scored = hourly.map((entry) => {
    let score = 50;
    score += clamp(16 - entry.windSpeedMph, -20, 15);
    score += clamp(30 - Math.abs(entry.temperatureF - 62), -12, 10);
    score += clamp(45 - Math.abs(entry.cloudCover - 45), -8, 8);
    score += clamp(25 - entry.precipitationChance, -20, 10);
    return { time: entry.time, score };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];
  const start = new Date(best.time);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return `${start.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  })} - ${end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  })}`;
}

export function buildOutlook(params: {
  current: CurrentConditions;
  hourly: HourlyConditions[];
  forecast: ForecastDay[];
  water: WaterConditions;
  insights: AreaInsights;
  waterbodyType: string;
}): FishingOutlook {
  const { current, hourly, forecast, water, insights, waterbodyType } = params;
  const month = new Date(current.observedAt).getMonth();

  const weatherScore =
    35 -
    clamp(Math.abs(current.temperatureF - 62), 0, 20) -
    clamp(current.precipitationChance / 5, 0, 15);
  const windScore = 20 - clamp(current.windSpeedMph - 8, 0, 18);
  const pressureScore = 15 - clamp(Math.abs(current.pressureInHg - 29.95) * 20, 0, 12);
  const cloudScore = 10 - clamp(Math.abs(current.cloudCover - 45) / 8, 0, 7);
  const seasonScore = seasonalBonus(month, waterbodyType);
  const waterScore =
    water.status === "confirmed"
      ? 8 + (water.gaugeHeightFt ? 1 : 0) + (water.dischargeCfs ? 1 : 0)
      : water.status === "estimated"
        ? 5
        : 2;

  const rawScore =
    weatherScore + windScore + pressureScore + cloudScore + seasonScore + waterScore;
  const score = clamp(Math.round(rawScore), 24, 95);

  const tomorrow = forecast[1] ?? forecast[0];
  const trend =
    tomorrow && tomorrow.projectedOutlook
      ? tomorrow.projectedOutlook.score > score + 4
        ? "Improving"
        : tomorrow.projectedOutlook.score < score - 4
          ? "Declining"
          : "Stable"
      : forecast[0] && forecast[0].windSpeedMph < current.windSpeedMph
        ? "Improving"
        : "Stable";

  const reasons = [
    current.windSpeedMph <= 12
      ? "Wind is manageable for both casting control and smaller-boat positioning."
      : "Wind is still fishable, but it will shape where and how comfortably you can fish.",
    current.pressureInHg >= 29.85 && current.pressureInHg <= 30.05
      ? "Pressure is in a stable range that usually supports a more predictable bite."
      : "Pressure is a little less stable, so timing matters more than an all-day grind.",
    water.status === "confirmed"
      ? water.trendNote ?? "Nearby gauge and water data improve confidence in the recommendation."
      : "Water conditions are estimated from weather and seasonal cues because direct gauge data is limited."
  ];

  const cautions = [
    current.windSpeedMph > 15
      ? "Wind may be uncomfortable for open water or smaller boats."
      : "Open-water wind can still build later in the day.",
    current.precipitationChance > 35
      ? "Rain chances are high enough to reduce comfort and consistency."
      : "Watch for changing weather later in the forecast.",
    insights.shoreFishing.status === "unavailable"
      ? "Bank-access confidence is limited because public access data is incomplete."
      : "Use the access map to choose the most sheltered side."
  ];

  const confidence = confidenceForCoverage(water, insights);
  const bestTimeWindow = bestWindowFromHourly(hourly);
  const explanation = `The outlook is ${ratingForScore(score).toLowerCase()} because wind, pressure, and short-term weather are mostly supportive right now. ${water.status === "confirmed" ? "Direct water data helps support the call." : "Some water details are estimated, so confidence is a bit lower."}`;

  return {
    score,
    rating: ratingForScore(score),
    confidence,
    trend,
    bestTimeWindow,
    explanation,
    reasons,
    cautions
  };
}

export function projectForecastOutlooks(
  forecast: ForecastDay[],
  water: WaterConditions
): ForecastDay[] {
  return forecast.map((day, index, list) => {
    const score =
      72 -
      clamp(day.windSpeedMph - 9, 0, 18) -
      clamp(day.precipitationChance / 6, 0, 16) -
      clamp(Math.abs(day.pressureInHg - 29.95) * 18, 0, 12) -
      clamp(Math.abs(day.cloudCover - 45) / 10, 0, 5) +
      (water.status === "confirmed" ? 6 : 2);

    const rounded = clamp(Math.round(score), 25, 92);
    const previous = list[index - 1];
    const trend: TrendDirection =
      !previous
        ? "Stable"
        : rounded > (previous.projectedOutlook?.score ?? rounded) + 3
          ? "Improving"
          : rounded < (previous.projectedOutlook?.score ?? rounded) - 3
            ? "Declining"
            : "Stable";
    const confidence: ConfidenceLevel =
      water.status === "confirmed" ? "High" : "Medium";

    return {
      ...day,
      bestWindow: day.windSpeedMph < 12 ? "6:00 AM - 9:00 AM" : "Sunrise - 8:00 AM",
      projectedOutlook: {
        score: rounded,
        rating: ratingForScore(rounded),
        confidence,
        trend,
        reasons: [
          day.windSpeedMph < 12 ? "Wind stays manageable." : "Wind is a limiting factor.",
          day.precipitationChance < 30
            ? "Low rain risk improves comfort."
            : "Weather volatility may compress the bite."
        ]
      }
    };
  });
}
