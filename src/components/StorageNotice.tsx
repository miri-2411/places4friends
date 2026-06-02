"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export const STORAGE_NOTICE_DISMISSED_KEY = "p4f_storage_notice_dismissed";
export const STORAGE_NOTICE_VISIBILITY_EVENT = "p4f-storage-notice-visibility-change";
export const STORAGE_NOTICE_REQUEST_LAYOUT_EVENT = "p4f-storage-notice-request-layout";

/** Gap between cookie notice top edge and login banner bottom edge (px). */
export const STORAGE_NOTICE_STACK_GAP_PX = 8;

const BOTTOM_NAV_OFFSET = "calc(64px + 8px + env(safe-area-inset-bottom))";

function dispatchNoticeLayout(visible: boolean, height: number) {
  window.dispatchEvent(
    new CustomEvent(STORAGE_NOTICE_VISIBILITY_EVENT, {
      detail: { visible, height },
    })
  );
}

export default function StorageNotice() {
  const [visible, setVisible] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const dismissed = globalThis.localStorage?.getItem(STORAGE_NOTICE_DISMISSED_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      dispatchNoticeLayout(false, 0);
      return;
    }

    const node = noticeRef.current;
    if (!node) {
      dispatchNoticeLayout(true, 0);
      return;
    }

    const reportLayout = () => {
      dispatchNoticeLayout(true, node.offsetHeight);
    };

    reportLayout();
    const observer = new ResizeObserver(reportLayout);
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    const handleLayoutRequest = () => {
      if (!visible) {
        dispatchNoticeLayout(false, 0);
        return;
      }
      const height = noticeRef.current?.offsetHeight ?? 0;
      dispatchNoticeLayout(true, height);
    };

    window.addEventListener(STORAGE_NOTICE_REQUEST_LAYOUT_EVENT, handleLayoutRequest);
    return () => {
      window.removeEventListener(STORAGE_NOTICE_REQUEST_LAYOUT_EVENT, handleLayoutRequest);
    };
  }, [visible]);

  const dismiss = () => {
    try {
      globalThis.localStorage?.setItem(STORAGE_NOTICE_DISMISSED_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={noticeRef}
      role="dialog"
      aria-label="Hinweis zu Cookies und lokaler Speicherung"
      className="absolute left-4 right-4 z-[90] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
      style={{ bottom: BOTTOM_NAV_OFFSET }}
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
