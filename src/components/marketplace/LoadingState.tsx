export function LoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[420px] animate-pulse rounded-lg border bg-card"
        >
          <div className="h-32 rounded-t-lg bg-muted" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="h-9 rounded bg-muted" />
              <div className="h-9 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
