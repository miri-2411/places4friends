import { NextResponse } from "next/server";
import { createApiClient, getApiUser } from "@/lib/supabase/apiAuth";
import {
  activityRowToPin,
  expandMapBounds,
  parseMapBounds,
} from "@/lib/mapPlaces";
import { getNetworkUserIds, loadProfileMap, MAP_PIN_LIMIT, profileInfoForUser } from "@/lib/mapNetwork";
import { buildViewportPinsQuery, parseMapPinFilters } from "@/lib/mapQueries";

export async function GET(request: Request) {
  const user = await getApiUser(request);
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bounds = parseMapBounds(searchParams);
  if (!bounds) {
    return NextResponse.json({ error: "Ungültige Kartengrenzen." }, { status: 400 });
  }

  const filters = parseMapPinFilters(searchParams);
  const expandedBounds = expandMapBounds(bounds);

  try {
    const supabase = await createApiClient(request);
    const allowedUserIds = await getNetworkUserIds(supabase, user.id);

    const { data: activities, error } = await buildViewportPinsQuery(
      supabase,
      allowedUserIds,
      expandedBounds,
      filters
    );

    if (error) {
      console.error("map pins fetch failed", error);
      return NextResponse.json(
        { error: "Pins konnten nicht geladen werden." },
        { status: 500 }
      );
    }

    const rows = activities || [];
    const profileUserIds = Array.from(new Set(rows.map((row) => row.user_id)));
    const profileMap = await loadProfileMap(supabase, profileUserIds);

    const pins = rows
      .filter(
        (row): row is typeof row & { latitude: number; longitude: number } =>
          row.latitude !== null && row.longitude !== null
      )
      .map((row) =>
        activityRowToPin(
          {
            id: row.id,
            user_id: row.user_id,
            place_name: row.place_name,
            latitude: row.latitude,
            longitude: row.longitude,
            is_superlike: row.is_superlike,
          },
          profileInfoForUser(profileMap, row.user_id)
        )
      );

    return NextResponse.json({
      pins,
      truncated: pins.length >= MAP_PIN_LIMIT,
    });
  } catch (error) {
    console.error("map pins request failed", error);
    return NextResponse.json(
      { error: "Pins konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
