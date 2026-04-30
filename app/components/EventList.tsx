"use client";

import AttendeesIcon from "@/public/AttendeesIcon";
import DateIcon from "@/public/DateIcon";
import LocationIcon from "@/public/LocationIcon";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  searchParams: { search?: string; filter?: string };
  isAuthenticated: boolean;
}
export default function EventList({
  events,
  searchParams,
  isAuthenticated,
}: EventListProps) {
  const router = useRouter();
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const filter = formData.get("filter") as string;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("filter", filter);

    router.push(`/events?${params.toString()}`);
  }
  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
          <div className="flex-1 mw-w-64">
            <input
              name="search"
              type="search"
              placeholder="Search events..."
              defaultValue={searchParams.search}
              className="input-field"
            />
          </div>
          <select
            name="filter"
            className="input-filed w-auto"
            defaultValue={searchParams.filter}
          >
            <option value="">All events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <button type="submit" className="btn-primary">
            Filter
          </button>
        </form>
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted text-lg">No events found</p>
          {isAuthenticated && (
            <Link
              className="btn-primary mt-4 inline-block"
              href={"/events/create"}
            >
              Create the first event
            </Link>
          )}
        </div>
      )}
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
              <div className="mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
