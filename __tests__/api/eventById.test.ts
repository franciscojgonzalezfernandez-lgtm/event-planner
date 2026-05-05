import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/events/[eventId]/route";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { event: { findUnique: vi.fn() } },
}));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.event.findUnique);

function makeRequest(eventId = "event-1") {
  return {
    request: new Request(`http://localhost/api/events/${eventId}`),
    params: Promise.resolve({ eventId }),
  };
}

const PUBLIC_EVENT = {
  id: "event-1",
  title: "Test Event",
  isPublic: true,
  userId: "owner-1",
  user: { name: "Owner", email: "owner@test.com" },
  rsvps: [],
  _count: { rsvps: 0 },
};

const PRIVATE_EVENT = { ...PUBLIC_EVENT, isPublic: false };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/events/[eventId]", () => {
  it("returns 404 when event does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockAuth.mockResolvedValue(null as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it("returns 200 for a public event without authentication", async () => {
    mockFindUnique.mockResolvedValue(PUBLIC_EVENT as never);
    mockAuth.mockResolvedValue(null as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("event-1");
  });

  it("returns 200 for a public event with an authenticated user", async () => {
    mockFindUnique.mockResolvedValue(PUBLIC_EVENT as never);
    mockAuth.mockResolvedValue({ user: { id: "user-2" } } as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(200);
  });

  it("returns 403 for a private event accessed without authentication", async () => {
    mockFindUnique.mockResolvedValue(PRIVATE_EVENT as never);
    mockAuth.mockResolvedValue(null as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(403);
  });

  it("returns 403 for a private event accessed by a non-owner", async () => {
    mockFindUnique.mockResolvedValue(PRIVATE_EVENT as never);
    mockAuth.mockResolvedValue({ user: { id: "other-user" } } as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(403);
  });

  it("returns 200 for a private event accessed by its owner", async () => {
    mockFindUnique.mockResolvedValue(PRIVATE_EVENT as never);
    mockAuth.mockResolvedValue({ user: { id: "owner-1" } } as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("event-1");
  });

  it("returns 500 when Prisma throws an unexpected error", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB connection failed"));
    mockAuth.mockResolvedValue(null as never);

    const { request, params } = makeRequest();
    const res = await GET(request as never, { params });
    expect(res.status).toBe(500);
  });
});
