import Link from "next/link";
import { Compass, GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span>Bolomj Marketplace</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Аяллууд</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/compare">
              <GitCompareArrows className="h-4 w-4" />
              Харьцуулах
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
