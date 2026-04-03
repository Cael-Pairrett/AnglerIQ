import { NextResponse } from "next/server";
import { z } from "zod";
import { answerChat } from "@/server/services/chat";
import type { ChatContext, LocationIntelligenceBundle } from "@/types";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string()
});

const requestSchema = z.object({
  bundle: z.any(),
  messages: z.array(messageSchema)
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
  }

  const context: ChatContext = {
    bundle: parsed.data.bundle as LocationIntelligenceBundle,
    messages: parsed.data.messages
  };

  const response = await answerChat(context);
  return NextResponse.json(response);
}
