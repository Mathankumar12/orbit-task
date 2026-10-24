import { createClient } from "@/lib/supabase/server";
import { SettingsPreferencesView } from "@/components/settings/SettingsPreferencesView";
import { AccountSection } from "@/components/settings/AccountSection";
import { Shield } from "lucide-react";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    if ((profile as any)?.display_name) {
      displayName = (profile as any).display_name;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preferences & Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your Orbit-Task interface, manage your profile, and export your data.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced to Supabase</span>
        </div>
      </div>

      {/* Appearance & Themes */}
      <SettingsPreferencesView />

      {/* Privacy & Security Explanation */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <Shield className="w-4 h-4" />
          <span>Security & Row Level Security</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your workspace data is completely isolated. Supabase Postgres enforces database-level RLS policies on all queries, guaranteeing that other users cannot read or modify your tasks, notes, or checklists.
        </p>
      </div>

      {/* Profile, Data Export, and Account Deletion */}
      <AccountSection
        initialDisplayName={displayName}
        email={user?.email || ""}
      />
    </div>
  );
}
