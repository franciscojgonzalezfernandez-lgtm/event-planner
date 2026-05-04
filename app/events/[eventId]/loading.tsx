function SkeletonInfoRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-slate-700 rounded-full animate-pulse shrink-0" />
      <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
    </div>
  );
}

export default function EventDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Event header card */}
      <div className="card p-8">
        {/* Title + actions */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-8 w-3/4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="h-9 w-24 bg-slate-700 rounded-md animate-pulse" />
            <div className="h-9 w-28 bg-slate-700 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Image placeholder */}
        <div className="w-full h-64 bg-slate-700 rounded-lg animate-pulse mb-6" />

        {/* Details grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: event info */}
          <div className="space-y-4">
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
          </div>

          {/* Right: RSVP buttons */}
          <div className="space-y-4">
            <div className="h-5 w-40 bg-slate-700 rounded animate-pulse" />
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />
              <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />
              <div className="h-10 w-28 bg-slate-700 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendees card */}
      <div className="card p-8">
        <div className="h-6 w-28 bg-slate-700 rounded animate-pulse mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className="space-y-3">
              <div className="h-5 w-20 bg-slate-700 rounded animate-pulse" />
              {Array.from({ length: 3 }).map((_, row) => (
                <div key={row} className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-center">
        <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
