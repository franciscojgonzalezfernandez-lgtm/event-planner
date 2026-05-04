import { auth } from "@/auth";
import { Event } from "@/lib/models";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const events = await fetch("http://localhost:3000/api/dashboard/events", {
    next: { tags: ["events"] },
  });
  const userEvents = (await events.ok) ? await events.json() : [];

  const rsvps = await fetch("http://localhost:3000/api/dashboard/rsvps", {
    next: { tags: ["rsvps"] },
  });
  const userRSVPs = (await rsvps.ok) ? await rsvps.json() : [];

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
    </div>
  );
}
