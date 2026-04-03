"use client";

import { useEffect } from "react";
import { storage } from "@/lib/storage";
import type { FishingLocation } from "@/types";

export function RecentTracker({ location }: { location: FishingLocation }) {
  useEffect(() => {
    storage.addRecent(location);
  }, [location]);

  return null;
}
