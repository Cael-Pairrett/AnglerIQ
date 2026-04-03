import { endpoints } from "@/lib/config";
import { isZipQuery, slugify } from "@/lib/utils";
import type { FishingLocation } from "@/types";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    state?: string;
    postcode?: string;
  };
}

function inferWaterbodyType(type: string): FishingLocation["waterbodyType"] {
  if (type.includes("river")) return "river";
  if (type.includes("reservoir")) return "reservoir";
  if (type.includes("pond")) return "pond";
  if (type.includes("water") || type.includes("lake")) return "lake";
  return "unknown";
}

export async function searchLocations(query: string): Promise<FishingLocation[]> {
  const url = new URL(`${endpoints.nominatim}/search`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "8");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("q", query);

  if (isZipQuery(query)) {
    url.searchParams.set("countrycodes", "us");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AnglerIQ/0.1"
    },
    next: { revalidate: 60 * 30 }
  });

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  const results = (await response.json()) as NominatimResult[];

  return results.map((item) => {
    const [name, ...rest] = item.display_name.split(",");
    return {
      id: String(item.place_id),
      slug: slugify(name),
      name,
      state: item.address?.state,
      zipCode: item.address?.postcode,
      regionLabel: rest.slice(0, 2).join(", ").trim() || item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      waterbodyType: inferWaterbodyType(item.type),
      description: `Mapped from public search data for ${name}.`,
      source: "nominatim"
    } satisfies FishingLocation;
  });
}
