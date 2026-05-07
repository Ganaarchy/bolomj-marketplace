import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message: string;
  retryHref?: string;
};

export function ErrorState({
  title = "Мэдээлэл авахад алдаа гарлаа",
  message,
  retryHref = "/"
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <Button className="mt-4" variant="outline" asChild>
            <a href={retryHref}>Дахин ачаалах</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
