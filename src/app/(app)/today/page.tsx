import { createClient } from "@/lib/supabase/server";
import { TodayView } from "@/components/tasks/TodayView";
import { Task } from "@/types/database";
import { CalendarDays } from "lucide-react";

export default async function TodayPage() {
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

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const pendingCount = topLevelTasks.filter((t) => t.status !== "done").length;
  const completedCount = topLevelTasks.filter((t) => t.status === "done").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" />
            <span>Today&apos;s Focus</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">{todayStr}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs">
            <span className="text-muted-foreground mr-1.5">Pending:</span>
            <span className="font-bold text-foreground">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs">
            <span className="text-muted-foreground mr-1.5">Done:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Today View */}
      <TodayView initialTasks={topLevelTasks} initialSubtasks={subtasks} />
    </div>
  );
}
