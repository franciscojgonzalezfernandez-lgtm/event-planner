import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateEvent } from "@/lib/event-actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { event: { findUnique: vi.fn(), update: vi.fn() } },
}));
vi.mock("next/navigation", () => ({
  unauthorized: vi.fn(() => { throw new Error("UNAUTHORIZED"); }),
}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.event.findUnique);
const mockUpdate = vi.mocked(prisma.event.update);
const mockUpdateTag = vi.mocked(updateTag);

const SESSION = { user: { id: "user-1" } };
const OWN_EVENT = { id: "event-1", userId: "user-1" };
const OTHER_EVENT = { id: "event-1", userId: "other-user" };

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("title", "Updated Title");
  fd.set("description", "Updated description");
  fd.set("date", "2025-12-15T10:00");
  fd.set("location", "Barcelona");
  for (const [k, v] of Object.entries(overrides)) {
    if (v === "") fd.delete(k);
    else fd.set(k, v);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateEvent", () => {
  it("calls unauthorized() when there is no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(updateEvent("event-1", null, makeFormData())).rejects.toThrow("UNAUTHORIZED");
  });

  it("returns error when event does not exist", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(null);

    const result = await updateEvent("event-1", null, makeFormData());
    expect(result).toEqual({ success: false, error: "Event not found" });
  });

  it("returns error when user is not the owner", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OTHER_EVENT as never);

    const result = await updateEvent("event-1", null, makeFormData());
    expect(result).toEqual({ success: false, error: "Not authorized to edit this event" });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error when validation fails (empty title)", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);

    const result = await updateEvent("event-1", null, makeFormData({ title: "" }));
    expect(result.success).toBe(false);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("updates the event and returns success", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockUpdate.mockResolvedValue({} as never);

    const result = await updateEvent("event-1", null, makeFormData());
    expect(mockUpdate).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("invalidates both 'events' and 'event-{id}' cache tags", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockUpdate.mockResolvedValue({} as never);

    await updateEvent("event-1", null, makeFormData());
    expect(mockUpdateTag).toHaveBeenCalledWith("events");
    expect(mockUpdateTag).toHaveBeenCalledWith("event-event-1");
  });

  it("sets isPublic to false when checkbox is absent in update", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockUpdate.mockResolvedValue({} as never);

    const fd = makeFormData();
    fd.delete("isPublic");
    await updateEvent("event-1", null, fd);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isPublic: false }) }),
    );
  });
});
