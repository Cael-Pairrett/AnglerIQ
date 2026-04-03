export type WaterbodyType =
  | "lake"
  | "river"
  | "reservoir"
  | "pond"
  | "access"
  | "unknown";

export type ConfidenceLevel = "High" | "Medium" | "Low";
export type OutlookRating = "Excellent" | "Good" | "Fair" | "Poor";
export type TrendDirection = "Improving" | "Stable" | "Declining";
export type DataStatus = "confirmed" | "estimated" | "unavailable";

export interface FishingLocation {
  id: string;
  slug: string;
  name: string;
  state?: string;
  regionLabel: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  waterbodyType: WaterbodyType;
  description?: string;
  source: "mock" | "nominatim";
}

export interface CurrentConditions {
  observedAt: string;
  temperatureF: number;
  feelsLikeF: number;
  windSpeedMph: number;
  windDirectionDeg: number;
  weatherCode: number;
  cloudCover: number;
  pressureInHg: number;
  humidity: number;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
  moonPhase: string;
}

export interface HourlyConditions {
  time: string;
  temperatureF: number;
  windSpeedMph: number;
  pressureInHg: number;
  precipitationChance: number;
  cloudCover: number;
}

export interface ForecastDay {
  date: string;
  highF: number;
  lowF: number;
  precipitationChance: number;
  windSpeedMph: number;
  pressureInHg: number;
  cloudCover: number;
  summary: string;
  bestWindow?: string;
  projectedOutlook?: Pick<
    FishingOutlook,
    "score" | "rating" | "confidence" | "trend" | "reasons"
  >;
}

export interface WaterConditions {
  status: DataStatus;
  source: "mock" | "usgs" | "derived";
  stationName?: string;
  distanceMiles?: number;
  waterTempF?: number;
  gaugeHeightFt?: number;
  dischargeCfs?: number;
  trendNote?: string;
  lastUpdated?: string;
}

export type AmenityType =
  | "boat_ramp"
  | "shore_access"
  | "marina"
  | "pier"
  | "parking"
  | "restroom"
  | "campground"
  | "bait_shop"
  | "outdoor_store";

export interface AmenityPoint {
  id: string;
  name: string;
  type: AmenityType;
  latitude: number;
  longitude: number;
  distanceMiles?: number;
  relevanceNote: string;
  source: "mock" | "osm";
}

export interface InsightItem {
  label: string;
  value: string;
  status: DataStatus;
}

export interface AreaInsights {
  shoreFishing: InsightItem;
  boatFriendly: InsightItem;
  publicRamps: InsightItem;
  bathrooms: InsightItem;
  access: InsightItem;
  timingBias: InsightItem;
  notes: string[];
}

export interface FishingOutlook {
  score: number;
  rating: OutlookRating;
  confidence: ConfidenceLevel;
  trend: TrendDirection;
  bestTimeWindow: string;
  explanation: string;
  reasons: string[];
  cautions: string[];
}

export interface SourceMeta {
  weather: DataStatus;
  water: DataStatus;
  amenities: DataStatus;
  forecast: DataStatus;
  chat: "fallback" | "llm";
}

export interface LocationIntelligenceBundle {
  location: FishingLocation;
  current: CurrentConditions;
  hourly: HourlyConditions[];
  forecast: ForecastDay[];
  water: WaterConditions;
  amenities: AmenityPoint[];
  insights: AreaInsights;
  outlook: FishingOutlook;
  sources: SourceMeta;
}

export interface SearchResponse {
  locations: FishingLocation[];
  usedFallback: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  bundle: LocationIntelligenceBundle;
  messages: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  supportingFactors: string[];
  cautions: string[];
  followUps: string[];
  usedFallback: boolean;
}
