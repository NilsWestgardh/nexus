"use server";

import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url).origin;
  const formData = await req.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  // const username = String(formData.get("username"));

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // data: { 
      //   username: username,
      // },
      emailRedirectTo: `${url}/auth/callback`,
    },
  });

  if (error) {
    console.log(`Error when attempting sign up: ${error.message}`);
    const errorMessage = encodeURIComponent(error.message);
    return NextResponse.redirect(`${url}/login?error=${errorMessage}`);
  }

  return NextResponse.redirect(
    `${url}/login?message=Check your email to continue sign in process!`,
  );
}
