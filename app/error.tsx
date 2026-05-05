"use client";

import Link from "next/link";
import AlertIcon from "@/public/AlertIcon";
import HomeIcon from "@/public/HomeIcon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto py-32 px-4 text-center space-y-6">
      <div className="space-y-4">
        <AlertIcon className="w-16 h-16 mx-auto text-red-400" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        {process.env.NODE_ENV === "development" && (
          <p className="card p-3 text-left text-sm text-red-400 font-mono break-all">
            {error.message}
          </p>
        )}
      </div>
      <div className="flex gap-4 justify-center pt-2">
        <button
          onClick={reset}
          className="btn-primary px-6 py-2 flex items-center gap-2"
        >
          Try again
        </button>
        <Link href="/" className="btn-secondary px-6 py-2 flex items-center gap-2">
          <HomeIcon className="w-4 h-4" />
          Back Home
        </Link>
      </div>
    </div>
  );
}
