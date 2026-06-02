import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="mt-6 pb-2 text-center text-xs text-slate-500">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link href="/impressum" className="text-brand-green-700 font-medium hover:underline">
          Impressum
        </Link>
        <span className="text-slate-300" aria-hidden>
          |
        </span>
        <Link href="/datenschutz" className="text-brand-green-700 font-medium hover:underline">
          Datenschutz
        </Link>
        <span className="text-slate-300" aria-hidden>
          |
        </span>
        <Link href="/agb" className="text-brand-green-700 font-medium hover:underline">
          AGB
        </Link>
      </nav>
    </footer>
  );
}
