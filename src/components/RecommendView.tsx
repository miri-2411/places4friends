"use client";

import React, { useState } from "react";
import { Search, MessageSquare, Check, Sparkles, MapPin } from "lucide-react";

export default function RecommendView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMustSee, setIsMustSee] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      // Reset form
      setSearchQuery("");
      setReviewText("");
      setIsMustSee(false);
    }, 2500);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50/50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <h1 className="text-lg font-bold text-slate-900">Ort empfehlen</h1>
        <Sparkles className="h-5 w-5 text-brand-green-500" />
      </header>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 page-transition">
        {isSaved ? (
          <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-brand-green-100 bg-brand-green-50 p-8 text-center shadow-sm transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-500 text-white shadow-lg shadow-brand-green-500/20">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <h3 className="mt-4 text-base font-bold text-brand-green-900">Erfolgreich empfohlen!</h3>
            <p className="mt-1.5 text-xs text-brand-green-700/80 max-w-xs">
              Dein Ort wurde in die Liste aufgenommen und ist jetzt für deine Freunde sichtbar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Search Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ort suchen
              </label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-100 transition-all">
                <Search className="h-5 w-5 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Wo warst du? / Ort suchen..."
                  className="w-full bg-transparent text-[14px] text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Must See / Super-Empfehlung Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Empfehlungs-Typ
              </label>
              <button
                type="button"
                onClick={() => setIsMustSee(!isMustSee)}
                className={`relative w-full flex items-center justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                  isMustSee
                    ? "border-amber-200 bg-amber-50/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Glow/pattern effect behind the icon when active */}
                {isMustSee && (
                  <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-amber-200/20 blur-xl pointer-events-none" />
                )}
                
                <div className="flex items-center gap-3.5 z-10">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                      isMustSee
                        ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/30 rotate-6"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Sparkles className={`h-5.5 w-5.5 ${isMustSee ? "animate-pulse" : ""}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${isMustSee ? "text-amber-900" : "text-slate-700"}`}>
                      „Must See“ & Super-Empfehlung
                    </h4>
                    <p className={`text-xs mt-0.5 transition-colors ${isMustSee ? "text-amber-800/80" : "text-slate-400"}`}>
                      Markiere diesen Ort als absolutes Highlight für deine Freunde!
                    </p>
                  </div>
                </div>

                {/* Elegant Toggle Switch */}
                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 p-0.5 cursor-pointer z-10 ${
                    isMustSee ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      isMustSee ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Review Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Deine Empfehlung (optional)
              </label>
              <div className="relative flex rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-100 transition-all">
                <MessageSquare className="h-5 w-5 text-slate-400 mr-2.5 mt-0.5" />
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Warum gefällt dir dieser Ort? Gibt es Geheimtipps (z.B. den Espresso oder den Ausblick)?"
                  rows={4}
                  className="w-full bg-transparent text-[14px] text-slate-800 placeholder-slate-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* Form Guide/Disclaimer */}
            <div className="flex gap-2.5 rounded-xl bg-slate-100/70 p-3 text-[11px] text-slate-500 leading-normal">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm font-semibold">i</div>
              <p>
                Deine Empfehlung wird mit deinen Freunden geteilt und erscheint auf deren Karte sowie in ihrem Aktivitäts-Feed.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Save Button (Sticky relative to content bottom, but locked in the mobile viewport frame) */}
      {!isSaved && (
        <div className="absolute bottom-20 left-0 right-0 z-40 px-4">
          <button
            onClick={handleSave}
            disabled={!searchQuery}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-lg text-white transition-all cursor-pointer ${
              searchQuery
                ? "bg-brand-green-700 shadow-brand-green-900/10 active:scale-[0.98] hover:bg-brand-green-800"
                : "bg-slate-300 shadow-none cursor-not-allowed opacity-80"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Empfehlung speichern
          </button>
        </div>
      )}
    </div>
  );
}
