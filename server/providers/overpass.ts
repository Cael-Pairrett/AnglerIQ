import { endpoints } from "@/lib/config";
import { milesBetween } from "@/lib/utils";
import type { AmenityPoint, AmenityType } from "@/types";

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

const mappings: Array<{ matcher: (tags: Record<string, string>) => AmenityType | null }> = [
  {
    matcher: (tags) => {
      if (tags.leisure === "marina") return "marina";
      if (tags.leisure === "fishing") return "pier";
      if (tags.tourism === "camp_site") return "campground";
      if (tags.amenity === "toilets") return "restroom";
      if (tags.amenity === "parking") return "parking";
      if (tags.shop === "fishing") return "bait_shop";
      if (tags.shop === "outdoor") return "outdoor_store";
      if (tags.leisure === "slipway") return "boat_ramp";
      if (tags.waterway === "dock") return "pier";
      if (tags.access && tags.access !== "private") return "shore_access";
      return null;
    }
  }
];

export async function getAmenities(
  latitude: number,
  longitude: number
): Promise<AmenityPoint[]> {
  const radius = 10000;
  const query = `
[out:json][timeout:25];
(
  node(around:${radius},${latitude},${longitude})["amenity"~"parking|toilets"];
  node(around:${radius},${latitude},${longitude})["shop"~"fishing|outdoor"];
  node(around:${radius},${latitude},${longitude})["tourism"="camp_site"];
  node(around:${radius},${latitude},${longitude})["leisure"~"marina|slipway|fishing"];
  node(around:${radius},${latitude},${longitude})["waterway"="dock"];
  node(around:${radius},${latitude},${longitude})["access"];
);
out center 30;`;

  const response = await fetch(endpoints.overpass, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: query,
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) {
    throw new Error("Overpass request failed");
  }

  const data = (await response.json()) as OverpassResponse;

  return data.elements
    .map((element) => {
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      const tags = element.tags ?? {};
      const type = mappings.map((entry) => entry.matcher(tags)).find(Boolean);
      if (!lat || !lon || !type) return null;

      return {
        id: String(element.id),
        name: tags.name ?? tags.operator ?? "Nearby access point",
        type,
        latitude: lat,
        longitude: lon,
        distanceMiles: milesBetween(latitude, longitude, lat, lon),
        relevanceNote:
          type === "boat_ramp"
            ? "Useful for launch access."
            : type === "shore_access"
              ? "Possible bank-fishing access."
              : "Helpful pre-trip amenity.",
        source: "osm"
      } satisfies AmenityPoint;
    })
    .filter((item): item is AmenityPoint => Boolean(item))
    .sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999))
    .slice(0, 20);
}
