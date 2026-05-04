import { auth } from "@/auth";
import Link from "next/link";
import GithubSignInButton from "./components/GithubSignInButton";
import CreateIcon from "@/public/CreateIcon";
import MultiuserIcon from "@/public/MultiUserIcon";
import AnalyticsIcon from "@/public/AnalyticsIcon";

export default async function Home() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-16 px-4">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-foreground">
          Plan events, <span className="text-primary">together</span>
        </h1>
        <p className="text-muted text-xl max-w-2xl mx-auto">
          Create events, invite people, and manage RSVPs — all in one place.
        </p>
        <div className="flex justify-center pt-2">
          {session?.user ? (
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <GithubSignInButton />
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Create Events",
            desc: "Set up public or private events with all the details in seconds.",
            Icon: CreateIcon,
          },
          {
            title: "Manage RSVPs",
            desc: "See who's going, maybe, or not — updated in real time.",
            Icon: MultiuserIcon,
          },
          {
            title: "Track Attendees",
            desc: "Get a clear view of attendance counts and responses.",
            Icon: AnalyticsIcon,
          },
        ].map(({ title, desc, Icon }) => (
          <div key={title} className="card p-6 space-y-3">
            <Icon className="text-primary mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground text-center">
              {title}
            </h3>
            <p className="text-muted text-sm text-center">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
