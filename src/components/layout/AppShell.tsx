"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  CheckSquare,
  LayoutGrid,
  ListTodo,
  FileText,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { updateUserPreferencesAction } from "@/app/actions/preferences";
import { cn } from "@/lib/utils";

interface AppShellProps {
  user: {
    email?: string;
    fullName?: string;
  };
  workspaceName: string;
  initialCollapsed?: boolean;
  children: React.ReactNode;
}

const navItems = [
  { name: "Today", href: "/today", icon: CalendarDays },
  { name: "Upcoming", href: "/upcoming", icon: CalendarClock },
  { name: "Completed", href: "/completed", icon: CheckCircle2 },
  { name: "All Tasks", href: "/tasks", icon: ListTodo },
  { name: "Board", href: "/board", icon: LayoutGrid },
  { name: "Checklists", href: "/checklists", icon: CheckSquare },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({
  user,
  workspaceName,
  initialCollapsed = false,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    updateUserPreferencesAction({ sidebar_collapsed: next });
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300 lg:static",
          collapsed ? "lg:w-16" : "lg:w-64",
          mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Workspace Brand / Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-semibold text-sm tracking-tight block truncate">
                  Orbit-Task
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {workspaceName || "Personal Workspace"}
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Sidebar Collapse Toggle */}
        <div className="hidden lg:flex px-3 py-2 border-t border-border justify-end">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Footer Profile & Sign Out */}
        <div className="p-3 border-t border-border bg-surface-muted/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium shrink-0">
                <User className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user.email || ""}
                  </p>
                </div>
              )}
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign Out"
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile */}
        <header className="lg:hidden h-14 border-b border-border bg-surface px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">Orbit-Task</span>
          <div className="w-5" />
        </header>

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
