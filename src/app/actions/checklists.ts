"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  CreateChecklistSchema,
  UpdateChecklistSchema,
  ChecklistItemSchema,
} from "@/lib/validation/checklist";

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
    .select("id")
    .eq("owner_id", user.id)
    .limit(1);

  if (wsError || !workspaces || workspaces.length === 0) {
    throw new Error("No active workspace found for this user.");
  }

  const workspaceId = (workspaces[0] as { id: string }).id;
  return { supabase, user, workspaceId };
}

export async function createChecklistAction(data: {
  title: string;
  description?: string | null;
}) {
  try {
    const { supabase, user, workspaceId } = await getAuthenticatedUserAndWorkspace();
    const validated = CreateChecklistSchema.parse(data);

    const { data: inserted, error } = await (supabase.from("checklists") as any)
      .insert({
        workspace_id: workspaceId,
        created_by: user.id,
        title: validated.title,
        description: validated.description || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true, data: inserted };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create checklist." };
  }
}

export async function updateChecklistAction(
  checklistId: string,
  data: {
    title?: string;
    description?: string | null;
  }
) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();
    const validated = UpdateChecklistSchema.parse(data);

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (validated.title !== undefined) updatePayload.title = validated.title;
    if (validated.description !== undefined) updatePayload.description = validated.description;

    const { data: updated, error } = await (supabase.from("checklists") as any)
      .update(updatePayload)
      .eq("id", checklistId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update checklist." };
  }
}

export async function deleteChecklistAction(checklistId: string) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", checklistId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete checklist." };
  }
}

export async function duplicateChecklistAction(checklistId: string) {
  try {
    const { supabase, user, workspaceId } = await getAuthenticatedUserAndWorkspace();

    // 1. Fetch original checklist
    const { data: original, error: origError } = await (supabase.from("checklists") as any)
      .select("*, checklist_items(*)")
      .eq("id", checklistId)
      .single();

    if (origError || !original) {
      return { success: false, error: "Checklist not found." };
    }

    // 2. Insert cloned checklist
    const { data: cloned, error: cloneError } = await (supabase.from("checklists") as any)
      .insert({
        workspace_id: workspaceId,
        created_by: user.id,
        title: `${original.title} (Copy)`,
        description: original.description,
      })
      .select()
      .single();

    if (cloneError || !cloned) {
      return { success: false, error: cloneError?.message || "Failed to duplicate checklist." };
    }

    // 3. Clone items if any
    const items = original.checklist_items || [];
    if (items.length > 0) {
      const clonedItems = items.map((it: any) => ({
        checklist_id: cloned.id,
        title: it.title,
        is_checked: false, // Reset completion state for fresh template use
        position: it.position || 0,
      }));

      await (supabase.from("checklist_items") as any).insert(clonedItems);
    }

    revalidatePath("/checklists");
    return { success: true, data: cloned };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to duplicate checklist." };
  }
}

export async function addChecklistItemAction(checklistId: string, title: string) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();
    const validated = ChecklistItemSchema.parse({ checklist_id: checklistId, title });

    const { data: inserted, error } = await (supabase.from("checklist_items") as any)
      .insert({
        checklist_id: validated.checklist_id,
        title: validated.title,
        is_checked: false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true, data: inserted };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add item." };
  }
}

export async function toggleChecklistItemAction(itemId: string, currentChecked: boolean) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const { data: updated, error } = await (supabase.from("checklist_items") as any)
      .update({
        is_checked: !currentChecked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle item." };
  }
}

export async function deleteChecklistItemAction(itemId: string) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/checklists");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete item." };
  }
}
