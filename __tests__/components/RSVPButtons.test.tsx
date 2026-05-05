import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RSVPButtons from "@/app/components/RSVPButtons";

vi.mock("@/lib/event-actions", () => ({
  rsvpToEvent: vi.fn().mockResolvedValue({ success: true }),
}));

import { rsvpToEvent } from "@/lib/event-actions";
const mockRsvp = vi.mocked(rsvpToEvent);

function goingBtn() { return screen.getByRole("button", { name: "Going" }); }
function maybeBtn() { return screen.getByRole("button", { name: "Maybe" }); }
function notGoingBtn() { return screen.getByRole("button", { name: "Not going" }); }

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RSVPButtons", () => {
  it("renders three RSVP buttons", () => {
    render(<RSVPButtons eventId="event-1" />);
    expect(goingBtn()).toBeInTheDocument();
    expect(maybeBtn()).toBeInTheDocument();
    expect(notGoingBtn()).toBeInTheDocument();
  });

  it("renders the section heading as h2", () => {
    render(<RSVPButtons eventId="event-1" />);
    expect(screen.getByRole("heading", { level: 2, name: /rsvp to this event/i })).toBeInTheDocument();
  });

  it("does not apply active style when no currentRSVP is set", () => {
    render(<RSVPButtons eventId="event-1" />);
    expect(goingBtn().className).not.toContain("bg-green-600 text-white");
  });

  it("applies active style to Going button when currentRSVP is GOING", () => {
    render(<RSVPButtons eventId="event-1" currentRSVP="GOING" />);
    expect(goingBtn().className).toContain("bg-green-600 text-white");
    expect(maybeBtn().className).not.toContain("bg-yellow-600 text-white");
  });

  it("calls rsvpToEvent with GOING when Going button is clicked", async () => {
    render(<RSVPButtons eventId="event-1" />);
    await userEvent.click(goingBtn());
    await waitFor(() => expect(mockRsvp).toHaveBeenCalledWith("event-1", "GOING"));
  });

  it("calls rsvpToEvent with MAYBE when Maybe button is clicked", async () => {
    render(<RSVPButtons eventId="event-1" />);
    await userEvent.click(maybeBtn());
    await waitFor(() => expect(mockRsvp).toHaveBeenCalledWith("event-1", "MAYBE"));
  });

  it("disables all buttons while the RSVP request is in flight", async () => {
    let resolveRsvp!: () => void;
    mockRsvp.mockReturnValue(new Promise((res) => { resolveRsvp = () => res({ success: true }); }));

    render(<RSVPButtons eventId="event-1" />);
    userEvent.click(goingBtn());

    await waitFor(() => {
      expect(goingBtn()).toBeDisabled();
      expect(maybeBtn()).toBeDisabled();
      expect(notGoingBtn()).toBeDisabled();
    });

    resolveRsvp();
  });
});
