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
}
