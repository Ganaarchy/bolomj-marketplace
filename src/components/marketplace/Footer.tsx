import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950">
      <div className="container flex flex-col gap-3 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Bolomj. Олон байгууллагын аяллын marketplace.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-white" href="/">
            Аяллууд
          </Link>
          <Link className="hover:text-white" href="/compare">
            Харьцуулах
          </Link>
          <Link className="hover:text-white" href="/profile">
            Профайл
          </Link>
          <Link className="hover:text-white" href="/register-tenant">
            Байгууллагаар бүртгүүлэх
          </Link>
          <Link className="hover:text-white" href="/my-bookings">
            Миний захиалгууд
          </Link>
        </div>
      </div>
    </footer>
  );
}
