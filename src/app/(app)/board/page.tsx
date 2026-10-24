import { createClient } from "@/lib/supabase/server";
import { BoardView } from "@/components/tasks/BoardView";
import { Task } from "@/types/database";
import { LayoutGrid } from "lucide-react";

export default async function BoardPage() {
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
      .order("created_at", { ascending: false });
    tasks = (data as Task[]) || [];
  }

  const topLevelTasks = tasks.filter((t) => !t.parent_task_id);
  const subtasks = tasks.filter((t) => !!t.parent_task_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4" />
            <span>Kanban Flow</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Board</h1>
        </div>
      </div>

      {/* Main Interactive Board View */}
      <BoardView initialTasks={topLevelTasks} initialSubtasks={subtasks} />
    </div>
  );
}
