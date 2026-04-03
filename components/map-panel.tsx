"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { AmenityPoint, FishingLocation } from "@/types";
import { cn } from "@/lib/utils";

const LeafletMap = dynamic(() => import("@/components/map-renderer"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-[1.5rem] bg-white/60" />
});

const filterLabels: Array<{ type: AmenityPoint["type"]; label: string }> = [
  { type: "boat_ramp", label: "Ramps" },
  { type: "shore_access", label: "Shore" },
  { type: "parking", label: "Parking" },
  { type: "restroom", label: "Restrooms" },
  { type: "campground", label: "Camping" },
  { type: "bait_shop", label: "Tackle" }
];

export function MapPanel({
  location,
  amenities
}: {
  location: FishingLocation;
  amenities: AmenityPoint[];
}) {
  const [active, setActive] = useState<AmenityPoint["type"][]>([
    "boat_ramp",
    "shore_access",
    "parking",
    "restroom"
  ]);

  const filtered = useMemo(
    () => amenities.filter((item) => active.includes(item.type)),
    [active, amenities]
  );
  const mapKey = `${location.id}-${location.latitude}-${location.longitude}`;
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    setMapVisible(false);
    const timer = window.setTimeout(() => setMapVisible(true), 0);
    return () => window.clearTimeout(timer);
  }, [mapKey]);

  useEffect(() => {
    setMapVisible(true);
  }, []);

  return (
    <section className="card-surface rounded-[1.6rem] p-6">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.26em] text-[var(--pine-soft)]">
            Access map
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Ramps, shoreline access, and trip amenities</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterLabels.map((item) => {
            const selected = active.includes(item.type);
            return (
              <button
                key={item.type}
                onClick={() =>
                  setActive((current) =>
                    selected
                      ? current.filter((entry) => entry !== item.type)
                      : [...current, item.type]
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-2 font-sans text-sm transition",
                  selected
                    ? "border-[var(--pine)] bg-[rgba(29,79,67,0.11)] text-[var(--pine)]"
                    : "border-[var(--line)] bg-white/70 text-[var(--muted)]"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[420px] overflow-hidden rounded-[1.5rem]">
        {mapVisible ? (
          <LeafletMap key={mapKey} location={location} amenities={filtered} />
        ) : (
          <div className="h-[420px] animate-pulse rounded-[1.5rem] bg-white/60" />
        )}
      </div>
    </section>
  );
}
