"use client";

import { createClient } from "@/app/lib/supabase/client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Divider } from "@mui/material";
import clsx from "clsx";
import NewAuthButton from "@/app/components/auth/OAuthButton";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
},

) {
  const [data, setData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const supabase = createClient();
  const router = useRouter();

  async function sendResetPassword() {
    try {
      const { data: resetData, error } = await supabase
        .auth
        .resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
      setSuccess(true);
    } catch (error) {
      console.log(error);
    };
  };

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prev: any) => ({
        ...prev,
        [name]: value,
    }));
  };

  function handleSignUp() {
    router.push("/register-user");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 my-24 sm:max-w-md justify-center gap-2 rounded-xl shadow-xl bg-gray-800 border border-gray-700">
      <Typography
        variant="h4"
        className="text-left mb-6"
      >
        Login
      </Typography>

      {!resetPassword && (<div>
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          action={"/auth/login-user"}
          method="post"
        >
          <Typography variant="subtitle1">
            Sign in to Nexus
          </Typography>
          <NewAuthButton
            cta="Sign in with GitHub"
            provider="github"
            disabled={false}
          />
          <Divider />
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign In
          </button>
          
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>)}
      {resetPassword && <div className="grid gap-4">
        <div className="grid">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={data?.email}
              onChange={handleChange}
            />
        </div>
        {success && (<div className="bg-green-100 text-green-500 p-4 rounded">
          Success! Check your email for a link to reset your password.
        </div>)}
        <div>
          <button
            className="px-4 py-2 bg-blue-500 rounded cursor-pointer"
            onClick={sendResetPassword}
          >
            Reset my password
          </button>
        </div>
      </div>}
      <p onClick={() => setResetPassword(!resetPassword)}
      className={clsx("cursor-pointer hover:underline",
        resetPassword ? "text-green-500" : "text-foreground"
      )}
      >
        {resetPassword ? "Login" : "Reset password"}
      </p>
      <Typography variant="subtitle1" onClick={handleSignUp}>
        Don't have an account? Sign up
      </Typography>
      <button
        formAction={"/auth/register-user"}
        className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
      >
        Sign Up
      </button>
    </div>
  );
}
