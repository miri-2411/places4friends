import type { MapProfileInfo } from "@/lib/mapNetwork";

export interface MapPlacePin {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  userAvatarUrl: string | null;
  name: string;
  latitude: number;
  longitude: number;
  isMustSee: boolean;
}

export interface MapPlaceDetails {
  review: string;
  categories: string[];
  imageUrls: string[];
  createdAt: string;
}

export type MapPlace = MapPlacePin & MapPlaceDetails;

export interface MapOverviewPin {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  isMustSee: boolean;
  categories: string[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function emptyMapPlaceDetails(): MapPlaceDetails {
  return {
    review: "",
    categories: [],
    imageUrls: [],
    createdAt: "",
  };
}

export function mergeMapPlace(pin: MapPlacePin, details?: Partial<MapPlaceDetails>): MapPlace {
  const base = emptyMapPlaceDetails();
  return {
    ...pin,
    ...base,
    ...details,
  };
}

export function activityRowToPin(
  activity: {
    id: string;
    user_id: string;
    place_name: string;
    latitude: number;
    longitude: number;
    is_superlike: boolean;
  },
  profile: MapProfileInfo
): MapPlacePin {
  return {
    id: activity.id,
    userId: activity.user_id,
    userName: profile.name,
    userInitials: profile.initials,
    userColor: profile.color,
    userAvatarUrl: profile.avatarUrl,
    name: activity.place_name,
    latitude: activity.latitude,
    longitude: activity.longitude,
    isMustSee: activity.is_superlike,
  };
}

export function activityRowToDetails(activity: {
  description?: string | null;
  categories?: string[] | null;
  image_urls?: string[] | null;
  created_at: string;
}): MapPlaceDetails {
  return {
    review: activity.description || "",
    categories: Array.isArray(activity.categories) ? activity.categories : [],
    imageUrls: Array.isArray(activity.image_urls) ? activity.image_urls : [],
    createdAt: activity.created_at,
  };
}

/** Expands bounds slightly so panning does not immediately drop edge pins. */
export function expandMapBounds(bounds: MapBounds, paddingRatio = 0.12): MapBounds {
  const latSpan = bounds.north - bounds.south;
  const lngSpan = bounds.east - bounds.west;
  const latPad = latSpan * paddingRatio;
  const lngPad = lngSpan * paddingRatio;

  return {
    north: Math.min(90, bounds.north + latPad),
    south: Math.max(-90, bounds.south - latPad),
    east: bounds.east + lngPad,
    west: bounds.west - lngPad,
  };
}

export function filterOverviewPins(
  pins: MapOverviewPin[],
  options: {
    userId?: string | null;
    mustSee?: boolean;
    categories?: string[];
  }
): MapOverviewPin[] {
  let next = pins;

  if (options.userId) {
    next = next.filter((pin) => pin.userId === options.userId);
  }

  if (options.mustSee) {
    next = next.filter((pin) => pin.isMustSee);
  }

  if (options.categories && options.categories.length > 0) {
    next = next.filter((pin) =>
      pin.categories.some((category) => options.categories!.includes(category))
    );
  }

  return next;
}

export function parseMapBounds(searchParams: URLSearchParams): MapBounds | null {
  const north = Number(searchParams.get("north"));
  const south = Number(searchParams.get("south"));
  const east = Number(searchParams.get("east"));
  const west = Number(searchParams.get("west"));

  if (
    [north, south, east, west].some(
      (value) => typeof value !== "number" || Number.isNaN(value)
    )
  ) {
    return null;
  }

  if (north <= south || east <= west) {
    return null;
  }

  return { north, south, east, west };
}
