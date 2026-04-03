import { formatDistance, formatMph } from "@/lib/format";
import { hasOpenAI } from "@/lib/config";
import type { AmenityPoint, ChatContext, ChatResponse } from "@/types";

function closestAmenity(amenities: AmenityPoint[], type: AmenityPoint["type"]) {
  return amenities
    .filter((item) => item.type === type)
    .sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999))[0];
}

function buildFallbackResponse(context: ChatContext): ChatResponse {
  const latestQuestion = context.messages.at(-1)?.content.toLowerCase() ?? "";
  const { bundle } = context;
  const ramp = closestAmenity(bundle.amenities, "boat_ramp");
  const shore = closestAmenity(bundle.amenities, "shore_access");

  let answer = bundle.outlook.explanation;
  if (latestQuestion.includes("tomorrow morning")) {
    answer = `Yes, ${bundle.outlook.rating.toLowerCase()} conditions are lining up for tomorrow morning. The best window is ${bundle.outlook.bestTimeWindow}, with ${formatMph(bundle.current.windSpeedMph)} wind and a ${bundle.outlook.confidence.toLowerCase()} confidence outlook.`;
  } else if (latestQuestion.includes("small boat") || latestQuestion.includes("wind")) {
    answer = bundle.current.windSpeedMph <= 12
      ? `Wind looks manageable for a small boat right now, but you should still favor the more protected side of the water. Expect about ${formatMph(bundle.current.windSpeedMph)} with more exposure later in the day.`
      : `Wind is the main caution right now. At about ${formatMph(bundle.current.windSpeedMph)}, a small boat should stick to sheltered water or wait for the calmer morning window.`;
  } else if (latestQuestion.includes("sunrise") || latestQuestion.includes("evening")) {
    answer = `${bundle.insights.timingBias.value}. Based on the current forecast, the cleaner window is ${bundle.outlook.bestTimeWindow}.`;
  } else if (latestQuestion.includes("river level") || latestQuestion.includes("water level")) {
    answer = bundle.water.trendNote
      ? `${bundle.water.trendNote} ${bundle.water.gaugeHeightFt ? `Current gauge height is about ${bundle.water.gaugeHeightFt.toFixed(1)} ft.` : ""}`.trim()
      : "Direct water-level data is limited here, so the app is leaning on weather trend estimates instead.";
  } else if (latestQuestion.includes("bank") || latestQuestion.includes("shore")) {
    answer = shore
      ? `This spot looks reasonably bank-fishing friendly. The nearest mapped shore access is ${shore.name}, about ${formatDistance(shore.distanceMiles)} away.`
      : `Bank access is possible, but public shoreline access is not strongly confirmed here. I’d focus on developed access points before making a longer trip.`;
  } else if (latestQuestion.includes("boat ramp") || latestQuestion.includes("ramp")) {
    answer = ramp
      ? `The nearest mapped boat ramp is ${ramp.name}, roughly ${formatDistance(ramp.distanceMiles)} from the selected area.`
      : "I don't have a confirmed ramp in the current map data, so I’d verify launch access locally before towing out.";
  }

  return {
    answer,
    supportingFactors: bundle.outlook.reasons,
    cautions: bundle.outlook.cautions,
    followUps: [
      "Is sunrise or evening better here?",
      "Would this be comfortable from the bank?",
      "What is the main risk before I go?"
    ],
    usedFallback: true
  };
}

export async function answerChat(context: ChatContext): Promise<ChatResponse> {
  if (!hasOpenAI) {
    return buildFallbackResponse(context);
  }

  // The app remains fully functional without an LLM. This branch is structured
  // for easy extension once an API key is configured.
  return buildFallbackResponse(context);
}
