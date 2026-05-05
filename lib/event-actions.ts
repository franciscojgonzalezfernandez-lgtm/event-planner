"use server";

import { auth } from "@/auth";
import z from "zod";
import { prisma } from "./prisma";
import { error } from "console";
import { updateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import { RSVPStatus } from "@/lib/models";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z
    .string()
    .optional()
    .refine((value) => value === undefined || !isNaN(Number(value)), {
      message: "Max attendees must be a number",
    }),
  isPublic: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true; // allow empty value
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Invalid image URL"),
});

export async function createEvent(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      image: formData.get("image") as string | undefined,
      location: formData.get("location") as string,
      maxAttendees: formData.get("maxAttendees") as string | undefined,
      isPublic: formData.get("isPublic") ? "on" : "off",
    };
    const validatedData = eventSchema.parse(rawData);
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        image: validatedData.image || null,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: validatedData.isPublic === "on",
        userId: session.user.id,
      },
    });
    return { success: true, eventId: event.id };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create event", eventId: null };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }
    if (existingEvent.userId !== session.user?.id) {
      return { success: false, error: "Not authorized to delete this event" };
    }
    await prisma.event.delete({
      where: { id: eventId },
    });
    updateTag("events");
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to delete the event" };
  }
}

export async function updateEvent(
  eventId: string,
  _: unknown,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }
    if (existingEvent.userId !== session.user.id) {
      return { success: false, error: "Not authorized to edit this event" };
    }
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      image: (formData.get("image") as string) || undefined,
      location: formData.get("location") as string,
      maxAttendees: (formData.get("maxAttendees") as string) || undefined,
      isPublic: formData.get("isPublic") ? "on" : "off",
    };
    const validatedData = eventSchema.parse(rawData);
    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        image: validatedData.image || null,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: validatedData.isPublic === "on",
      },
    });
    updateTag("events");
    updateTag(`event-${eventId}`);
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to update event" };
  }
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }
    if (!existingEvent.isPublic) {
      return { success: false, error: "Cannot RSVP to private events" };
    }
    if (existingEvent.date < new Date()) {
      return { success: false, error: "Cannot RSVP to past events" };
    }
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });
    if (existingRSVP) {
      await prisma.rSVP.update({
        where: {
          id: existingRSVP.id,
        },
        data: {
          status,
        },
      });
    } else {
      await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          eventId,
          status,
        },
      });
    }
    updateTag("events");
    updateTag(`event-${eventId}`);
    updateTag("rsvps");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to RSVP to the event" };
  }
}
