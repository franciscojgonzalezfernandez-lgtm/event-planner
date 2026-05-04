function SkeletonField({ labelWidth = "w-20", tall = false }: { labelWidth?: string; tall?: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`h-4 ${labelWidth} bg-slate-700 rounded animate-pulse`} />
      <div className={`${tall ? "h-24" : "h-10"} w-full bg-slate-700 rounded-md animate-pulse`} />
    </div>
  );
}

export default function CreateEventLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-80 bg-slate-700 rounded animate-pulse" />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <SkeletonField labelWidth="w-16" />
        <SkeletonField labelWidth="w-24" tall />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonField labelWidth="w-28" />
          <SkeletonField labelWidth="w-20" />
        </div>

        <SkeletonField labelWidth="w-24" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonField labelWidth="w-32" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-700 rounded animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <div className="h-10 w-36 bg-slate-700 rounded-md animate-pulse" />
          <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
