import Link from "next/link";
import { Clock3 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BackendGapPageProps = {
  title: string;
  description: string;
  missingEndpoints: string[];
  note: string;
};

export function BackendGapPage({
  title,
  description,
  missingEndpoints,
  note
}: BackendGapPageProps) {
  return (
    <main className="container py-10">
      <Card className="mx-auto max-w-2xl shadow-soft">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
            <Clock3 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <Alert>
            <AlertTitle>Backend дэмжлэг хүлээгдэж байна</AlertTitle>
            <AlertDescription>{note}</AlertDescription>
          </Alert>

          <div>
            <p className="text-sm font-medium">Дутуу endpoint-ууд</p>
            <div className="mt-3 grid gap-2">
              {missingEndpoints.map((endpoint) => (
                <code
                  key={endpoint}
                  className="rounded-md border bg-secondary/60 px-3 py-2 text-sm"
                >
                  {endpoint}
                </code>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/">Маркетплейс рүү буцах</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Нэвтрэх</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
