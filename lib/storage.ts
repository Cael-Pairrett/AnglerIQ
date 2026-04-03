"use client";

import type { FishingLocation } from "@/types";

const FAVORITES_KEY = "angleriq:favorites:v1";
const RECENTS_KEY = "angleriq:recents:v1";

function readLocations(key: string): FishingLocation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as FishingLocation[]) : [];
  } catch {
    return [];
  }
}

function writeLocations(key: string, locations: FishingLocation[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(locations));
}

export const storage = {
  getFavorites: () => readLocations(FAVORITES_KEY),
  getRecents: () => readLocations(RECENTS_KEY),
  toggleFavorite(location: FishingLocation) {
    const favorites = readLocations(FAVORITES_KEY);
    const exists = favorites.some((entry) => entry.id === location.id);
    const next = exists
      ? favorites.filter((entry) => entry.id !== location.id)
      : [location, ...favorites].slice(0, 10);
    writeLocations(FAVORITES_KEY, next);
    return next;
  },
  addRecent(location: FishingLocation) {
    const recents = readLocations(RECENTS_KEY).filter(
      (entry) => entry.id !== location.id
    );
    const next = [location, ...recents].slice(0, 8);
    writeLocations(RECENTS_KEY, next);
    return next;
  }
};
