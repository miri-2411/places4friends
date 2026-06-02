import type { SupabaseClient } from "@supabase/supabase-js";
import { MAP_PIN_LIMIT } from "@/lib/mapNetwork";
import type { MapBounds } from "@/lib/mapPlaces";

export interface MapPinFilters {
  userId?: string | null;
  mustSee?: boolean;
  categories?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMapPinFilters(query: any, filters: MapPinFilters) {
  let next = query;

  if (filters.userId) {
    next = next.eq("user_id", filters.userId);
  }

  if (filters.mustSee) {
    next = next.eq("is_superlike", true);
  }

  if (filters.categories && filters.categories.length > 0) {
    next = next.overlaps("categories", filters.categories);
  }

  return next;
}

export function buildViewportPinsQuery(
  supabase: SupabaseClient,
  allowedUserIds: string[],
  bounds: MapBounds,
  filters: MapPinFilters
) {
  let query = supabase
    .from("activities")
    .select("id, user_id, place_name, latitude, longitude, is_superlike")
    .in("user_id", allowedUserIds)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .gte("latitude", bounds.south)
    .lte("latitude", bounds.north)
    .gte("longitude", bounds.west)
    .lte("longitude", bounds.east);

  query = applyMapPinFilters(query, filters);
  return query.limit(MAP_PIN_LIMIT);
}

export function parseMapPinFilters(searchParams: URLSearchParams): MapPinFilters {
  const categoriesParam = searchParams.get("categories");
  const categories = categoriesParam
    ? categoriesParam.split(",").map((value) => value.trim()).filter(Boolean)
    : [];

  return {
    userId: searchParams.get("userId"),
    mustSee: searchParams.get("mustSee") === "true",
    categories,
  };
}
