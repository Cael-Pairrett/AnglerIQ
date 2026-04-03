"use client";

import dynamic from "next/dynamic";
import type { LocationIntelligenceBundle } from "@/types";

const ChatPanelClient = dynamic(
  () => import("@/components/chat-panel").then((mod) => mod.ChatPanel),
  {
    ssr: false,
    loading: () => (
      <section className="card-surface flex h-full min-h-[540px] flex-col rounded-[1.6rem] p-6">
        <div className="mb-4">
          <p className="font-sans text-xs uppercase tracking-[0.26em] text-[var(--pine-soft)]">
            In-site fishing assistant
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Ask precise trip questions</h3>
        </div>
        <div className="flex-1 animate-pulse rounded-[1.4rem] bg-white/60" />
      </section>
    )
  }
);

export function ChatPanelShell({
  bundle
}: {
  bundle: LocationIntelligenceBundle;
}) {
  return <ChatPanelClient bundle={bundle} />;
}
