"use server";

import { createClient } from "@/app/lib/supabase/server";
import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server"; // Swapped out NextResponse for Response
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  console.log(`Callback: code: ${code}`) // For testing
  console.log(`Callback: url: ${url}`) // For testing

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Exchange code for session
    const {
      data,
      error
    } = await supabase
      .auth
      .exchangeCodeForSession(code);

    if (error) {
      console.error(error); // For testing
      return Response.redirect(
        `${url.origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    } 
    
    if (data?.session && data?.session.user) {
      // Check if user has a profile
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .maybeSingle();
      
      // If user has no profile, redirect to complete profile
      if (profileError || !profile) {
        return Response.redirect(
          `${url.origin}/login/complete-profile`
          );
      }

      // If user has profile, redirect to dashboard
      return Response.redirect(
        `${url.origin}/dashboard`
      );
    }
  }
  console.log("No code found") // For testing
  // If no code, redirect to login
  return Response.redirect(
    `${url.origin}/login`
  );
}
