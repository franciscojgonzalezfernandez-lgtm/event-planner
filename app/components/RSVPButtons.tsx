"use client";
import { useState } from "react";
import type { RSVPStatus } from "@/lib/models";
import { rsvpToEvent } from "@/lib/event-actions";

type RSVPButtonsProps = {
  eventId: string;
  currentRSVP?: RSVPStatus;
};

export default function RSVPButtons({
  eventId,
  currentRSVP,
}: RSVPButtonsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  function getButtonClass(status: RSVPStatus) {
    const baseClass =
      "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer";
    const isActive = currentRSVP === status;
    switch (status) {
      case "GOING":
        return `${baseClass} ${isActive ? "bg-green-600 text-white" : "bg-green-600/20 text-green-400 hover:bg-green-600/30"} `;

      case "NOT_GOING":
        return `${baseClass} ${isActive ? "bg-red-600 text-white" : "bg-red-600/20 text-red-400 hover:bg-red-600/30"} `;
      case "MAYBE":
        return `${baseClass} ${isActive ? "bg-yellow-600 text-white" : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"} `;
      default:
        return baseClass;
    }
  }

  async function handleRSVP(status: RSVPStatus) {
    setLoading(true);
    try {
      const result = await rsvpToEvent(eventId, status);
      if (result.success) {
      } else {
        console.error("Failed to update RSVP:", result.error);
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
    } finally {
      setLoading(false);
    }
    // Aquí iría la lógica para enviar el RSVP al backend
    console.log(`RSVP for event ${eventId}: ${status}`);
  }
  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-lg font-semibold">
        RSVP to this event
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          className={getButtonClass("GOING")}
          onClick={() => handleRSVP("GOING")}
          disabled={loading}
        >
          Going
        </button>
        <button
          className={getButtonClass("MAYBE")}
          onClick={() => handleRSVP("MAYBE")}
          disabled={loading}
        >
          Maybe
        </button>
        <button
          className={getButtonClass("NOT_GOING")}
          onClick={() => handleRSVP("NOT_GOING")}
          disabled={loading}
        >
          Not going
        </button>
      </div>
    </div>
  );
}
