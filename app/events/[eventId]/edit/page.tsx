import { auth } from "@/auth";
import EventForm from "@/app/components/EventForm";
import type { Event } from "@/lib/models";
import { notFound, redirect, unauthorized } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    unauthorized();
  }

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

  return <EventForm event={event} />;
}
