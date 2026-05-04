"use client";

import { deleteEvent } from "@/lib/event-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EventActionProps = {
  eventId: string;
};

export default function EventActions({ eventId }: EventActionProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this event? This actio cannot be undone",
      )
    ) {
      return;
    }
    try {
      setIsDeleting(true);
      const result = await deleteEvent(eventId);
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to delete event: " + result.error);
      }
    } catch (err) {
      alert("An error ocucured while deleting the event");
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div className="flex gap-3">
      <button
        className="btn-secondary"
        onClick={() => {
          router.push(`/events/${eventId}/edit`);
        }}
      >
        Edit event
      </button>
      <button
        className="btn-danger"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting event..." : "Delete event"}
      </button>
    </div>
  );
}
