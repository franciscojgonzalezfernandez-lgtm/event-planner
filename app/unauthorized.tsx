import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto py-32 px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-primary">401</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Authentication required
        </h1>
        <p className="text-muted">
          You need to be signed in to access this page.
        </p>
      </div>
      <div className="card p-6 space-y-4">
        <p className="text-sm text-muted">
          Please sign in to your account to continue.
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <Link href="/login" className="btn-primary px-6 py-2">
            Sign in
          </Link>
          <Link href="/" className="btn-secondary px-6 py-2">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
