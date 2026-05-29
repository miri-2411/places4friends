"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  initials: string;
  color: string;
}

interface PlaceItem {
  id: string;
  name: string;
  isMustSee?: boolean;
  review: string;
  timestamp: string;
  categories?: string[];
}

export default function PublicProfileView({
  friend,
  friendsCount = 0,
  places = [],
}: {
  friend: User;
  friendsCount?: number;
  places?: PlaceItem[];
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <Link
          href="/profile/friends"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Profil</h1>
        <div className="w-8" /> {/* Spacer to center the title */}
      </header>

      <div className="flex-grow overflow-y-auto px-4 pt-6 page-transition">
        {/* Profile Card Info */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative">
            <div className={`flex h-22 w-22 items-center justify-center rounded-full p-0.5 shadow-md ${friend.color}`}>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-slate-800 font-bold text-2xl">
                {friend.initials}
              </div>
            </div>
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-950">
            {friend.name ?? "Freund"}
          </h2>
          {friend.username && (
            <p className="text-xs font-semibold text-brand-green-700 mt-0.5">
              @{friend.username}
            </p>
          )}

          {/* Stats Bar */}
          <div className="mt-6 flex w-full max-w-[280px] divide-x divide-slate-100 rounded-xl border border-slate-100 bg-white py-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-base font-extrabold text-slate-900">
                {places.length}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Empfehlungen
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-base font-extrabold text-slate-900">
                {friendsCount}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Freunde
              </span>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Empfehlungen von {friend.name?.split(" ")[0] ?? "Freund"}
            </h3>
          </div>

          {/* Places List */}
          <div className="space-y-3.5 pb-8">
            {places.length > 0 ? (
              places.map((place) => (
                <div
                  key={place.id}
                  className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-green-700 transition-colors">
                        {place.name}
                      </h4>
                      {place.isMustSee && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/15 shadow-sm">
                            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-400 animate-pulse" />
                            Must See
                          </span>
                        </div>
                      )}
                      {place.categories && place.categories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {place.categories.map((category) => (
                            <span
                              key={category}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {place.timestamp}
                    </span>
                  </div>

                  {/* Place Review Text */}
                  {place.review ? (
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {place.review}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs italic text-slate-400">
                      Keine Beschreibung hinterlassen.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <MapPin className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Noch keine Empfehlungen eingetragen
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
