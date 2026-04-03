"use client";

import { useMemo, useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import type { ChatMessage, LocationIntelligenceBundle } from "@/types";

const prompts = [
  "Is it worth going here tomorrow morning?",
  "Will the wind make this bad for a small boat?",
  "Is this a good bank fishing location?"
];

export function ChatPanel({ bundle }: { bundle: LocationIntelligenceBundle }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask about timing, wind, access, boat comfort, or what might make this trip a bad call."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const allMessages = useMemo(() => messages, [messages]);

  async function submit(content: string) {
    if (!content.trim()) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle,
          messages: nextMessages.filter((item) => item.role !== "assistant" || item.content !== messages[0]?.content)
        })
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer ?? "I couldn't build a grounded answer just now." }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I couldn't reach the assistant route, so rely on the outlook summary and map notes for now."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-surface flex h-full flex-col rounded-[1.6rem] p-6">
      <div className="mb-4">
        <p className="font-sans text-xs uppercase tracking-[0.26em] text-[var(--pine-soft)]">
          In-site fishing assistant
        </p>
        <h3 className="mt-2 text-2xl font-semibold">Ask precise trip questions</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => submit(prompt)}
            className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-left font-sans text-sm text-[var(--muted)] transition hover:bg-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto rounded-[1.4rem] bg-[rgba(255,255,255,0.5)] p-4">
        {allMessages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-[1.2rem] px-4 py-3 font-sans text-sm leading-6 ${
              message.role === "assistant"
                ? "bg-[rgba(29,79,67,0.1)] text-[var(--foreground)]"
                : "ml-auto bg-[rgba(33,77,103,0.12)] text-[var(--foreground)]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <div className="inline-flex items-center gap-2 rounded-[1.2rem] bg-[rgba(29,79,67,0.1)] px-4 py-3 font-sans text-sm text-[var(--muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking through the spot conditions...
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(input);
        }}
        className="mt-4 flex items-center gap-3 rounded-[1.4rem] bg-white/70 p-3"
      >
        <input
          suppressHydrationWarning
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about tomorrow morning, boat comfort, or bank access..."
          autoComplete="off"
          className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-[var(--muted)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pine),var(--lake))] text-white disabled:opacity-60"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
