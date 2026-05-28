"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, Sparkles, LogOut, UserPlus, MapPin, Pencil, Trash2, X, Check } from "lucide-react";
import { signout } from "@/app/login/actions";

interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
}

interface PlaceItem {
  id: string;
  name: string;
  isMustSee?: boolean;
  review: string;
  timestamp: string;
  categories?: string[];
}

const CATEGORY_OPTIONS = [
  "Cafe",
  "Restaurant",
  "Freizeitpark",
  "Bar",
  "Museum",
  "Kino",
  "Park",
  "Natur",
  "Sehenswuerdigkeit",
];

export default function ProfileView({ 
  user, 
  friendsCount = 0,
  places = []
}: { 
  user?: User; 
  friendsCount?: number;
  places?: PlaceItem[];
}) {
  const [items, setItems] = useState<PlaceItem[]>(places);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editReview, setEditReview] = useState("");
  const [editIsMustSee, setEditIsMustSee] = useState(false);
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setItems(places);
  }, [places]);

  const startEdit = (place: PlaceItem) => {
    setEditingId(place.id);
    setEditName(place.name);
    setEditReview(place.review ?? "");
    setEditIsMustSee(Boolean(place.isMustSee));
    setEditCategories(place.categories ?? []);
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditReview("");
    setEditIsMustSee(false);
    setEditCategories([]);
    setActionError(null);
  };

  const toggleEditCategory = (category: string) => {
    setEditCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const saveEdit = async (placeId: string) => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      setActionError("Name fehlt.");
      return;
    }
    setIsSaving(true);
    setActionError(null);
    try {
      const response = await fetch(`/api/recommendations/${placeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName: trimmedName,
          description: editReview.trim() || null,
          isSuperLike: editIsMustSee,
          categories: editCategories,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Speichern fehlgeschlagen.");
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === placeId
            ? {
                ...item,
                name: trimmedName,
                review: editReview.trim(),
                isMustSee: editIsMustSee,
                categories: editCategories,
              }
            : item
        )
      );
      cancelEdit();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Speichern fehlgeschlagen."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlace = async (placeId: string) => {
    if (!globalThis.confirm("Empfehlung wirklich loeschen?") ) return;
    setDeletingId(placeId);
    setActionError(null);
    try {
      const response = await fetch(`/api/recommendations/${placeId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Loeschen fehlgeschlagen.");
      }
      setItems((prev) => prev.filter((item) => item.id !== placeId));
      if (editingId === placeId) {
        cancelEdit();
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Loeschen fehlgeschlagen."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <h1 className="text-lg font-bold text-slate-900">Mein Profil</h1>
        <div className="flex items-center gap-2">
          <form action={signout}>
            <button type="submit" className="flex h-8 items-center justify-center gap-1.5 rounded-lg text-slate-500 hover:bg-slate-50 active:scale-95 transition-all px-3 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-medium">Abmelden</span>
            </button>
          </form>
          <Link
            href="/profile/settings"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
            aria-label="Einstellungen"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto px-4 pt-6 page-transition">
        {/* Profile Card Info */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar Placeholder */}
          <div className="relative">
            <div className="flex h-22 w-22 items-center justify-center rounded-full bg-gradient-to-tr from-brand-green-800 to-brand-green-500 p-0.5 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-slate-800 font-bold text-2xl">
                    {user?.name ? user.name.split(' ').map(n => n[0]).slice(0,2).join('') : (user?.username ? user.username.slice(0,2).toUpperCase() : '')}
                  </div>
            </div>
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-950">{user?.name ?? user?.email ?? 'Profil'}</h2>
          <p className="text-xs font-semibold text-brand-green-700 mt-0.5">{user?.username ? `@${user.username}` : ''}</p>

          {/* Stats Bar */}
          <div className="mt-6 flex w-full max-w-[280px] divide-x divide-slate-100 rounded-xl border border-slate-100 bg-white py-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-base font-extrabold text-slate-900">{items.length}</span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Empfehlungen</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-base font-extrabold text-slate-900">{friendsCount}</span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Freunde</span>
            </div>
          </div>

          {/* Add Friends Button */}
          <Link
            href="/profile/friends"
            className="mt-4 flex items-center justify-center gap-1.5 w-full max-w-[280px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4 text-brand-green-700" />
            Freunde hinzufügen
          </Link>
        </div>

        {/* Activity Feed Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Meine Empfehlungen
            </h3>
          </div>

          {actionError && editingId === null && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {actionError}
            </div>
          )}

          {/* Places List */}
          <div className="space-y-3.5 pb-8">
            {items.length > 0 ? (
              items.map((place) => (
                <div
                  key={place.id}
                  className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
                >
                  {/* Place Info Title & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {editingId === place.id ? (
                        <div className="space-y-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-brand-green-500"
                          />
                          <button
                            type="button"
                            onClick={() => setEditIsMustSee(!editIsMustSee)}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                              editIsMustSee
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-slate-200 bg-white text-slate-500"
                            }`}
                          >
                            <Sparkles className="h-3 w-3" />
                            Must See
                          </button>
                          <div className="flex flex-wrap gap-1.5">
                            {CATEGORY_OPTIONS.map((category) => {
                              const isSelected = editCategories.includes(category);
                              return (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => toggleEditCategory(category)}
                                  className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-all ${
                                    isSelected
                                      ? "border-brand-green-600 bg-brand-green-50 text-brand-green-800"
                                      : "border-slate-200 bg-white text-slate-600"
                                  }`}
                                >
                                  {category}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">{place.timestamp}</span>
                      {editingId === place.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(place.id)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-green-600 bg-brand-green-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm disabled:opacity-60"
                          >
                            <Check className="h-3 w-3" />
                            Speichern
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500"
                          >
                            <X className="h-3 w-3" />
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(place)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:border-slate-300"
                          >
                            <Pencil className="h-3 w-3" />
                            Bearbeiten
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePlace(place.id)}
                            disabled={deletingId === place.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 disabled:opacity-60"
                          >
                            <Trash2 className="h-3 w-3" />
                            Loeschen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingId === place.id && actionError && (
                    <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-2.5 py-2 text-[11px] text-red-700">
                      {actionError}
                    </div>
                  )}

                  {/* Place Review Text */}
                  {editingId === place.id ? (
                    <textarea
                      value={editReview}
                      onChange={(e) => setEditReview(e.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-green-500"
                    />
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {place.review}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <MapPin className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 mt-2 font-medium">Noch keine Empfehlungen eingetragen</p>
                <Link
                  href="/create"
                  className="mt-3.5 inline-flex items-center gap-1 rounded-xl bg-brand-green-700 px-3.5 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-brand-green-800 transition-all cursor-pointer"
                >
                  Ort empfehlen
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
