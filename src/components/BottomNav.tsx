"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Plus, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isTabActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path;
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 w-full border-t border-slate-100 bg-white/90 pb-safe-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="flex h-16 items-center justify-around px-2">
        {/* Map Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 ${
            isTabActive("/")
              ? "text-brand-green-700 scale-105 font-medium"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Map className="h-5 w-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wide">Karte</span>
        </Link>

        {/* Create / Recommend Tab */}
        <Link
          href="/create"
          className="relative -top-3 flex flex-col items-center"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
              isTabActive("/create")
                ? "bg-brand-green-700 text-white shadow-brand-green-700/30 scale-105"
                : "bg-brand-green-600 text-white shadow-brand-green-600/25 hover:bg-brand-green-700"
            }`}
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </div>
          <span
            className={`mt-1 text-[10px] tracking-wide transition-colors duration-200 ${
              isTabActive("/create")
                ? "text-brand-green-700 font-medium"
                : "text-slate-400"
            }`}
          >
            Empfehlen
          </span>
        </Link>

        {/* Profile Tab */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 ${
            isTabActive("/profile")
              ? "text-brand-green-700 scale-105 font-medium"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User className="h-5 w-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wide">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
