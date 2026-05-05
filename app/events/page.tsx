import type { Metadata } from "next";
import { auth } from "@/auth";
import EventList from "../components/EventList";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse Events",
  description:
    "Discover and join upcoming social and professional events. Search, filter by date, and find what's happening near you.",
  openGraph: {
    title: "Browse Events | Evently",
    description:
      "Discover and join upcoming social and professional events near you.",
    url: "/events",
  },
  twitter: {
    title: "Browse Events | Evently",
    description:
      "Discover and join upcoming social and professional events near you.",
  },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  /* const events = await getEvents(); */
  const session = await auth();
  const sp = await searchParams;

  const params = new URLSearchParams();
  if (sp.search) params.set("search", sp.search);
  if (sp.filter) params.set("filter", sp.filter);

  const eventsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events?${params.toString()}`,
    { next: { tags: ["events"] } },
  );
  const events = eventsResponse.ok ? await eventsResponse.json() : [];

  console.log(events);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted mt-2">
            Discover amazing events in your area
          </p>
        </div>
        {session && (
          <Link href="/events/create" className="btn-primary">
            Create Event
          </Link>
        )}
      </div>
      <EventList
        events={events}
        searchParams={sp}
        isAuthenticated={!!session}
      />
    </div>
  );
}
