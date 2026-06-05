import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  const nextUrl = new URL(next, request.url);
  redirectTo.pathname = nextUrl.pathname;
  
  // Copy search params from the next URL to the redirect URL
  nextUrl.searchParams.forEach((value, key) => {
    redirectTo.searchParams.set(key, value);
  });

  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("code");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    } else {
      redirectTo.searchParams.set("error", "access_denied");
      redirectTo.searchParams.set("error_code", error.code || "auth_error");
      redirectTo.searchParams.set("error_description", error.message);
    }
  } else if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    } else {
      redirectTo.searchParams.set("error", "access_denied");
      redirectTo.searchParams.set("error_code", error.code || "auth_error");
      redirectTo.searchParams.set("error_description", error.message);
    }
  } else {
    // If no verification params are present, it's an invalid request
    redirectTo.searchParams.set("error", "invalid_request");
    redirectTo.searchParams.set("error_description", "Ungültige Verifizierungsanfrage.");
  }

  redirectTo.pathname = "/login";
  return NextResponse.redirect(redirectTo);
}
