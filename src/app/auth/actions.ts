"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const AuthSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  fullName: z.string().optional(),
});

export type AuthActionResult = {
  error?: string;
  success?: string;
};

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = AuthSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Respect user's saved default landing view
  let targetView = "/today";
  if (authData?.user) {
    const { data: pref } = await supabase
      .from("user_preferences")
      .select("default_view")
      .eq("user_id", authData.user.id)
      .single();
    if ((pref as any)?.default_view) {
      targetView = `/${(pref as any).default_view}`;
    }
  }

  redirect(targetView);
}

export async function signupAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const parsed = AuthSchema.safeParse({ email, password, fullName });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split("@")[0],
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If Supabase has email confirmation enabled and session is null
  if (data.user && !data.session) {
    return {
      success:
        "Account created! Please check your email to confirm your registration.",
    };
  }

  redirect("/today");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
