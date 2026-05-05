import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEvent } from "@/lib/event-actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { event: { create: vi.fn() } },
}));
vi.mock("next/navigation", () => ({
  unauthorized: vi.fn(() => { throw new Error("UNAUTHORIZED"); }),
}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.event.create);
const mockUpdateTag = vi.mocked(updateTag);

const SESSION = { user: { id: "user-1" } };

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("title", "My Event");
  fd.set("description", "Great event");
  fd.set("date", "2025-12-01T18:00");
  fd.set("location", "Madrid");
  for (const [k, v] of Object.entries(overrides)) {
    if (v === "") fd.delete(k);
    else fd.set(k, v);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createEvent", () => {
  it("calls unauthorized() when there is no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(createEvent(null, makeFormData())).rejects.toThrow("UNAUTHORIZED");
  });

  it("returns error when title is empty (validation fails)", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    const result = await createEvent(null, makeFormData({ title: "" }));
    expect(result.success).toBe(false);
  });

  it("returns success and eventId on valid data", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockResolvedValue({ id: "new-event-id" } as never);

    const result = await createEvent(null, makeFormData());
    expect(result).toEqual({ success: true, eventId: "new-event-id" });
  });

  it("sets isPublic to true when checkbox is present", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockResolvedValue({ id: "x" } as never);

    await createEvent(null, makeFormData({ isPublic: "on" }));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isPublic: true }) }),
    );
  });

  it("sets isPublic to false when checkbox is absent", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockResolvedValue({ id: "x" } as never);

    const fd = makeFormData();
    fd.delete("isPublic");
    await createEvent(null, fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isPublic: false }) }),
    );
  });

  it("sets maxAttendees to null when field is empty", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockResolvedValue({ id: "x" } as never);

    const fd = makeFormData();
    fd.delete("maxAttendees");
    await createEvent(null, fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ maxAttendees: null }) }),
    );
  });

  it("returns error without throwing when Prisma throws", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockRejectedValue(new Error("DB error"));

    const result = await createEvent(null, makeFormData());
    expect(result).toEqual({ success: false, error: "Failed to create event", eventId: null });
  });

  it("invalidates 'events' cache tag on success", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockCreate.mockResolvedValue({ id: "x" } as never);

    await createEvent(null, makeFormData());
    expect(mockUpdateTag).toHaveBeenCalledWith("events");
  });
});
