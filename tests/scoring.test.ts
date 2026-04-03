import { describe, expect, test } from "vitest";
import { buildOutlook, projectForecastOutlooks } from "@/lib/scoring";
import { mockBundle } from "@/data/mock/locations";

describe("fishing outlook scoring", () => {
  test("returns a strong score for the seeded favorable case", () => {
    const forecast = projectForecastOutlooks(mockBundle.forecast, mockBundle.water);
    const outlook = buildOutlook({
      current: mockBundle.current,
      hourly: mockBundle.hourly,
      forecast,
      water: mockBundle.water,
      insights: mockBundle.insights,
      waterbodyType: mockBundle.location.waterbodyType
    });

    expect(outlook.score).toBeGreaterThanOrEqual(70);
    expect(["Good", "Excellent"]).toContain(outlook.rating);
  });

  test("penalizes high wind and rain", () => {
    const forecast = projectForecastOutlooks(mockBundle.forecast, mockBundle.water);
    const outlook = buildOutlook({
      current: {
        ...mockBundle.current,
        windSpeedMph: 24,
        precipitationChance: 70
      },
      hourly: mockBundle.hourly.map((entry) => ({
        ...entry,
        windSpeedMph: 22,
        precipitationChance: 65
      })),
      forecast,
      water: mockBundle.water,
      insights: mockBundle.insights,
      waterbodyType: mockBundle.location.waterbodyType
    });

    expect(outlook.score).toBeLessThan(70);
  });

  test("drops confidence when direct water data is unavailable", () => {
    const forecast = projectForecastOutlooks(mockBundle.forecast, {
      ...mockBundle.water,
      status: "unavailable"
    });

    const outlook = buildOutlook({
      current: mockBundle.current,
      hourly: mockBundle.hourly,
      forecast,
      water: {
        ...mockBundle.water,
        status: "unavailable",
        gaugeHeightFt: undefined,
        dischargeCfs: undefined
      },
      insights: {
        ...mockBundle.insights,
        publicRamps: {
          ...mockBundle.insights.publicRamps,
          status: "unavailable"
        }
      },
      waterbodyType: mockBundle.location.waterbodyType
    });

    expect(outlook.confidence).toBe("Low");
  });
});
