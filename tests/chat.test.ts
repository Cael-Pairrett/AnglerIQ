import { describe, expect, test } from "vitest";
import { answerChat } from "@/server/services/chat";
import { mockBundle } from "@/data/mock/locations";

describe("chat fallback", () => {
  test("answers boat ramp questions with location-aware detail", async () => {
    const response = await answerChat({
      bundle: mockBundle,
      messages: [{ role: "user", content: "Where is the nearest boat ramp?" }]
    });

    expect(response.answer.toLowerCase()).toContain("boat ramp");
    expect(response.usedFallback).toBe(true);
  });
});
