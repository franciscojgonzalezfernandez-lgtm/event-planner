import { auth } from "@/auth";
import type { Event } from "@/lib/models";
import { notFound, redirect } from "next/navigation";
import EditEventForm from "./EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/${eventId}`,
    { next: { tags: [`event-${eventId}`] } },
  );

  if (!response.ok) {
    notFound();
  }

  const event: Event = await response.json();

  if (session?.user?.id !== event.userId) {
    redirect(`/events/${eventId}`);
  }

  return <EditEventForm event={event} />;
}
