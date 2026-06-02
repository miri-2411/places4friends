import React from "react";

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
      {...props}
    />
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 !rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <div className="w-9" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </header>
      <div className="flex-grow overflow-y-auto px-4 pt-6 page-transition">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-22 w-22 !rounded-full mb-4" />
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="mt-8 flex w-full border-b border-slate-100">
          <div className="flex-1 pb-3 flex justify-center border-b-2 border-brand-green-700">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex-1 pb-3 flex justify-center border-b-2 border-transparent">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="mt-6 space-y-4 pb-8">
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function FriendsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-24 font-sans">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <div className="w-16" />
        <Skeleton className="h-4 w-32" />
        <div className="w-16" />
      </header>
      <div className="flex border-b border-slate-100 bg-white px-4 py-2 sticky top-14 z-10">
        <div className="flex-1 py-2 flex justify-center border-b-2 border-brand-green-700">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex-1 py-2 flex justify-center border-b-2 border-transparent">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex-1 px-4 pt-5 page-transition">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-3 w-24" />
          
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 first:pt-2 last:pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 !rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </header>
      <div className="px-4 pt-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl mt-8" />
      </div>
    </div>
  );
}

export function ActivityDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <div className="w-9" />
      </header>
      <div className="flex-grow overflow-y-auto page-transition">
        <Skeleton className="h-64 w-full rounded-none" />
        <div className="px-4 pt-5 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-10 !rounded-full flex-shrink-0" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Skeleton className="h-10 w-10 !rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivitiesSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-center border-b border-slate-100 bg-white px-4">
        <Skeleton className="h-4 w-24" />
      </header>
      <div className="flex-grow overflow-y-auto px-4 pt-6 page-transition">
        <div className="space-y-4 pb-8">
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
        </div>
      </div>
    </div>
  );
}
