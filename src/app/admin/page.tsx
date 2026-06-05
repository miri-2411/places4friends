import { redirect } from "next/navigation";
import { checkAdminStatus } from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard",
  description: "Systemstatistiken und Inhaltsmoderation für places4friends.",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { isAdmin } = await checkAdminStatus();

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20 page-transition">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h1 className="text-sm font-bold text-slate-900">Admin-Bereich</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4 ring-8 ring-rose-50/50">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Zugriff verweigert</h2>
          <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
            Du hast keine Berechtigung, auf diesen Bereich zuzugreifen. Wende dich an den Systemadministrator, falls dies ein Fehler ist.
          </p>
          <Link
            href="/"
            className="mt-8 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Karte
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboardClient />;
}
