import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EventForm from "@/app/components/EventForm";
import type { Event } from "@/lib/models";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

vi.mock("@/lib/event-actions", () => ({
  createEvent: vi.fn().mockResolvedValue({ success: false, error: "", eventId: null }),
  updateEvent: vi.fn().mockResolvedValue({ success: false, error: "", eventId: null }),
}));

const MOCK_EVENT: Event = {
  id: "event-1",
  title: "Existing Title",
  description: "Existing description",
  date: new Date("2025-12-01T18:00:00"),
  location: "Madrid",
  maxAttendees: 100,
  isPublic: false,
  image: "https://example.com/img.jpg",
  userId: "user-1",
  user: { name: "Owner", email: "owner@test.com" },
  rsvps: [],
  _count: { rsvps: 0 },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EventForm", () => {
  describe("Create mode (no event prop)", () => {
    it("shows 'Create New Event' heading", () => {
      render(<EventForm />);
      expect(screen.getByRole("heading", { name: /create new event/i })).toBeInTheDocument();
    });

    it("renders all form fields empty", () => {
      render(<EventForm />);
      expect(screen.getByLabelText(/event title/i)).toHaveValue("");
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
      expect(screen.getByLabelText(/location/i)).toHaveValue("");
    });

    it("has isPublic checkbox checked by default", () => {
      render(<EventForm />);
      expect(screen.getByRole("checkbox", { name: /make this event public/i })).toBeChecked();
    });

    it("shows 'Create Event' on the submit button", () => {
      render(<EventForm />);
      expect(screen.getByRole("button", { name: /create event/i })).toBeInTheDocument();
    });
  });

  describe("Edit mode (event prop provided)", () => {
    it("shows 'Edit Event' heading", () => {
      render(<EventForm event={MOCK_EVENT} />);
      expect(screen.getByRole("heading", { name: /edit event/i })).toBeInTheDocument();
    });

    it("pre-fills title, description, and location from the event", () => {
      render(<EventForm event={MOCK_EVENT} />);
      expect(screen.getByLabelText(/event title/i)).toHaveValue("Existing Title");
      expect(screen.getByLabelText(/description/i)).toHaveValue("Existing description");
      expect(screen.getByLabelText(/location/i)).toHaveValue("Madrid");
    });

    it("pre-fills the image URL field", () => {
      render(<EventForm event={MOCK_EVENT} />);
      expect(screen.getByLabelText(/event cover/i)).toHaveValue("https://example.com/img.jpg");
    });

    it("has isPublic checkbox unchecked when event.isPublic is false", () => {
      render(<EventForm event={MOCK_EVENT} />);
      expect(screen.getByRole("checkbox", { name: /make this event public/i })).not.toBeChecked();
    });

    it("shows 'Save changes' on the submit button", () => {
      render(<EventForm event={MOCK_EVENT} />);
      expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    });
  });
});
