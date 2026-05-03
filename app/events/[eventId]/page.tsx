import EventActions from "@/app/components/EventActions";
import RSVPButtons from "@/app/components/RSVPButtons";
import { auth } from "@/auth";
import type { Event, RSVPStatus } from "@/lib/models";
import AttendeesIcon from "@/public/AttendeesIcon";
import DateIcon from "@/public/DateIcon";
import LocationIcon from "@/public/LocationIcon";
import { format } from "date-fns";
import Link from "next/link";
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
    { next: { tags: [`event-${eventId}`] } },
  );
  if (!eventsResponse.ok) {
    notFound();
  }

  const event: Event = await eventsResponse.json();

  let currentRSVP: RSVPStatus | undefined;

  if (session?.user?.id) {
    const rsvp = event.rsvps.find((r) => r.userId === session.user.id);
    currentRSVP = rsvp?.status;
  }

  const isOwner = session?.user?.id === event.userId;

  const isPast = new Date(event.date) < new Date();

  const goingRSVPs = event.rsvps.filter((r) => r.status === "GOING");
  const maybeRSVPs = event.rsvps.filter((r) => r.status === "MAYBE");
  const notGoingRSVPs = event.rsvps.filter((r) => r.status === "NOT_GOING");
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
                  <span className="font-medium">
                    {event._count.rsvps} answered / {event.maxAttendees} max
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isPast && event.isPublic && (
            <RSVPButtons eventId={event.id} currentRSVP={currentRSVP} />
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
      {event.isPublic && event.rsvps.length > 0 && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Attendees</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* GOING */}
            {goingRSVPs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  Going ({goingRSVPs.length})
                </h3>
              </div>
            )}
            {goingRSVPs.map((rsvp) => (
              <div key={rsvp.userId} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mt-1 mr-2"></div>
                <span className="text-foreground">{rsvp.user.name}</span>
              </div>
            ))}
            {/* MAYBE */}

            {maybeRSVPs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-yellow-600 mb-3">
                  Maybe ({maybeRSVPs.length})
                </h3>
              </div>
            )}
            {maybeRSVPs.map((rsvp) => (
              <div key={rsvp.userId} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-600 mt-1 mr-2"></div>
                <span className="text-foreground">{rsvp.user.name}</span>
              </div>
            ))}
            {/* NOT GOING */}

            {notGoingRSVPs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-3">
                  Not Going ({notGoingRSVPs.length})
                </h3>
              </div>
            )}
            {notGoingRSVPs.map((rsvp) => (
              <div key={rsvp.userId} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mt-1 mr-2"></div>
                <span className="text-foreground">{rsvp.user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-center">
        <Link href="/events" className="btn-secondary">
          &larr; Back to all events
        </Link>
      </div>
    </div>
  );
}
