export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-8 w-32 bg-slate-700 rounded animate-pulse mx-auto" />
          <div className="h-4 w-48 bg-slate-700 rounded animate-pulse mx-auto" />
        </div>

        {/* Auth card */}
        <div className="card p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
            <div className="h-12 w-full bg-slate-700 rounded-md animate-pulse" />
            <div className="h-12 w-full bg-slate-700 rounded-md animate-pulse" />
            <div className="text-center">
              <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
