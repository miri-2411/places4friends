"use client";

import React, { useState } from "react";
import Map from "react-map-gl/mapbox";
import { Search, Users, MapPin } from "lucide-react";

export default function MapViewContent() {
  const [viewState, setViewState] = useState({
    longitude: 12.1016,
    latitude: 49.0151,
    zoom: 12,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="rounded-full bg-red-50 p-3 text-red-500">
          <MapPin className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-semibold text-slate-800">Mapbox Token fehlt</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-xs">
          Bitte stelle sicher, dass `NEXT_PUBLIC_MAPBOX_TOKEN` in deiner `.env.local` definiert ist.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex-1 flex flex-col">
      {/* Floating Search Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="flex flex-1 items-center gap-2.5">
          <Search className="h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Orte deiner Freunde suchen..."
            className="w-full bg-transparent text-[14px] text-slate-800 placeholder-slate-400 outline-none font-sans"
          />
        </div>
        <div className="h-5 w-[1px] bg-slate-200/80 mx-1" />
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 active:scale-95 transition-all">
          <Users className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Mapbox Map */}
      <div className="w-full h-full flex-1">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={mapboxToken}
        />
      </div>


    </div>
  );
}
