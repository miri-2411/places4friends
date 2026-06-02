import type { Metadata } from "next";
import ActivityDetailPageClient from "@/app/activities/[id]/ActivityDetailPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Ort Details",
  description: "Empfehlung auf places4friends ansehen.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ActivityDetailPageClient activityId={id} />;
}
