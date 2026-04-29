"use server";

import { auth } from "@/auth";
import z from "zod";
import { prisma } from "./prisma";

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
    return { success: false, error: "Unauthorized" };
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
