import { auth } from "@/auth";
import { Event, EventRSVP } from "@/lib/models";
import AttendeesIcon from "@/public/AttendeesIcon";
import DateIcon from "@/public/DateIcon";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const events = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/events`,
    {
      next: { tags: ["events"] },
    },
  );
  const userEvents = (await events.ok) ? await events.json() : [];
  console.log(userEvents);

  const rsvps = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/rsvps`,
    {
      next: { tags: ["rsvps"] },
    },
  );
  const userRSVPs: EventRSVP[] = (await rsvps.ok) ? await rsvps.json() : [];

  const now = new Date();
  const upcomingEvents = userEvents.filter(
    (event: Event) => new Date(event.date) > now,
  );
  const pastEvents = userEvents.filter(
    (event: Event) => new Date(event.date) < now,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-foreground">Dashboard</h1>
        <p className="text-muted mt-2">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>
      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/events/create" className="btn-primary">
            Create Event
          </Link>
          <Link href="/events" className="btn-secondary">
            View All Events
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Events */}
        <div className="card p-6">
          <h2 className="text-3xl font-semibold">Total Events</h2>
          <p className="text-3xl font-bold text-primary">{userEvents.length}</p>
        </div>
        {/* Total Events */}
        <div className="card p-6">
          <h2 className="text-3xl font-semibold">Upcoming Events</h2>
          <p className="text-3xl font-bold text-primary">
            {upcomingEvents.length}
          </p>
        </div>
        {/* Total Events */}
        <div className="card p-6">
          <h2 className="text-3xl font-semibold">Past Events</h2>
          <p className="text-3xl font-bold text-primary">{pastEvents.length}</p>
        </div>
        {/* Total Events */}
        <div className="card p-6">
          <h2 className="text-3xl font-semibold">My RSVPs</h2>
          <p className="text-3xl font-bold text-primary">{userRSVPs.length}</p>
        </div>
      </div>
      {/* My events */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Events</h2>
          <Link
            href="/events/create"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            + Create Event
          </Link>
        </div>
        {userEvents.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-muted">
              You haven&apos;t created any events yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.map((event: Event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="card p-4 hover:bg-secondary transition-colors"
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-muted mt-1">{event.description}</p>
                <div className="flex items-center mt-2">
                  <DateIcon className="text-primary" />
                  <p className="text-sm text-muted mt-1">
                    {format(new Date(event.date), "MMMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <AttendeesIcon className="text-primary" />
                  <p className="text-sm text-muted mt-1">
                    {event._count?.rsvps || 0} RSVPs
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* My RSVPs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My RSVPs</h2>
        {userRSVPs.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-muted">
              You haven&apos;t RSVPed to any events yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRSVPs.map((rsvp: EventRSVP, key) => (
              <div className="card p-6 space-y-4" key={key}>
                <h3 className="text-lg font-semibold">{rsvp.event?.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${rsvp.status === "GOING" ? "bg-green-600/20 text-green-400" : rsvp.status === "NOT_GOING" ? "bg-red-600/20 text-red-400" : "bg-yellow-600/20 text-yellow-400"}`}
                >
                  {rsvp.status}
                </span>
                <p className="text-sm text-muted mt-2">
                  {rsvp.event?.description}
                </p>
                <div className="flex items-center mt-2">
                  <DateIcon className="text-primary" />
                  <p className="text-sm text-muted mt-1">
                    {format(new Date(rsvp.event!.date), "MMMM d, yyyy h:mm a")}
                  </p>
                </div>

                <div className="flex items-center mt-2">
                  <AttendeesIcon className="text-primary" />
                  <p className="text-sm text-muted mt-1">
                    by {rsvp.event?.user.name || "Unknown host"}
                  </p>
                </div>

                <Link
                  href={`/events/${rsvp.event?.id}`}
                  className="btn-primary mt-2 text-center text-sm"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
