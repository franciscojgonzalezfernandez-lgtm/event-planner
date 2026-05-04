export default function HomeLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-16 px-4">
      {/* Hero */}
      <div className="rounded-2xl h-72 md:h-96 bg-slate-700 animate-pulse" />

      {/* CTA buttons */}
      <div className="flex justify-center gap-4">
        <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
        <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 space-y-3">
            <div className="w-8 h-8 bg-slate-700 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
