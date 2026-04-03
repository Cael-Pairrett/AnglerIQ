import { NextResponse } from "next/server";
import { getLocationBundle } from "@/server/services/location-intelligence";
import { slugify } from "@/lib/utils";
import type { FishingLocation } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const region = searchParams.get("region");
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!name || !region || Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: "Missing required location parameters" },
      { status: 400 }
    );
  }

  const location: FishingLocation = {
    id: searchParams.get("id") ?? slugify(name),
    slug: slugify(name),
    name,
    state: searchParams.get("state") ?? undefined,
    regionLabel: region,
    latitude: lat,
    longitude: lon,
    waterbodyType:
      (searchParams.get("type") as FishingLocation["waterbodyType"] | null) ?? "unknown",
    source: "mock"
  };

  const bundle = await getLocationBundle(location);
  return NextResponse.json(bundle);
}
