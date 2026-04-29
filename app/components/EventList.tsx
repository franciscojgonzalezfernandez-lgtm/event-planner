"use client";

import AttendeesIcon from "@/public/AttendeesIcon";
import DateIcon from "@/public/DateIcon";
import LocationIcon from "@/public/LocationIcon";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number;
  image: string;
  user: {
    name: string;
    email: string;
  };
}

interface EventListProps {
  events: Event[];
  searchParams: { query?: string };
  isAuthenticated: boolean;
}
export default function EventList({
  events,
  searchParams,
  isAuthenticated,
}: EventListProps) {
  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div></div>
      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="card overflow-hidden transition-shadow hover:shadow-lg px-6"
          >
            <div className="py-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {event.title}
              </h3>
              <p className="text-muted mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center">
                  <DateIcon />
                  {format(new Date(event.date), "PPP 'at' p")}
                </div>
                <div className="flex items-center">
                  <LocationIcon />
                  {event.location}
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center">
                    <AttendeesIcon />
                    {event.maxAttendees}
                  </div>
                )}

                <div className="flex items-center">
                  <AttendeesIcon />
                  by {event.user.name || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
