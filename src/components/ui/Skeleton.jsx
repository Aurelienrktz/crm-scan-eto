const cardClass =
  'rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'

export function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-slate-200/70 motion-safe:animate-pulse dark:bg-slate-800 ${className}`}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className={`p-5 ${cardClass}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-8 w-14" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  )
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-label="Chargement" className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div role="status" aria-label="Chargement" className={`overflow-hidden ${cardClass}`}>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/5 xl:hidden" />
            </div>
            <Skeleton className="hidden h-6 w-28 rounded-full xl:block" />
            <Skeleton className="h-3.5 w-12 xl:w-20" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BreakdownSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-label="Chargement" className={`p-5 ${cardClass}`}>
      <Skeleton className="h-4 w-24" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-5" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className={`p-4 ${cardClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
