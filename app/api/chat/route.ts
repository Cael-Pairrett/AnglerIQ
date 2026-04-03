import { NextResponse } from "next/server";
import { z } from "zod";
import { answerChat } from "@/server/services/chat";
import type { ChatContext } from "@/types";

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

  const response = await answerChat(parsed.data as ChatContext);
  return NextResponse.json(response);
}
