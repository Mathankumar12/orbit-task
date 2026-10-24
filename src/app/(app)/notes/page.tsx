import { createClient } from "@/lib/supabase/server";
import { NotesView } from "@/components/notes/NotesView";
import { Note, Task } from "@/types/database";
import { FileText } from "lucide-react";

export default async function NotesPage() {
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

  let notes: Note[] = [];
  let tasks: Task[] = [];

  if (workspaceId) {
    const [notesRes, tasksRes] = await Promise.all([
      (supabase.from("notes") as any)
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false }),
      (supabase.from("tasks") as any)
        .select("id, title")
        .eq("workspace_id", workspaceId)
        .order("title", { ascending: true }),
    ]);

    notes = (notesRes.data as Note[]) || [];
    tasks = (tasksRes.data as Task[]) || [];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Workspace Knowledge</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Notes & Ideas</h1>
        </div>
      </div>

      <NotesView initialNotes={notes} availableTasks={tasks} />
    </div>
  );
}
