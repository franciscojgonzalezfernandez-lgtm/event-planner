import { describe, it, expect, vi, beforeEach } from "vitest";
import { rsvpToEvent } from "@/lib/event-actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: vi.fn() },
    rSVP: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));
vi.mock("next/navigation", () => ({
  unauthorized: vi.fn(() => { throw new Error("UNAUTHORIZED"); }),
}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockEventFindUnique = vi.mocked(prisma.event.findUnique);
const mockRsvpFindUnique = vi.mocked(prisma.rSVP.findUnique);
const mockRsvpCreate = vi.mocked(prisma.rSVP.create);
const mockRsvpUpdate = vi.mocked(prisma.rSVP.update);
const mockUpdateTag = vi.mocked(updateTag);

const SESSION = { user: { id: "user-1" } };
const FUTURE_DATE = new Date(Date.now() + 86_400_000); // tomorrow
const PAST_DATE = new Date(Date.now() - 86_400_000);   // yesterday

const makeEvent = (overrides = {}) => ({
  id: "event-1",
  isPublic: true,
  date: FUTURE_DATE,
  userId: "owner-1",
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("rsvpToEvent", () => {
  it("calls unauthorized() when no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(rsvpToEvent("event-1", "GOING")).rejects.toThrow("UNAUTHORIZED");
  });

  it("returns error when event does not exist", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(null);
    const result = await rsvpToEvent("event-1", "GOING");
    expect(result).toEqual({ success: false, error: "Event not found" });
  });

  it("returns error when event is private", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(makeEvent({ isPublic: false }) as never);
    const result = await rsvpToEvent("event-1", "GOING");
    expect(result).toEqual({ success: false, error: "Cannot RSVP to private events" });
  });

  it("returns error when event is in the past", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(makeEvent({ date: PAST_DATE }) as never);
    const result = await rsvpToEvent("event-1", "GOING");
    expect(result).toEqual({ success: false, error: "Cannot RSVP to past events" });
  });

  it("creates a new RSVP when none exists", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(makeEvent() as never);
    mockRsvpFindUnique.mockResolvedValue(null);
    mockRsvpCreate.mockResolvedValue({} as never);

    const result = await rsvpToEvent("event-1", "GOING");

    expect(mockRsvpCreate).toHaveBeenCalledWith({
      data: { userId: "user-1", eventId: "event-1", status: "GOING" },
    });
    expect(mockRsvpUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("updates existing RSVP instead of creating a new one", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(makeEvent() as never);
    mockRsvpFindUnique.mockResolvedValue({ id: "rsvp-existing" } as never);
    mockRsvpUpdate.mockResolvedValue({} as never);

    const result = await rsvpToEvent("event-1", "MAYBE");

    expect(mockRsvpUpdate).toHaveBeenCalledWith({
      where: { id: "rsvp-existing" },
      data: { status: "MAYBE" },
    });
    expect(mockRsvpCreate).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("invalidates all three cache tags on success", async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockEventFindUnique.mockResolvedValue(makeEvent() as never);
    mockRsvpFindUnique.mockResolvedValue(null);
    mockRsvpCreate.mockResolvedValue({} as never);

    await rsvpToEvent("event-1", "GOING");

    expect(mockUpdateTag).toHaveBeenCalledWith("events");
    expect(mockUpdateTag).toHaveBeenCalledWith("event-event-1");
    expect(mockUpdateTag).toHaveBeenCalledWith("rsvps");
  });

  it.each([["GOING"], ["MAYBE"], ["NOT_GOING"]] as const)(
    "returns success for status %s",
    async (status) => {
      mockAuth.mockResolvedValue(SESSION as never);
      mockEventFindUnique.mockResolvedValue(makeEvent() as never);
      mockRsvpFindUnique.mockResolvedValue(null);
      mockRsvpCreate.mockResolvedValue({} as never);

      const result = await rsvpToEvent("event-1", status);
      expect(result).toEqual({ success: true });
    },
  );
});
