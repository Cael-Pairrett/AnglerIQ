import { Compass, Map, MessageSquareText, Waves } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

const highlights = [
  {
    icon: Compass,
    title: "Score the trip",
    text: "See if the spot is worth going to right now, tomorrow, or later this week."
  },
  {
    icon: Waves,
    title: "Read the water",
    text: "Blend weather, wind, pressure, flow, and seasonality into one practical outlook."
  },
  {
    icon: Map,
    title: "Check access",
    text: "Find ramps, parking, shoreline access, restrooms, and tackle stops near the water."
  },
  {
    icon: MessageSquareText,
    title: "Ask specifics",
    text: "Use the built-in assistant for sunrise timing, boat comfort, or bank-fishing questions."
  }
];

export function HeroSection() {
  return (
    <section className="terrain-lines grid gap-6 rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(244,248,244,0.96),rgba(227,236,233,0.88))] p-6 shadow-[0_25px_60px_rgba(16,36,30,0.08)] lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="inline-flex w-fit items-center rounded-full bg-[rgba(29,79,67,0.1)] px-4 py-2 font-sans text-sm text-[var(--pine)]">
          Practical freshwater planning for lakes, rivers, reservoirs, and ponds
        </div>
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Decide if a fishing spot is worth the drive before you hook up the trailer.
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">
            AnglerIQ turns live conditions, upcoming weather, water trends, and nearby access
            into a clear fishing outlook with best-time guidance and trip-ready map notes.
          </p>
        </div>
        <div className="max-w-3xl">
          <SearchBar large />
        </div>
      </div>

      <div className="grid gap-4">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card-surface card-strong rounded-[1.5rem] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(33,77,103,0.12)] text-[var(--lake)]">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
