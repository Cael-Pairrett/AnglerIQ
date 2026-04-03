import { ClientStorageSections } from "@/components/client-storage-sections";
import { SectionHeading } from "@/components/section-heading";

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <section className="card-surface rounded-[1.8rem] p-6 lg:p-8">
        <SectionHeading
          eyebrow="Local favorites"
          title="Saved spots and recent checks"
          description="This MVP stores your fishing history locally in the browser so you can revisit places without creating an account."
        />
      </section>
      <ClientStorageSections />
    </div>
  );
}
