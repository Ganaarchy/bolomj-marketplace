import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = "Аялал олдсонгүй",
  description = "Хайлтын нөхцөлөө өөрчилж дахин оролдоно уу.",
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-5" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
