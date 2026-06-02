"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "p4f_storage_notice_dismissed";

export default function StorageNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Hinweis zu Cookies und lokaler Speicherung"
      className="fixed bottom-20 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 text-xs leading-relaxed text-slate-600">
          Wir verwenden technisch notwendige Session-Cookies sowie lokale Speicherung für Karte und
          Einführung. Details in der{" "}
          <Link href="/datenschutz" className="font-semibold text-brand-green-700 hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Hinweis schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
