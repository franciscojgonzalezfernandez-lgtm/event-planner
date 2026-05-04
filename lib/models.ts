export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number;
  isPublic: boolean;
  image: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  rsvps: EventRSVP[];
  _count: {
    rsvps: number;
  };
}

export type EventRSVP = {
  userId: string;
  status: RSVPStatus;
  user: {
    name: string;
  };
  event?: Event; // Optional to avoid circular reference issues when fetching RSVPs without event details
};

export type RSVPStatus = "GOING" | "NOT_GOING" | "MAYBE";
