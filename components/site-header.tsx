import Link from "next/link";
import { Fish, MapPinned, Star } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(232,238,231,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--pine),var(--lake))] text-white shadow-lg shadow-[rgba(33,77,103,0.28)]">
            <Fish className="h-5 w-5" />
          </div>
          <div>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.35em] text-[var(--pine-soft)]">
              Freshwater Intelligence
            </p>
            <p className="text-xl font-semibold tracking-tight">{APP_NAME}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-sans text-sm text-[var(--muted)] transition hover:bg-white/60 hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="card-surface rounded-full px-4 py-2 font-sans text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-2">
              <MapPinned className="h-4 w-4 text-[var(--lake)]" />
              Map access, forecasts, and trip notes
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(29,79,67,0.12)] px-3 py-2 font-sans text-sm text-[var(--pine)]">
            <Star className="h-4 w-4 fill-current" />
            Built for practical anglers
          </div>
        </div>
      </div>
    </header>
  );
}
