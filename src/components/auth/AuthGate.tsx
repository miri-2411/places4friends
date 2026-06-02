"use client";

import type { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import AuthPrompt from "@/components/AuthPrompt";
import { useAuth } from "@/components/auth/AuthProvider";

export type AuthGateContext = "profile" | "create" | "activities" | "friends";

interface AuthGateProps {
  context: AuthGateContext;
  headerTitle: string;
  titleClassName?: string;
  children: (user: User) => React.ReactNode;
  skeleton?: React.ReactNode;
}

export default function AuthGate({
  context,
  headerTitle,
  titleClassName = "text-lg font-bold text-slate-900",
  children,
  skeleton,
}: AuthGateProps) {
  const { user, loading } = useAuth();

  const shell = (content: React.ReactNode) => (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-center border-b border-slate-100 bg-white px-4">
        <h1 className={titleClassName}>{headerTitle}</h1>
      </header>
      {content}
    </div>
  );

  if (loading) {
    if (skeleton) return <>{skeleton}</>;
    return shell(
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green-700" />
      </div>
    );
  }

  if (!user) {
    return shell(<AuthPrompt context={context} />);
  }

  return <>{children(user)}</>;
}
