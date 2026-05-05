import { describe, it, expect } from "vitest";
import { eventSchema } from "@/lib/eventSchema";

const validBase = {
  title: "Test Event",
  description: "A great event",
  date: "2025-12-01T18:00",
  location: "Madrid",
};

describe("eventSchema", () => {
  // --- Happy paths ---
  it("passes with all valid fields including optionals", () => {
    const result = eventSchema.safeParse({
      ...validBase,
      maxAttendees: "50",
      isPublic: "on",
      image: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("passes without optional fields (image, maxAttendees, isPublic)", () => {
    const result = eventSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("passes with maxAttendees = '0'", () => {
    const result = eventSchema.safeParse({ ...validBase, maxAttendees: "0" });
    expect(result.success).toBe(true);
  });

  it("passes with empty image string", () => {
    const result = eventSchema.safeParse({ ...validBase, image: "" });
    expect(result.success).toBe(true);
  });

  it("passes with valid https image URL", () => {
    const result = eventSchema.safeParse({
      ...validBase,
      image: "https://cdn.example.com/photo.png",
    });
    expect(result.success).toBe(true);
  });

  it("passes with isPublic = 'on'", () => {
    const result = eventSchema.safeParse({ ...validBase, isPublic: "on" });
    expect(result.success).toBe(true);
  });

  // --- title ---
  it("fails when title is empty", () => {
    const result = eventSchema.safeParse({ ...validBase, title: "" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Title is required");
  });

  // --- description ---
  it("fails when description is empty", () => {
    const result = eventSchema.safeParse({ ...validBase, description: "" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Description is required");
  });

  // --- location ---
  it("fails when location is empty", () => {
    const result = eventSchema.safeParse({ ...validBase, location: "" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Location is required");
  });

  // --- date ---
  it("fails when date is not a valid date string", () => {
    const result = eventSchema.safeParse({ ...validBase, date: "not-a-date" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Invalid date format");
  });

  it("fails when date is an empty string", () => {
    const result = eventSchema.safeParse({ ...validBase, date: "" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Invalid date format");
  });

  // --- maxAttendees ---
  it("fails when maxAttendees is non-numeric text", () => {
    const result = eventSchema.safeParse({
      ...validBase,
      maxAttendees: "abc",
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain(
      "Max attendees must be a number",
    );
  });

  it("passes when maxAttendees is a numeric string", () => {
    const result = eventSchema.safeParse({
      ...validBase,
      maxAttendees: "100",
    });
    expect(result.success).toBe(true);
  });

  // --- image ---
  it("fails when image is an invalid URL", () => {
    const result = eventSchema.safeParse({
      ...validBase,
      image: "not-a-url",
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error)).toContain("Invalid image URL");
  });
});
