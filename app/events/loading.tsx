function SkeletonEventCard() {
  return (
    <div className="card overflow-hidden px-6 py-6 space-y-3">
      <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse" />
      <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse" />
      <div className="space-y-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse shrink-0" />
            <div className="h-4 bg-slate-700 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
          </div>
        ))}
      </div>
      <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
    </div>
  );
}

export default function EventsLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-700 rounded-md animate-pulse" />
      </div>

      {/* Search / filter bar */}
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex gap-4 flex-wrap">
            <div className="h-10 flex-1 min-w-48 bg-slate-700 rounded-md animate-pulse" />
            <div className="h-10 w-40 bg-slate-700 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonEventCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
