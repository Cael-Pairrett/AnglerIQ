"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  defaultValue = "",
  large = false
}: {
  defaultValue?: string;
  large?: boolean;
}) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }}
      className={cn(
        "card-surface flex items-center gap-3 rounded-[1.75rem] border px-4 py-3",
        large && "px-5 py-4"
      )}
    >
      <Search className="h-5 w-5 text-[var(--lake)]" />
      <input
        suppressHydrationWarning
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a lake, river, reservoir, pond, state, or ZIP"
        autoComplete="off"
        className={cn(
          "w-full bg-transparent font-sans text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]",
          large && "text-base"
        )}
      />
      <button
        type="submit"
        className="rounded-full bg-[linear-gradient(135deg,var(--pine),var(--lake))] px-4 py-2 font-sans text-sm font-semibold text-white shadow-lg shadow-[rgba(29,79,67,0.2)] transition hover:translate-y-[-1px]"
      >
        Search
      </button>
    </form>
  );
}
