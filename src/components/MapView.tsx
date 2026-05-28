"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapViewContent = dynamic(() => import("./MapViewContent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green-700 mb-3" />
        <span className="text-sm font-medium text-slate-500">Karte wird geladen...</span>
      </div>
    </div>
  ),
});

export default function MapView() {
  return <MapViewContent />;
}
