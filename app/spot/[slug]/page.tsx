import { notFound } from "next/navigation";
import { DetailHero } from "@/components/detail-hero";
import { SectionHeading } from "@/components/section-heading";
import { ConditionsGrid } from "@/components/conditions-grid";
import { ForecastSection } from "@/components/forecast-section";
import { TrendCharts } from "@/components/trend-charts";
import { MapPanel } from "@/components/map-panel";
import { InsightsPanel } from "@/components/insights-panel";
import { ChatPanelShell } from "@/components/chat-panel-shell";
import { RecentTracker } from "@/components/recent-tracker";
import { slugify } from "@/lib/utils";
import { getLocationBundle } from "@/server/services/location-intelligence";
import type { FishingLocation } from "@/types";

function locationFromParams(
  slug: string,
  params: Record<string, string | string[] | undefined>
): FishingLocation | null {
  const name = typeof params.name === "string" ? params.name : undefined;
  const region = typeof params.region === "string" ? params.region : undefined;
  const lat = typeof params.lat === "string" ? Number(params.lat) : NaN;
  const lon = typeof params.lon === "string" ? Number(params.lon) : NaN;
  if (!name || !region || Number.isNaN(lat) || Number.isNaN(lon)) return null;

  return {
    id: typeof params.id === "string" ? params.id : slug,
    slug: slugify(slug),
    name,
    regionLabel: region,
    state: typeof params.state === "string" ? params.state : undefined,
    latitude: lat,
    longitude: lon,
    waterbodyType:
      typeof params.type === "string"
        ? (params.type as FishingLocation["waterbodyType"])
        : "unknown",
    source: "mock"
  };
}

export default async function SpotDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const route = await params;
  const query = await searchParams;
  const location = locationFromParams(route.slug, query);

  if (!location) {
    notFound();
  }

  const bundle = await getLocationBundle(location);

  return (
    <div className="space-y-8">
      <DetailHero bundle={bundle} />
      <RecentTracker location={bundle.location} />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Right now"
          title="Current fishing conditions"
          description="A quick read on current weather, light, pressure, and water signals that matter before you leave."
        />
        <ConditionsGrid current={bundle.current} water={bundle.water} />
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Next several days"
          title="Forecast and bite trend"
          description="Projected daily outlook, best windows, and the weather factors that improve or hurt the trip."
        />
        <ForecastSection forecast={bundle.forecast} />
      </section>

      <TrendCharts hourly={bundle.hourly} forecast={bundle.forecast} />

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <MapPanel location={bundle.location} amenities={bundle.amenities} />
        <ChatPanelShell bundle={bundle} />
      </div>

      <InsightsPanel insights={bundle.insights} />
    </div>
  );
}
