import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card-surface rounded-[1.8rem] p-8">
      <h1 className="text-3xl font-semibold">That fishing location could not be loaded.</h1>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">
        The detail page needs a selected location with coordinates. Head back to search and pick a
        waterbody again.
      </p>
      <Link
        href="/search"
        className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,var(--pine),var(--lake))] px-4 py-2 font-sans text-sm font-semibold text-white"
      >
        Back to search
      </Link>
    </div>
  );
}
