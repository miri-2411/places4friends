import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="mt-8 pb-6 text-center text-[11px] text-slate-400">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link href="/impressum" className="hover:text-slate-600 transition-colors">
          Impressum
        </Link>
        <span className="text-slate-300" aria-hidden>
          •
        </span>
        <Link href="/datenschutz" className="hover:text-slate-600 transition-colors">
          Datenschutz
        </Link>
        <span className="text-slate-300" aria-hidden>
          •
        </span>
        <Link href="/agb" className="hover:text-slate-600 transition-colors">
          AGB
        </Link>
      </nav>
    </footer>
  );
}
