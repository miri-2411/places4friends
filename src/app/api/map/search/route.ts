import { NextResponse } from "next/server";
import { createApiClient, getApiUser } from "@/lib/supabase/apiAuth";
import { activityRowToPin } from "@/lib/mapPlaces";
import { getNetworkUserIds, loadProfileMap, profileInfoForUser } from "@/lib/mapNetwork";
import { applyMapPinFilters } from "@/lib/mapQueries";

const SEARCH_LIMIT = 12;

export async function GET(request: Request) {
  const user = await getApiUser(request);
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const filters = {
    userId: searchParams.get("userId"),
    mustSee: searchParams.get("mustSee") === "true",
    categories: searchParams
      .get("categories")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  };

  try {
    const supabase = await createApiClient(request);
    const allowedUserIds = await getNetworkUserIds(supabase, user.id);

    let dbQuery = supabase
      .from("activities")
      .select("id, user_id, place_name, latitude, longitude, is_superlike, description")
      .in("user_id", allowedUserIds)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .ilike("place_name", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(SEARCH_LIMIT);

    dbQuery = applyMapPinFilters(dbQuery, filters);

    const { data: activities, error } = await dbQuery;

    if (error) {
      console.error("map search failed", error);
      return NextResponse.json(
        { error: "Suche konnte nicht ausgeführt werden." },
        { status: 500 }
      );
    }

    const rows = activities || [];
    const profileUserIds = Array.from(new Set(rows.map((row) => row.user_id)));
    const profileMap = await loadProfileMap(supabase, profileUserIds);

    const results = rows
      .filter(
        (row): row is typeof row & { latitude: number; longitude: number } =>
          row.latitude !== null && row.longitude !== null
      )
      .map((row) => {
        const pin = activityRowToPin(
          {
            id: row.id,
            user_id: row.user_id,
            place_name: row.place_name,
            latitude: row.latitude,
            longitude: row.longitude,
            is_superlike: row.is_superlike,
          },
          profileInfoForUser(profileMap, row.user_id)
        );

        const reviewPreview = row.description
          ? row.description.length > 60
            ? `${row.description.slice(0, 60)}...`
            : row.description
          : "Empfohlener Ort";

        return {
          pin,
          address: reviewPreview,
        };
      });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("map search request failed", error);
    return NextResponse.json(
      { error: "Suche konnte nicht ausgeführt werden." },
      { status: 500 }
    );
  }
}
