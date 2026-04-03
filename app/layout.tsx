import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: `${APP_NAME} | Freshwater Fishing Intelligence`,
  description:
    "Search freshwater fishing locations, compare live conditions, read map access insights, and decide when it is worth going."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="shell">
        <div className="min-h-screen">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
