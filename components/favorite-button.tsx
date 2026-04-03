"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { FishingLocation } from "@/types";

export function FavoriteButton({ location }: { location: FishingLocation }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(storage.getFavorites().some((entry) => entry.id === location.id));
  }, [location.id]);

  return (
    <button
      onClick={() => {
        const next = storage.toggleFavorite(location);
        setActive(next.some((entry) => entry.id === location.id));
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 font-sans text-sm transition",
        active
          ? "border-rose-500/20 bg-rose-500/10 text-rose-800"
          : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:bg-white"
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
      {active ? "Saved" : "Save spot"}
    </button>
  );
}
