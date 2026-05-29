"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Users, Compass, Bookmark } from "lucide-react";

interface FriendInfo {
  id: string;
  name: string;
  username: string;
  initials: string;
  color: string;
}

interface ActivityItem {
  id: string;
  placeName: string;
  isMustSee: boolean;
  description: string;
  categories: string[];
  timestamp: string;
  friend: FriendInfo;
}

export default function ActivitiesView({
  activities = [],
  initialWishlistedIds = [],
}: {
  activities?: ActivityItem[];
  initialWishlistedIds?: string[];
}) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(initialWishlistedIds);

  useEffect(() => {
    setWishlistIds(initialWishlistedIds);
  }, [initialWishlistedIds]);

  const toggleWishlist = async (activityId: string) => {
    const isSaved = wishlistIds.includes(activityId);
    if (isSaved) {
      setWishlistIds((prev) => prev.filter((id) => id !== activityId));
      try {
        const response = await fetch(`/api/wishlist?activityId=${activityId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error();
      } catch (err) {
        setWishlistIds((prev) => [...prev, activityId]);
      }
    } else {
      setWishlistIds((prev) => [...prev, activityId]);
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityId }),
        });
        if (!response.ok) throw new Error();
      } catch (err) {
        setWishlistIds((prev) => prev.filter((id) => id !== activityId));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <h1 className="text-lg font-bold text-slate-900">Aktivitäten</h1>
      </header>

      <div className="flex-grow overflow-y-auto px-4 pt-6 page-transition">
        {/* Title & Description */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Feed deiner Freunde
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hier siehst du die neuesten Empfehlungen von Leuten, denen du folgst.
          </p>
        </div>

        {/* Activities List */}
        <div className="space-y-4 pb-8">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
              >
                {/* Friend Header */}
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Friend Avatar */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${activity.friend.color}`}
                    >
                      {activity.friend.initials}
                    </div>
                    {/* Friend Name & Username */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {activity.friend.name}
                      </h4>
                      {activity.friend.username && (
                        <p className="text-[10px] font-semibold text-brand-green-700">
                          @{activity.friend.username}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {activity.timestamp}
                  </span>
                </div>

                {/* Recommendation Details */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-brand-green-700 flex-shrink-0" />
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-green-700 transition-colors">
                        {activity.placeName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {activity.isMustSee && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/15 shadow-sm">
                          <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-400 animate-pulse" />
                          Must See
                        </span>
                      )}
                      
                      <button
                        onClick={() => toggleWishlist(activity.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white hover:bg-slate-50 active:scale-90 transition-all cursor-pointer shadow-sm"
                        title={wishlistIds.includes(activity.id) ? "Aus Wishlist entfernen" : "In Wishlist speichern"}
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 transition-colors ${
                            wishlistIds.includes(activity.id)
                              ? "text-brand-green-700 fill-brand-green-700"
                              : "text-slate-400 hover:text-brand-green-700"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Review Text */}
                  {activity.description ? (
                    <p className="text-xs leading-relaxed text-slate-600 pl-5">
                      {activity.description}
                    </p>
                  ) : (
                    <p className="text-xs italic text-slate-400 pl-5">
                      Keine Beschreibung hinterlassen.
                    </p>
                  )}

                  {/* Categories Tags */}
                  {activity.categories && activity.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-5">
                      {activity.categories.map((category) => (
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
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 px-6 text-center shadow-sm">
              <Compass className="h-9 w-9 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 mt-3">
                Noch keine Aktivitäten
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
                Füge Freunde hinzu, um deren Empfehlungen und Aktivitäten hier zu sehen.
              </p>
              <Link
                href="/profile/friends"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-green-800 transition-all cursor-pointer"
              >
                <Users className="h-4 w-4" />
                Freunde finden
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
