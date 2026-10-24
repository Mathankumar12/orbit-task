import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppTheme, AppDensity, AppAccent, Workspace, UserPreferences } from "@/types/database";

export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch or retrieve workspace
  let workspaceName = "Personal Workspace";
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .limit(1);

  if (workspaces && workspaces.length > 0) {
    const ws = workspaces[0] as Workspace;
    workspaceName = ws.name;
  }

  // Fetch user preferences
  const { data: userPref } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const preferences = userPref as UserPreferences | null;
  const theme: AppTheme = preferences?.theme || "system";
  const density: AppDensity = preferences?.density || "comfortable";
  const accent: AppAccent = preferences?.accent || "indigo";
  const defaultView = preferences?.default_view || "today";
  const sidebarCollapsed = preferences?.sidebar_collapsed || false;

  return (
    <ThemeProvider
      initialTheme={theme}
      initialDensity={density}
      initialAccent={accent}
      initialDefaultView={defaultView}
    >
      <AppShell
        user={{
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0],
        }}
        workspaceName={workspaceName}
        initialCollapsed={sidebarCollapsed}
      >
        {children}
      </AppShell>
    </ThemeProvider>
  );
}
