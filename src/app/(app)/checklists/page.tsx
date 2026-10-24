import { createClient } from "@/lib/supabase/server";
import { ChecklistsView } from "@/components/checklists/ChecklistsView";
import { Checklist, ChecklistItem } from "@/types/database";
import { CheckSquare } from "lucide-react";

interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

export default async function ChecklistsPage() {
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

  let checklists: ChecklistWithItems[] = [];
  if (workspaceId) {
    const { data } = await (supabase.from("checklists") as any)
      .select("*, checklist_items(*)")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });
    checklists = (data as ChecklistWithItems[]) || [];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Procedures & Checklists</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Checklists & Templates</h1>
        </div>
      </div>

      <ChecklistsView initialChecklists={checklists} />
    </div>
  );
}
