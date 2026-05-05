import { auth } from "@/auth";
import { unauthorized } from "next/navigation";
import CreateEventForm from "./CreateEventForm";

export default async function CreateEventPage() {
  const session = await auth();
  if (!session?.user?.id) {
    unauthorized();
  }
  return <CreateEventForm />;
}
