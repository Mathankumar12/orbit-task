"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateNoteSchema, UpdateNoteSchema } from "@/lib/validation/note";

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

export async function createNoteAction(data: {
  title: string;
  content?: string;
  linked_task_id?: string | null;
}) {
  try {
    const { supabase, user, workspaceId } = await getAuthenticatedUserAndWorkspace();
    const validated = CreateNoteSchema.parse(data);

    const { data: inserted, error } = await (supabase.from("notes") as any)
      .insert({
        workspace_id: workspaceId,
        created_by: user.id,
        title: validated.title,
        content: validated.content || "",
        linked_task_id: validated.linked_task_id || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notes");
    return { success: true, data: inserted };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create note." };
  }
}

export async function updateNoteAction(
  noteId: string,
  data: {
    title?: string;
    content?: string;
    linked_task_id?: string | null;
  }
) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();
    const validated = UpdateNoteSchema.parse(data);

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (validated.title !== undefined) updatePayload.title = validated.title;
    if (validated.content !== undefined) updatePayload.content = validated.content;
    if (validated.linked_task_id !== undefined) {
      updatePayload.linked_task_id = validated.linked_task_id || null;
    }

    const { data: updated, error } = await (supabase.from("notes") as any)
      .update(updatePayload)
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notes");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update note." };
  }
}

export async function deleteNoteAction(noteId: string) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete note." };
  }
}
