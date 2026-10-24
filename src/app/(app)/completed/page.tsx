import { createClient } from "@/lib/supabase/server";
import { CompletedView } from "@/components/tasks/CompletedView";
import { Task } from "@/types/database";
import { CheckCircle2 } from "lucide-react";

export default async function CompletedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: workspacesData } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user?.id || "")
    .limit(1);

  const workspaces = (workspacesData as any[]) || [];
  const workspaceId = workspaces[0]?.id;

  let tasks: Task[] = [];
  if (workspaceId) {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("status", "done")
      .order("completed_at", { ascending: false });
    tasks = (data as Task[]) || [];
  }

  const topLevelTasks = tasks.filter((t) => !t.parent_task_id);
  const subtasks = tasks.filter((t) => !!t.parent_task_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Task Archive</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Completed Tasks</h1>
        </div>
      </div>

      <CompletedView initialTasks={topLevelTasks} initialSubtasks={subtasks} />
    </div>
  );
}
