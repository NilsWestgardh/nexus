"use server";

// If its the first time logging in, redirect to /login/complete-signup

import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url).origin;
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .auth
    .signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.log(`Error when attempting sign in: ${error.message}`);
    const errorMessage = encodeURIComponent(error.message);
    return NextResponse.redirect(`${requestUrl}/login?error=${errorMessage}`);
  }

  // Check if it's the user's first login
  if (data.user && data.user.id) {
    const {
      data: profile,
      error: profileError
    } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .maybeSingle();

      if (profileError) {
        console.error(`Error fetching user profile: ${profileError.message}`);
        return NextResponse.redirect(`${requestUrl}/login?error=Error%20fetching%20user%20profile`);
      } else if (!profile) {
        return NextResponse.redirect(`${requestUrl}/login/complete-profile`);
      }
  }

  console.log(`login-user route: User ${email} signed in successfully`)
  console.log(`login-user route: User session: ${data.session}`)
  return NextResponse.redirect(`${requestUrl}/dashboard`);
}
