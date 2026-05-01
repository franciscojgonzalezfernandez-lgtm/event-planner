import EventActions from "@/app/components/EventActions";
import { auth } from "@/auth";
import type { Event } from "@/lib/models";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();
  const eventsResponse = await fetch(
    `http://localhost:3000/api/events/${eventId}`,
    { cache: "no-store" },
  );
  if (!eventsResponse.ok) {
    notFound();
  }

  const event: Event = await eventsResponse.json();

  const isOwner = session?.user?.id === event.userId;
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Event header */}
      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {event.title}
            </h1>
            <p className="text-muted mb-6"> {event.description}</p>
          </div>
          {isOwner && <EventActions eventId={event.id} isOwner={isOwner} />}
        </div>
      </div>
    </div>
  );
}
