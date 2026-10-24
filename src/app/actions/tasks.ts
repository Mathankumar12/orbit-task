"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateSubtaskSchema,
  TaskStatusEnum,
} from "@/lib/validation/task";
import { TaskStatus, TaskPriority } from "@/types/database";

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

export async function createTaskAction(data: {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_at?: string | null;
  parent_task_id?: string | null;
}) {
  try {
    const { supabase, user, workspaceId } = await getAuthenticatedUserAndWorkspace();

    const formattedDueAt = data.due_at && data.due_at.trim() !== "" ? data.due_at : null;

    const validated = CreateTaskSchema.parse({
      ...data,
      due_at: formattedDueAt,
    });

    const isDone = validated.status === "done";
    const completedAt = isDone ? new Date().toISOString() : null;

    const { data: insertedTask, error } = await (supabase.from("tasks") as any)
      .insert({
        workspace_id: workspaceId,
        created_by: user.id,
        title: validated.title,
        description: validated.description || null,
        status: validated.status as TaskStatus,
        priority: validated.priority as TaskPriority,
        due_at: validated.due_at || null,
        parent_task_id: validated.parent_task_id || null,
        completed_at: completedAt,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/today");
    revalidatePath("/tasks");
    revalidatePath("/board");

    return { success: true, data: insertedTask };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create task." };
  }
}

export async function updateTaskAction(
  taskId: string,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_at?: string | null;
    position?: number;
  }
) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const formattedDueAt = data.due_at !== undefined
      ? (data.due_at && data.due_at.trim() !== "" ? data.due_at : null)
      : undefined;

    const validated = UpdateTaskSchema.parse({
      ...data,
      due_at: formattedDueAt,
    });

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (validated.title !== undefined) updatePayload.title = validated.title;
    if (validated.description !== undefined) updatePayload.description = validated.description;
    if (validated.priority !== undefined) updatePayload.priority = validated.priority;
    if (validated.due_at !== undefined) updatePayload.due_at = validated.due_at;
    if (validated.position !== undefined) updatePayload.position = validated.position;

    if (validated.status !== undefined) {
      updatePayload.status = validated.status;
      updatePayload.completed_at =
        validated.status === "done" ? new Date().toISOString() : null;
    }

    const { data: updatedTask, error } = await (supabase.from("tasks") as any)
      .update(updatePayload)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/today");
    revalidatePath("/tasks");
    revalidatePath("/board");

    return { success: true, data: updatedTask };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update task." };
  }
}

export async function toggleTaskStatusAction(taskId: string, currentStatus: TaskStatus) {
  try {
    const nextStatus: TaskStatus = currentStatus === "done" ? "todo" : "done";
    return await updateTaskAction(taskId, { status: nextStatus });
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle task." };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    const { supabase } = await getAuthenticatedUserAndWorkspace();

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/today");
    revalidatePath("/tasks");
    revalidatePath("/board");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete task." };
  }
}

export async function createSubtaskAction(parentTaskId: string, title: string) {
  try {
    const validated = CreateSubtaskSchema.parse({
      parent_task_id: parentTaskId,
      title,
    });

    return await createTaskAction({
      title: validated.title,
      parent_task_id: validated.parent_task_id,
      status: "todo",
      priority: "none",
    });
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create subtask." };
  }
}
