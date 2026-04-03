import { mockBundle } from "@/data/mock/locations";
import { ENABLE_LIVE_DATA } from "@/lib/config";
import { projectForecastOutlooks, buildOutlook } from "@/lib/scoring";
import type { FishingLocation, LocationIntelligenceBundle, SearchResponse } from "@/types";
import { getAmenities } from "@/server/providers/overpass";
import { getWeatherBundle } from "@/server/providers/open-meteo";
import { getWaterConditions } from "@/server/providers/usgs";
import { deriveAreaInsights } from "@/server/services/insights";
import { searchLocations } from "@/server/providers/nominatim";
import { mockSearchResults } from "@/data/mock/locations";

function buildFallbackBundle(location: FishingLocation): LocationIntelligenceBundle {
  const fallbackAmenities = mockBundle.amenities.map((amenity, index) => ({
    ...amenity,
    id: `${location.id}-fallback-${index}`,
    latitude: location.latitude + 0.01 * (index + 1),
    longitude: location.longitude - 0.01 * (index + 1),
    distanceMiles: 1.2 + index * 0.7,
    source: "mock" as const
  }));

  const insights = deriveAreaInsights(location, fallbackAmenities);
  const water = {
    ...mockBundle.water,
    status: "estimated" as const,
    source: "derived" as const,
    stationName: undefined,
    distanceMiles: undefined,
    trendNote: "Direct nearby gauge data was unavailable, so this is a fallback estimate."
  };
  const forecast = projectForecastOutlooks(mockBundle.forecast, water);
  const outlook = buildOutlook({
    current: mockBundle.current,
    hourly: mockBundle.hourly,
    forecast,
    water,
    insights,
    waterbodyType: location.waterbodyType
  });

  return {
    location,
    current: mockBundle.current,
    hourly: mockBundle.hourly,
    forecast,
    water,
    amenities: fallbackAmenities,
    insights,
    outlook: {
      ...outlook,
      explanation:
        "Live conditions for this exact location were unavailable, so this outlook uses fallback weather and access assumptions while keeping your selected place."
    },
    sources: {
      weather: "estimated",
      water: "estimated",
      amenities: "estimated",
      forecast: "estimated",
      chat: "fallback"
    }
  };
}

export async function searchLocationsWithFallback(
  query: string
): Promise<SearchResponse> {
  if (!ENABLE_LIVE_DATA) {
    return { locations: mockSearchResults, usedFallback: true };
  }

  try {
    const locations = await searchLocations(query);
    const filtered = locations.filter((location) =>
      ["lake", "river", "reservoir", "pond", "unknown"].includes(
        location.waterbodyType
      )
    );

    return {
      locations: filtered.length > 0 ? filtered : mockSearchResults,
      usedFallback: filtered.length === 0
    };
  } catch {
    return { locations: mockSearchResults, usedFallback: true };
  }
}

export async function getLocationBundle(
  location: FishingLocation
): Promise<LocationIntelligenceBundle> {
  if (!ENABLE_LIVE_DATA) {
    return buildFallbackBundle(location);
  }

  try {
    const [weather, water, amenities] = await Promise.all([
      getWeatherBundle(location.latitude, location.longitude),
      getWaterConditions(location.latitude, location.longitude),
      getAmenities(location.latitude, location.longitude)
    ]);

    const insights = deriveAreaInsights(location, amenities);
    const forecast = projectForecastOutlooks(weather.forecast, water ?? mockBundle.water);
    const outlook = buildOutlook({
      current: weather.current,
      hourly: weather.hourly,
      forecast,
      water: water ?? {
        ...mockBundle.water,
        status: "estimated",
        source: "derived",
        stationName: undefined,
        distanceMiles: undefined,
        trendNote: "No nearby gauge was found, so water conditions are estimated."
      },
      insights,
      waterbodyType: location.waterbodyType
    });

    return {
      location,
      current: weather.current,
      hourly: weather.hourly,
      forecast,
      water:
        water ??
        {
          ...mockBundle.water,
          status: "estimated",
          source: "derived",
          stationName: undefined,
          distanceMiles: undefined,
          trendNote: "No nearby gauge was found, so water conditions are estimated."
        },
      amenities: amenities.length > 0 ? amenities : mockBundle.amenities,
      insights,
      outlook,
      sources: {
        weather: "confirmed",
        water: water ? "confirmed" : "estimated",
        amenities: amenities.length > 0 ? "confirmed" : "estimated",
        forecast: "confirmed",
        chat: "fallback"
      }
    };
  } catch {
    return buildFallbackBundle(location);
  }
}
