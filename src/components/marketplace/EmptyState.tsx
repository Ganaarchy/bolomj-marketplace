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
      <SearchX className="mb-4 h-10 w-10 text-muted-foreground" />
      <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
