import Link from "next/link";
import HomeIcon from "@/public/HomeIcon";
import MultiuserIcon from "@/public/MultiUserIcon";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-32 px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-muted">Sorry, we couldn&apos;t find that page.</p>
      </div>
      <div className="flex gap-4 justify-center pt-2">
        <Link
          href="/"
          className="btn-primary px-6 py-2 flex items-center gap-2"
        >
          <HomeIcon className="w-4 h-4" />
          Back Home
        </Link>
        <Link
          href="/events"
          className="btn-secondary px-6 py-2 flex items-center gap-2"
        >
          <MultiuserIcon className="w-4 h-4 mr-0" />
          View Events
        </Link>
      </div>
    </div>
  );
}
