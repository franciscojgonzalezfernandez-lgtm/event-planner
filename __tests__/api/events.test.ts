import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/events/route";

vi.mock("@/lib/prisma", () => ({
  prisma: { event: { findMany: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";

const mockFindMany = vi.mocked(prisma.event.findMany);
const EVENTS = [{ id: "1", title: "Event A" }, { id: "2", title: "Event B" }];

beforeEach(() => {
  vi.clearAllMocks();
  mockFindMany.mockResolvedValue(EVENTS as never);
});

function makeRequest(query = "") {
  return new Request(`http://localhost/api/events${query ? `?${query}` : ""}`);
}

describe("GET /api/events", () => {
  it("returns all events when called with no filters", async () => {
    const res = await GET(makeRequest() as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
  });

  it("passes search term as OR filter on title, description, location", async () => {
    await GET(makeRequest("search=madrid") as never);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ OR: expect.any(Array) }),
      }),
    );
  });

  it("filters upcoming events when filter=upcoming", async () => {
    await GET(makeRequest("filter=upcoming") as never);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ date: expect.objectContaining({ gte: expect.any(Date) }) }),
      }),
    );
  });

  it("filters past events when filter=past", async () => {
    await GET(makeRequest("filter=past") as never);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ date: expect.objectContaining({ lt: expect.any(Date) }) }),
      }),
    );
  });

  it("does not add a date filter when no filter param is provided", async () => {
    await GET(makeRequest() as never);
    const callArg = mockFindMany.mock.calls[0][0] as { where?: { date?: unknown } };
    expect(callArg?.where?.date).toBeUndefined();
  });

  it("returns 500 when Prisma throws an unexpected error", async () => {
    mockFindMany.mockRejectedValue(new Error("DB down"));
    const res = await GET(makeRequest() as never);
    expect(res.status).toBe(500);
  });
});
