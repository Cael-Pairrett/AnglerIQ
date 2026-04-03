"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type { FishingLocation } from "@/types";
import { LocationCard } from "@/components/location-card";
import { SectionHeading } from "@/components/section-heading";

function SpotList({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: FishingLocation[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-5">
      <SectionHeading title={title} description={description} />
      <div className="grid gap-4">
        {items.map((item) => (
          <LocationCard key={item.id} location={item} />
        ))}
      </div>
    </section>
  );
}

export function ClientStorageSections() {
  const [favorites, setFavorites] = useState<FishingLocation[]>([]);
  const [recents, setRecents] = useState<FishingLocation[]>([]);

  useEffect(() => {
    setFavorites(storage.getFavorites());
    setRecents(storage.getRecents());
  }, []);

  return (
    <>
      <SpotList
        title="Recent water you checked"
        description="Jump back into places you have looked at recently."
        items={recents}
      />
      <SpotList
        title="Saved favorites"
        description="Your saved spots stay in local storage so the app works without login."
        items={favorites}
      />
    </>
  );
}
