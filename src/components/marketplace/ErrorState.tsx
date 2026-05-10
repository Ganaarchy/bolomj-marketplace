import { AlertTriangle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
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
    <Alert variant="destructive" className="bg-card">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {message}
      </AlertDescription>
      <Button className="mt-4" variant="outline" asChild>
        <a href={retryHref}>Дахин ачаалах</a>
      </Button>
    </Alert>
  );
}
