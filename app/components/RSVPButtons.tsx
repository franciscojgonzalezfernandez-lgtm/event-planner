type RSVPStatus = "GOING" | "NOT_GOING" | "MAYBE";

type RSVPButtonsProps = {
  eventId: string;
  currentRSVP?: RSVPStatus;
};

export default function RSVPButtons({
  eventId,
  currentRSVP,
}: RSVPButtonsProps) {
  function getButtonClass(status: RSVPStatus) {
    const baseClass =
      "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50";
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
  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-lg font-semibold">
        RSVP to this event
      </h3>
      <div className="flex flex-wrap gap-3">
        <button className={getButtonClass("GOING")}>Going</button>
        <button className={getButtonClass("MAYBE")}>Maybe</button>
        <button className={getButtonClass("NOT_GOING")}>Not going</button>
      </div>
    </div>
  );
}
