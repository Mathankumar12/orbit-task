import { createClient } from "@/lib/supabase/server";
import { UpcomingView } from "@/components/tasks/UpcomingView";
import { Task } from "@/types/database";
import { CalendarClock } from "lucide-react";

export default async function UpcomingPage() {
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
      .neq("status", "done")
      .order("due_at", { ascending: true });
    tasks = (data as Task[]) || [];
  }

  const topLevelTasks = tasks.filter((t) => !t.parent_task_id);
  const subtasks = tasks.filter((t) => !!t.parent_task_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <CalendarClock className="w-4 h-4" />
            <span>Scheduled Horizon</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Upcoming Tasks</h1>
        </div>
      </div>

      <UpcomingView initialTasks={topLevelTasks} initialSubtasks={subtasks} />
    </div>
  );
}
