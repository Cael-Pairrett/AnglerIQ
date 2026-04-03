import { SearchBar } from "@/components/search-bar";
import { LocationCard } from "@/components/location-card";
import { SectionHeading } from "@/components/section-heading";
import { searchLocationsWithFallback } from "@/server/services/location-intelligence";

export default async function SearchPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";
  const results = query ? await searchLocationsWithFallback(query) : null;

  return (
    <div className="space-y-8">
      <section className="card-surface rounded-[1.8rem] p-6 lg:p-8">
        <SectionHeading
          eyebrow="Search freshwater water"
          title="Find your next lake, river, reservoir, or access point"
          description="Search by waterbody name, nearby region, or ZIP to compare places before committing the drive."
        />
        <div className="mt-5 max-w-3xl">
          <SearchBar defaultValue={query} />
        </div>
      </section>

      {results ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeading
              title={results.usedFallback ? "Showing demo-backed results" : "Matching locations"}
              description={
                results.usedFallback
                  ? "Live search was unavailable or too sparse, so AnglerIQ is showing reliable demo locations instead."
                  : `Results for "${query}"`
              }
            />
          </div>
          <div className="grid gap-4">
            {results.locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </section>
      ) : (
        <section className="card-surface rounded-[1.8rem] p-6">
          <p className="font-sans text-sm leading-6 text-[var(--muted)]">
            Start with a waterbody name like “Kentucky Lake,” a place like “Madison WI,” or a ZIP code to find nearby freshwater fishing areas.
          </p>
        </section>
      )}
    </div>
  );
}
