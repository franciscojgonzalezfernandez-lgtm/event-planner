import EventActions from "@/app/components/EventActions";
import RSVPButtons from "@/app/components/RSVPButtons";
import { auth } from "@/auth";
import type { Event } from "@/lib/models";
import AttendeesIcon from "@/public/AttendeesIcon";
import DateIcon from "@/public/DateIcon";
import LocationIcon from "@/public/LocationIcon";
import { format } from "date-fns";
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

  const isPast = new Date(event.date) < new Date();
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
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="">
                <DateIcon className="text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
                </p>
                <p className="text-muted">
                  {format(new Date(event.date), "h:m a")}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="">
                <LocationIcon className="text-primary" />
              </div>
              <div>
                <span className="font-medium">{event.location}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="">
                <AttendeesIcon className="text-primary" />
              </div>
              <div>
                <span className="font-medium">
                  Organized by {event.user.name}
                </span>
              </div>
            </div>
            {event.maxAttendees && (
              <div className="flex items-center">
                <div className="">
                  <AttendeesIcon className="text-primary" />
                </div>
                <div>
                  <span className="font-medium">{event.maxAttendees} max</span>
                </div>
              </div>
            )}
          </div>

          {!isPast && event.isPublic && (
            <RSVPButtons eventId={event.id} currentRSVP="MAYBE" />
          )}
          {isPast && (
            <div className="text-center p-4">
              <p className="text-muted">This event has already happened</p>
            </div>
          )}
          {!event.isPublic && (
            <div className="text-center p-4">
              <p className="text-muted">This is a private event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
