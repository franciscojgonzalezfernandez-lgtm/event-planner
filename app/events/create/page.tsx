import { auth } from "@/auth";
import EventForm from "@/app/components/EventForm";
import { unauthorized } from "next/navigation";

export default async function CreateEventPage() {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  return <EventForm />;
}
