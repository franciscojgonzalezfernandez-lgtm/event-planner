"use client";

import { updateEvent } from "@/lib/event-actions";
import type { Event } from "@/lib/models";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function EditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const updateEventWithId = updateEvent.bind(null, event.id);
  const [state, formAction, isPending] = useActionState(updateEventWithId, {
    success: false,
    error: "",
  });

  if (state.success) {
    router.push(`/events/${event.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="text-muted mt-2">Update the details of your event</p>
      </div>
      <form className="space-y-6" action={formAction}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field"
            defaultValue={event.title}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="input-field"
            rows={4}
            defaultValue={event.description}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              className="input-field"
              defaultValue={format(new Date(event.date), "yyyy-MM-dd'T'HH:mm")}
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="input-field"
              defaultValue={event.location}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Event Cover
          </label>
          <input
            type="text"
            id="image"
            name="image"
            className="input-field"
            placeholder="Enter image URL"
            defaultValue={event.image ?? ""}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Maximum Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="1"
              className="input-field"
              placeholder="Leave empty for unlimited"
              defaultValue={event.maxAttendees ?? ""}
            />
          </div>
          <div>
            <label
              htmlFor="isPublic"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Event visibility
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                defaultChecked={event.isPublic}
                className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-slate-800"
              />
              <label className="text-foreground ml-2 block">
                Make this event public
              </label>
            </div>
          </div>
        </div>
        {state.error && (
          <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-md">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}
        <div className="flex gap-4">
          <button className="btn-primary" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </button>
          <button
            className="btn-secondary"
            type="button"
            disabled={isPending}
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
