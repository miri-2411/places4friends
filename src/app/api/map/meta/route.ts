import { NextResponse } from "next/server";
import { createApiClient, getApiUser } from "@/lib/supabase/apiAuth";
import type { MapOverviewPin } from "@/lib/mapPlaces";
import { getNetworkUserIds } from "@/lib/mapNetwork";

export async function GET(request: Request) {
  const user = await getApiUser(request);
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const supabase = await createApiClient(request);
    const allowedUserIds = await getNetworkUserIds(supabase, user.id);

    const { data: activities, error } = await supabase
      .from("activities")
      .select("id, user_id, latitude, longitude, is_superlike, categories")
      .in("user_id", allowedUserIds)
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    if (error) {
      console.error("map meta fetch failed", error);
      return NextResponse.json(
        { error: "Kartendaten konnten nicht geladen werden." },
        { status: 500 }
      );
    }

    const rows = activities || [];
    const friendPlaceCounts: Record<string, number> = {};
    const categorySet = new Set<string>();
    const overviewPins: MapOverviewPin[] = [];

    for (const row of rows) {
      if (row.latitude === null || row.longitude === null) continue;

      friendPlaceCounts[row.user_id] = (friendPlaceCounts[row.user_id] ?? 0) + 1;

      const categories = Array.isArray(row.categories) ? row.categories : [];
      categories.forEach((category) => categorySet.add(category));

      overviewPins.push({
        id: row.id,
        userId: row.user_id,
        latitude: row.latitude,
        longitude: row.longitude,
        isMustSee: row.is_superlike,
        categories,
      });
    }

    return NextResponse.json({
      categories: Array.from(categorySet).sort((a, b) => a.localeCompare(b)),
      friendPlaceCounts,
      overviewPins,
    });
  } catch (error) {
    console.error("map meta request failed", error);
    return NextResponse.json(
      { error: "Kartendaten konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
