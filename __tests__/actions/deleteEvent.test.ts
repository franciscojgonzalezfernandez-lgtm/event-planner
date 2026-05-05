import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteEvent } from "@/lib/event-actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { event: { findUnique: vi.fn(), delete: vi.fn() } },
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
const mockDelete = vi.mocked(prisma.event.delete);
const mockUpdateTag = vi.mocked(updateTag);

const SESSION = { user: { id: "user-1" } };
const OWN_EVENT = { id: "event-1", userId: "user-1" };
const OTHER_EVENT = { id: "event-1", userId: "other-user" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteEvent", () => {
  it("calls unauthorized() when there is no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(deleteEvent("event-1")).rejects.toThrow("UNAUTHORIZED");
  });

  it("returns error when event does not exist", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(null);

    const result = await deleteEvent("event-1");
    expect(result).toEqual({ success: false, error: "Event not found" });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns error when user is not the owner", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OTHER_EVENT as never);

    const result = await deleteEvent("event-1");
    expect(result).toEqual({ success: false, error: "Not authorized to delete this event" });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("deletes the event and returns success when user is owner", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockDelete.mockResolvedValue({} as never);

    const result = await deleteEvent("event-1");
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "event-1" } });
    expect(result).toEqual({ success: true });
  });

  it("invalidates 'events' cache tag after deletion", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockDelete.mockResolvedValue({} as never);

    await deleteEvent("event-1");
    expect(mockUpdateTag).toHaveBeenCalledWith("events");
  });

  it("returns error without throwing when Prisma throws", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(OWN_EVENT as never);
    mockDelete.mockRejectedValue(new Error("DB error"));

    const result = await deleteEvent("event-1");
    expect(result).toEqual({ success: false, error: "Failed to delete the event" });
  });
});
