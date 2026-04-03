import type { AmenityPoint, AreaInsights, DataStatus, FishingLocation } from "@/types";

function hasType(amenities: AmenityPoint[], type: AmenityPoint["type"]) {
  return amenities.some((item) => item.type === type);
}

function buildStatus(condition: boolean): DataStatus {
  return condition ? "confirmed" : "estimated";
}

export function deriveAreaInsights(
  location: FishingLocation,
  amenities: AmenityPoint[]
): AreaInsights {
  const shore = hasType(amenities, "shore_access") || hasType(amenities, "pier");
  const ramps = hasType(amenities, "boat_ramp") || hasType(amenities, "marina");
  const bathrooms = hasType(amenities, "restroom");
  const parking = hasType(amenities, "parking");

  return {
    shoreFishing: {
      label: "Shore Fishing",
      value: shore ? "Likely workable from mapped public access" : "Possible, but public bank access looks limited",
      status: buildStatus(shore)
    },
    boatFriendly: {
      label: "Boat Friendly",
      value: ramps ? "Boat access looks practical" : "Boat access may require local confirmation",
      status: buildStatus(ramps)
    },
    publicRamps: {
      label: "Public Ramps",
      value: ramps ? "Ramp or marina access found nearby" : "No nearby ramp confirmed",
      status: ramps ? "confirmed" : "unavailable"
    },
    bathrooms: {
      label: "Bathrooms",
      value: bathrooms ? "Restrooms appear nearby" : "Bathroom data not confirmed",
      status: bathrooms ? "confirmed" : "unavailable"
    },
    access: {
      label: "Access",
      value: parking || shore || ramps ? "Public access looks fairly straightforward" : "Access may be limited and worth verifying locally",
      status: parking || shore || ramps ? "confirmed" : "estimated"
    },
    timingBias: {
      label: "Best Timing",
      value:
        location.waterbodyType === "river"
          ? "Morning is usually safer while wind and current are more manageable"
          : "Morning and late evening are the best starting bets",
      status: "estimated"
    },
    notes: [
      ramps
        ? "Launch options exist, but exposure to wind still depends on shoreline shape."
        : "Without a confirmed ramp, small-craft plans should be validated before the trip.",
      shore
        ? "Mapped shoreline access improves bank-fishing practicality."
        : "Bank anglers may need to focus on developed access areas or piers.",
      bathrooms || parking
        ? "Core trip amenities appear nearby, which makes quick trips easier."
        : "Amenities may be sparse, so plan supplies before heading out."
    ]
  };
}
