import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border bg-card shadow-sm"
        >
          <Skeleton className="h-36 rounded-none" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-4/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
