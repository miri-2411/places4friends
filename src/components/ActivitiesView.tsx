"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Compass, Bookmark } from "lucide-react";
import ActivityCard from "./ActivityCard";

interface FriendInfo {
  id: string;
  name: string;
  username: string;
  initials: string;
  color: string;
  avatarUrl?: string | null;
}

interface ActivityItem {
  id: string;
  placeName: string;
  isMustSee: boolean;
  description: string;
  categories: string[];
  timestamp: string;
  friend: FriendInfo;
  latitude?: number | null;
  longitude?: number | null;
  imageUrls?: string[];
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
              <ActivityCard
                key={activity.id}
                id={activity.id}
                placeName={activity.placeName}
                latitude={activity.latitude}
                longitude={activity.longitude}
                isMustSee={activity.isMustSee}
                description={activity.description}
                categories={activity.categories}
                timestamp={activity.timestamp}
                friend={activity.friend}
                imageUrls={activity.imageUrls}
                actions={
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
                }
              />
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
