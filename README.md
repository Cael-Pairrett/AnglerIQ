# AnglerIQ

AnglerIQ is a modern freshwater fishing intelligence web app built with Next.js, TypeScript, Tailwind CSS, Leaflet, and Recharts. It helps anglers decide whether a specific location is worth fishing right now or in the coming days by combining weather, forecast, available water conditions, public access information, local amenities, and a built-in assistant.

## Features

- Search freshwater locations by name, state, or ZIP
- Fishing Outlook Score with confidence, explanations, and cautions
- Forecast cards and score-trend charts for the next several days
- Interactive map with boat ramps, shore access, parking, restrooms, campgrounds, and tackle-related points
- Area insights panel for shore access, boat friendliness, and trip-readiness
- Built-in chatbot with deterministic fallback answers and optional LLM-ready wiring
- Local favorites and recent spots stored in browser local storage
- Demo data fallback so the app still works when live APIs are missing or unavailable

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Leaflet + React Leaflet
- Recharts
- Zod
- Vitest

## Project Structure

```text
angleriq/
  app/
    api/
    favorites/
    search/
    spot/[slug]/
  components/
  data/mock/
  lib/
  server/
    providers/
    services/
  tests/
  types/
```

## Environment Variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_APP_NAME=AnglerIQ
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1/forecast
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
OVERPASS_BASE_URL=https://overpass-api.de/api/interpreter
USGS_BASE_URL=https://waterservices.usgs.gov/nwis
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_ENABLE_LIVE_DATA=true
```

Notes:

- Leave `OPENAI_API_KEY` empty to use the deterministic in-app fallback assistant.
- Set `NEXT_PUBLIC_ENABLE_LIVE_DATA=false` to force demo mode for local design review or offline development.

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Run Tests

```bash
npm run test
```

## Live Data Strategy

AnglerIQ is designed to stay usable even when one or more providers are unavailable.

- Weather and forecast: Open-Meteo
- Location search: Nominatim
- Amenities and access points: Overpass / OpenStreetMap
- Water levels and discharge: USGS NWIS where nearby gauge coverage exists
- Chat assistant: deterministic fallback, with an optional LLM-ready service boundary

If provider calls fail, the app falls back to seeded freshwater demo data and labels lower-confidence assumptions in the UI.

## Important Implementation Notes

- The app is freshwater-focused and U.S.-first for the MVP.
- Fishing scoring is deterministic and weighted by weather, wind, pressure, cloud cover, seasonality, and available water data.
- Favorites and recent spots are intentionally local-only in this first version.
- LLM integration is optional by design so the app remains functional without paid APIs.

## Known Constraints In This Workspace

This repository was scaffolded in an environment where `node` and `npm` were not installed, so the code could not be executed, linted, or build-tested here. Once Node.js is installed locally, run:

```bash
npm install
npm run test
npm run build
```

That will be the first runtime verification pass.
