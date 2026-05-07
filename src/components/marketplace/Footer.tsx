import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© 2026 Bolomj. Олон tenant-ийн аяллын marketplace.</p>
        <div className="flex gap-4">
          <Link className="hover:text-foreground" href="/">
            Аяллууд
          </Link>
          <Link className="hover:text-foreground" href="/compare">
            Харьцуулах
          </Link>
        </div>
      </div>
    </footer>
  );
}
