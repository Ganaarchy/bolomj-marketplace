import Link from "next/link";
import { Compass, GitCompareArrows, Menu, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="tracking-normal">Bolomj</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/">Аяллууд</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/compare">
              <GitCompareArrows className="h-4 w-4" />
              Харьцуулах
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/profile">
              <UserRound className="h-4 w-4" />
              Профайл
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login">Нэвтрэх</Link>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" variant="outline" size="icon">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Цэс нээх</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Bolomj</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 grid gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/">Аяллууд</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/compare">
                  <GitCompareArrows className="h-4 w-4" />
                  Харьцуулах
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/profile">
                  <UserRound className="h-4 w-4" />
                  Профайл
                </Link>
              </Button>
              <Button className="justify-start" asChild>
                <Link href="/login">Нэвтрэх</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
