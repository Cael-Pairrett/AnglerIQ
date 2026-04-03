import type {
  AmenityPoint,
  AreaInsights,
  CurrentConditions,
  FishingLocation,
  ForecastDay,
  HourlyConditions,
  LocationIntelligenceBundle,
  WaterConditions
} from "@/types";
import { getMoonPhase } from "@/lib/moon";

const now = new Date("2026-04-02T19:00:00Z");

export const featuredLocations: FishingLocation[] = [
  {
    id: "devils-lake-nd",
    slug: "devils-lake-nd",
    name: "Devils Lake",
    state: "ND",
    regionLabel: "Ramsey County, North Dakota",
    latitude: 48.1128,
    longitude: -98.8651,
    waterbodyType: "lake",
    description: "Large prairie lake with broad structure and strong spring bites.",
    source: "mock"
  },
  {
    id: "truman-reservoir-mo",
    slug: "truman-reservoir-mo",
    name: "Truman Reservoir",
    state: "MO",
    regionLabel: "Warsaw, Missouri",
    latitude: 38.2761,
    longitude: -93.4304,
    waterbodyType: "reservoir",
    description: "Big-water reservoir with boat access, timber, and changing wind exposure.",
    source: "mock"
  },
  {
    id: "wisconsin-river-wi",
    slug: "wisconsin-river-wi",
    name: "Wisconsin River at Sauk City",
    state: "WI",
    regionLabel: "Sauk City, Wisconsin",
    latitude: 43.267,
    longitude: -89.7228,
    waterbodyType: "river",
    description: "River stretch with public access and current-sensitive fishing windows.",
    source: "mock"
  }
];

const mockAmenities: AmenityPoint[] = [
  {
    id: "a1",
    name: "Creel Bay Boat Ramp",
    type: "boat_ramp",
    latitude: 48.1063,
    longitude: -98.9081,
    distanceMiles: 2.4,
    relevanceNote: "Closest public launch with reliable parking.",
    source: "mock"
  },
  {
    id: "a2",
    name: "West Shore Access",
    type: "shore_access",
    latitude: 48.0994,
    longitude: -98.8415,
    distanceMiles: 1.8,
    relevanceNote: "Useful for bank fishing in lower wind.",
    source: "mock"
  },
  {
    id: "a3",
    name: "Northside Restrooms",
    type: "restroom",
    latitude: 48.1082,
    longitude: -98.9024,
    distanceMiles: 2.6,
    relevanceNote: "Near the main lot and ramp.",
    source: "mock"
  },
  {
    id: "a4",
    name: "Prairie Tackle Co.",
    type: "bait_shop",
    latitude: 48.1148,
    longitude: -98.8772,
    distanceMiles: 3.1,
    relevanceNote: "Nearest bait and tackle stop before launch.",
    source: "mock"
  }
];

function mockCurrent(): CurrentConditions {
  return {
    observedAt: now.toISOString(),
    temperatureF: 57,
    feelsLikeF: 54,
    windSpeedMph: 11,
    windDirectionDeg: 135,
    weatherCode: 2,
    cloudCover: 42,
    pressureInHg: 29.93,
    humidity: 67,
    precipitationChance: 15,
    sunrise: "2026-04-02T11:52:00.000Z",
    sunset: "2026-04-03T00:42:00.000Z",
    moonPhase: getMoonPhase(now)
  };
}

function mockHourly(): HourlyConditions[] {
  return Array.from({ length: 12 }, (_, index) => ({
    time: new Date(now.getTime() + index * 60 * 60 * 1000).toISOString(),
    temperatureF: 52 + index * 0.9,
    windSpeedMph: 9 + (index % 4),
    pressureInHg: 29.86 + index * 0.01,
    precipitationChance: index < 3 ? 10 : 20,
    cloudCover: 35 + index * 2
  }));
}

