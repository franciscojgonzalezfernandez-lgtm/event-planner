import { auth } from "@/auth";
import GithubSignInButton from "../components/GithubSignInButton";
import { redirect } from "next/navigation";
import GoogleSignInButton from "../components/GoogleSignInButton";
export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
          <p className="text-muted">Sign in or create an account to continue</p>
        </div>
        <div className="card p-8">
          <div className="space-y-6">
            <div className="text-center space-y-6">
              <p className="text-muted">
                Use your github/google account to sign in or create a new
                account
              </p>
              <GithubSignInButton />
              <GoogleSignInButton />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted">
                By signing in, you agree to our terms of service and privacy
                policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
