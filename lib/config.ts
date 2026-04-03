export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "AnglerIQ";
export const ENABLE_LIVE_DATA =
  process.env.NEXT_PUBLIC_ENABLE_LIVE_DATA !== "false";

export const endpoints = {
  openMeteo:
    process.env.OPEN_METEO_BASE_URL ?? "https://api.open-meteo.com/v1/forecast",
  nominatim:
    process.env.NOMINATIM_BASE_URL ?? "https://nominatim.openstreetmap.org",
  overpass:
    process.env.OVERPASS_BASE_URL ?? "https://overpass-api.de/api/interpreter",
  usgs:
    process.env.USGS_BASE_URL ?? "https://waterservices.usgs.gov/nwis"
};

export const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
