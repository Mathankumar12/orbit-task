"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UserPreferencesSchema, UserPreferencesInput } from "@/lib/validation/preferences";

export async function updateUserPreferencesAction(data: UserPreferencesInput) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const validated = UserPreferencesSchema.parse(data);

    const updatePayload: any = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await (supabase.from("user_preferences") as any)
      .upsert({
        user_id: user.id,
        ...updatePayload,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    revalidatePath("/today");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update preferences." };
  }
}
