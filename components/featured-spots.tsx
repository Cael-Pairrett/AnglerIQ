import { mockBundle, featuredLocations } from "@/data/mock/locations";
import { LocationCard } from "@/components/location-card";
import { SectionHeading } from "@/components/section-heading";

export function FeaturedSpots() {
  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Start Here"
        title="Featured fisheries with demo-ready intelligence"
        description="These example locations are seeded so AnglerIQ feels useful even before you connect live data keys or services."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {featuredLocations.map((location, index) => (
          <LocationCard
            key={location.id}
            location={location}
            outlook={index === 0 ? mockBundle.outlook : undefined}
          />
        ))}
      </div>
    </section>
  );
}
