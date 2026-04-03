"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { AmenityPoint, FishingLocation } from "@/types";

const locationIcon = L.divIcon({
  className: "custom-location-marker",
  html: `<div style="background:#214d67;width:18px;height:18px;border-radius:999px;border:3px solid white;box-shadow:0 8px 18px rgba(0,0,0,0.18);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const amenityIcon = L.divIcon({
  className: "custom-amenity-marker",
  html: `<div style="background:#1d4f43;width:14px;height:14px;border-radius:999px;border:2px solid white;box-shadow:0 8px 18px rgba(0,0,0,0.18);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export default function MapRenderer({
  location,
  amenities
}: {
  location: FishingLocation;
  amenities: AmenityPoint[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if ((container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
      delete (container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
    }

    const map = L.map(container, {
      center: [location.latitude, location.longitude],
      zoom: 12,
      scrollWheelZoom: false
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([location.latitude, location.longitude], { icon: locationIcon })
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong><br/>Selected fishing area`);

    amenities.forEach((amenity) => {
      L.marker([amenity.latitude, amenity.longitude], { icon: amenityIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${amenity.name}</strong><br/>${amenity.type.replace("_", " ")}<br/>${amenity.relevanceNote}`
        );
    });

    return () => {
      map.remove();
      mapRef.current = null;
      if ((container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
        delete (container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
      }
    };
  }, [location.id, location.latitude, location.longitude, location.name, amenities]);

  return <div ref={containerRef} className="h-full w-full rounded-[1.5rem]" />;
}
