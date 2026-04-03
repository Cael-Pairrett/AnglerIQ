import { ClientStorageSections } from "@/components/client-storage-sections";
import { FeaturedSpots } from "@/components/featured-spots";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <ClientStorageSections />
      <FeaturedSpots />
      <section className="card-surface rounded-[1.8rem] p-6 lg:p-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Built to make a go or no-go decision fast"
          description="The app combines live weather, forecast trend, access mapping, and available water data into one readable recommendation instead of forcing anglers to check five different sites."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Search a freshwater location by name, state, or ZIP.",
            "Read the Fishing Outlook Score and best-time guidance.",
            "Check access, future trend, and ask the assistant before you head out."
          ].map((item, index) => (
            <div key={item} className="rounded-[1.4rem] bg-white/65 p-5">
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-[var(--pine-soft)]">
                Step {index + 1}
              </p>
              <p className="mt-3 text-lg font-semibold leading-7">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
