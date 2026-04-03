import { NextResponse } from "next/server";
import { searchLocationsWithFallback } from "@/server/services/location-intelligence";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const results = await searchLocationsWithFallback(query);
  return NextResponse.json(results);
}
