"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name cannot be empty.")
    .max(100, "Display name cannot exceed 100 characters."),
});

async function getAuthenticatedUserAndWorkspace() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to perform this action.");
  }

  const { data: workspaces, error: wsError } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("owner_id", user.id)
    .limit(1);

  if (wsError || !workspaces || workspaces.length === 0) {
    throw new Error("No active workspace found for this user.");
  }

  const workspace = workspaces[0] as { id: string; name: string };
  return { supabase, user, workspace };
}

export async function updateProfileAction(displayName: string) {
  try {
    const { supabase, user } = await getAuthenticatedUserAndWorkspace();
    const validated = UpdateProfileSchema.parse({ displayName });

    const { error: profileError } = await (supabase.from("profiles") as any)
      .update({
        display_name: validated.displayName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Also update auth metadata
    await supabase.auth.updateUser({
      data: { full_name: validated.displayName },
    });

    revalidatePath("/settings");
    revalidatePath("/today");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile." };
  }
}

export async function exportUserDataAction() {
  try {
    const { supabase, user, workspace } = await getAuthenticatedUserAndWorkspace();

    const [tasksRes, checklistsRes, notesRes, prefRes, profileRes] = await Promise.all([
      (supabase.from("tasks") as any).select("*").eq("workspace_id", workspace.id),
      (supabase.from("checklists") as any).select("*, checklist_items(*)").eq("workspace_id", workspace.id),
      (supabase.from("notes") as any).select("*").eq("workspace_id", workspace.id),
      (supabase.from("user_preferences") as any).select("*").eq("user_id", user.id).single(),
      (supabase.from("profiles") as any).select("*").eq("id", user.id).single(),
    ]);

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        profile: profileRes.data || null,
        preferences: prefRes.data || null,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        tasks: tasksRes.data || [],
        checklists: checklistsRes.data || [],
        notes: notesRes.data || [],
      },
    };

    return { success: true, data: exportData };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to export data." };
  }
}

export async function deleteAccountAction() {
  try {
    const { supabase, user, workspace } = await getAuthenticatedUserAndWorkspace();

    // 1. Delete Workspace (this cascades down via foreign keys to tasks, checklists, notes, tags)
    await supabase.from("workspaces").delete().eq("id", workspace.id);

    // 2. Delete Profile & Preferences
    await supabase.from("user_preferences").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // 3. Sign Out
    await supabase.auth.signOut();
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete account." };
  }

  redirect("/login?account=deleted");
}
