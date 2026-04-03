import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ScoreBadge } from "@/components/score-badge";
import { FavoriteButton } from "@/components/favorite-button";
import type { FishingLocation, FishingOutlook } from "@/types";

export function LocationCard({
  location,
  outlook
}: {
  location: FishingLocation;
  outlook?: FishingOutlook;
}) {
  return (
    <article className="card-surface rounded-[1.5rem] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.24em] text-[var(--pine-soft)]">
            <span>{location.waterbodyType}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--pine-soft)]" />
            <span>{location.source === "mock" ? "Demo-ready" : "Live search"}</span>
          </div>
          <h3 className="text-2xl font-semibold">{location.name}</h3>
          <p className="mt-2 inline-flex items-center gap-2 font-sans text-sm text-[var(--muted)]">
            <MapPin className="h-4 w-4 text-[var(--lake)]" />
            {location.regionLabel}
          </p>
          {location.description ? (
            <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">
              {location.description}
            </p>
          ) : null}
        </div>
        <FavoriteButton location={location} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {outlook ? <ScoreBadge outlook={outlook} /> : null}
        <Link
          href={`/spot/${location.slug}?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(location.name)}&type=${location.waterbodyType}&region=${encodeURIComponent(location.regionLabel)}&state=${encodeURIComponent(location.state ?? "")}&id=${location.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--pine),var(--lake))] px-4 py-2 font-sans text-sm font-semibold text-white"
        >
          View intelligence
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