function mockForecast(): ForecastDay[] {
  return [
    {
      date: "2026-04-03",
      highF: 61,
      lowF: 43,
      precipitationChance: 12,
      windSpeedMph: 10,
      pressureInHg: 29.97,
      cloudCover: 38,
      summary: "Stable spring weather and manageable wind should keep the bite active."
    },
    {
      date: "2026-04-04",
      highF: 64,
      lowF: 47,
      precipitationChance: 18,
      windSpeedMph: 9,
      pressureInHg: 30.01,
      cloudCover: 44,
      summary: "Slight warming trend favors a solid morning and late-day window."
    },
    {
      date: "2026-04-05",
      highF: 58,
      lowF: 42,
      precipitationChance: 46,
      windSpeedMph: 15,
      pressureInHg: 29.71,
      cloudCover: 71,
      summary: "Weather change may spark activity, but the wind adds boat control risk."
    },
    {
      date: "2026-04-06",
      highF: 55,
      lowF: 39,
      precipitationChance: 35,
      windSpeedMph: 17,
      pressureInHg: 29.62,
      cloudCover: 82,
      summary: "Front-driven conditions look more volatile with lower comfort and confidence."
    },
    {
      date: "2026-04-07",
      highF: 59,
      lowF: 40,
      precipitationChance: 20,
      windSpeedMph: 8,
      pressureInHg: 29.9,
      cloudCover: 48,
      summary: "Rebound day with improved pressure and calmer wind."
    }
  ];
}

const mockWater: WaterConditions = {
  status: "confirmed",
  source: "mock",
  stationName: "Devils Lake Near Devils Lake, ND",
  distanceMiles: 6.7,
  gaugeHeightFt: 6.8,
  dischargeCfs: 2100,
  waterTempF: 49,
  trendNote: "Level steady over the last 48 hours with no sharp inflow spike.",
  lastUpdated: now.toISOString()
};

const mockInsights: AreaInsights = {
  shoreFishing: {
    label: "Shore Fishing",
    value: "Good near west and northwest access points",
    status: "confirmed"
  },
  boatFriendly: {
    label: "Boat Friendly",
    value: "Very good, though exposed in strong southeast wind",
    status: "confirmed"
  },
  publicRamps: {
    label: "Public Ramps",
    value: "Several ramps nearby",
    status: "confirmed"
  },
  bathrooms: {
    label: "Bathrooms",
    value: "Available near major launch areas",
    status: "confirmed"
  },
  access: {
    label: "Access",
    value: "Easy public access with parking",
    status: "confirmed"
  },
  timingBias: {
    label: "Best Timing",
    value: "Morning edges out evening while pressure is rising",
    status: "estimated"
  },
  notes: [
    "Main-lake wind can stack quickly by afternoon, so smaller boats should launch early.",
    "Bank anglers have the cleanest setup near developed access areas with firmer shoreline.",
    "Stable water level supports a more reliable multi-day pattern than many spring reservoirs."
  ]
};

export const mockBundle: LocationIntelligenceBundle = {
  location: featuredLocations[0],
  current: mockCurrent(),
  hourly: mockHourly(),
  forecast: mockForecast(),
  water: mockWater,
  amenities: mockAmenities,
  insights: mockInsights,
  outlook: {
    score: 79,
    rating: "Good",
    confidence: "High",
    trend: "Improving",
    bestTimeWindow: "Tomorrow 6:15 AM - 9:30 AM",
    explanation:
      "Conditions are lining up well thanks to moderate wind, steady pressure, and a warming spring trend. The biggest advantage is a stable water level and a clean morning window before breeze picks up.",
    reasons: [
      "Moderate wind should keep the water active without making boat control too difficult.",
      "Pressure is steady to slightly rising, which supports a more predictable bite window.",
      "Spring warming trend and stable water level favor active fish movement."
    ],
    cautions: [
      "Wind exposure increases after late morning on more open stretches.",
      "Cloud cover and a possible front later in the weekend reduce confidence after day two."
    ]
  },
  sources: {
    weather: "confirmed",
    water: "confirmed",
    amenities: "confirmed",
    forecast: "confirmed",
    chat: "fallback"
  }
};

export const mockSearchResults = featuredLocations;
