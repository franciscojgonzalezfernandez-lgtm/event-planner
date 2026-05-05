import z from "zod";

export const eventSchema = z.object({
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
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Invalid image URL"),
});
