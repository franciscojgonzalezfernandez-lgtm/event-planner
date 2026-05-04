function SkeletonEventCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse" />
      <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse" />
      <div className="flex items-center gap-2 pt-1">
        <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonRSVPCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse" />
      <div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse" />
      <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="h-9 w-full bg-slate-700 rounded-md animate-pulse" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-40 bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-700 rounded animate-pulse" />
      </div>

      {/* Quick Actions */}
      <div className="card p-6 space-y-4">
        <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
          <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6 space-y-2">
            <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
            <div className="h-10 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* My Events */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
          <div className="h-9 w-28 bg-slate-700 rounded-md animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonEventCard key={i} />
          ))}
        </div>
      </div>

      {/* My RSVPs */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRSVPCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
