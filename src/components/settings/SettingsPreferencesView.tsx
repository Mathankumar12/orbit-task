"use client";

import { useAppTheme } from "@/components/layout/ThemeProvider";
import { AppTheme, AppDensity, AppAccent, DefaultView } from "@/types/database";
import {
  Check,
  Moon,
  Sun,
  Monitor,
  Sliders,
  CalendarDays,
  ListTodo,
  LayoutGrid,
  CheckSquare,
  FileText,
} from "lucide-react";

const accents: { id: AppAccent; name: string; color: string }[] = [
  { id: "indigo", name: "Indigo", color: "#4f46e5" },
  { id: "blue", name: "Sky Blue", color: "#2563eb" },
  { id: "emerald", name: "Emerald", color: "#059669" },
  { id: "violet", name: "Violet", color: "#7c3aed" },
  { id: "rose", name: "Rose", color: "#e11d48" },
  { id: "amber", name: "Amber", color: "#d97706" },
];

const defaultViewOptions: { id: DefaultView; label: string; desc: string; icon: any }[] = [
  { id: "today", label: "Today", desc: "Focus on today's tasks and overdue items", icon: CalendarDays },
  { id: "tasks", label: "All Tasks", desc: "List view with filters and search", icon: ListTodo },
  { id: "board", label: "Board", desc: "Kanban board sorted by status", icon: LayoutGrid },
  { id: "checklists", label: "Checklists", desc: "Reusable templates and procedures", icon: CheckSquare },
  { id: "notes", label: "Notes", desc: "Markdown and plain text knowledge base", icon: FileText },
];

export function SettingsPreferencesView() {
  const {
    theme,
    density,
    accent,
    defaultView,
    setTheme,
    setDensity,
    setAccent,
    setDefaultView,
  } = useAppTheme();

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Theme Mode
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select light, dark, or sync with your system preference.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3.5 rounded-lg border flex flex-col items-center gap-2 text-sm font-medium transition-all ${
              theme === "light"
                ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                : "border-border hover:bg-surface-muted"
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3.5 rounded-lg border flex flex-col items-center gap-2 text-sm font-medium transition-all ${
              theme === "dark"
                ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                : "border-border hover:bg-surface-muted"
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3.5 rounded-lg border flex flex-col items-center gap-2 text-sm font-medium transition-all ${
              theme === "system"
                ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                : "border-border hover:bg-surface-muted"
            }`}
          >
            <Monitor className="w-5 h-5 text-muted-foreground" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Density Selection */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Interface Density
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose comfortable row spacing or a compact view to see more at once.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDensity("comfortable")}
            className={`p-3.5 rounded-lg border flex items-center justify-between text-sm font-medium transition-all ${
              density === "comfortable"
                ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                : "border-border hover:bg-surface-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" />
              <div>
                <span className="block font-medium">Comfortable (Default)</span>
                <span className="text-[11px] text-muted-foreground">Relaxed spacing and padding</span>
              </div>
            </div>
            {density === "comfortable" && <Check className="w-4 h-4 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => setDensity("compact")}
            className={`p-3.5 rounded-lg border flex items-center justify-between text-sm font-medium transition-all ${
              density === "compact"
                ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                : "border-border hover:bg-surface-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" />
              <div>
                <span className="block font-medium">Compact</span>
                <span className="text-[11px] text-muted-foreground">Dense rows and scannability</span>
              </div>
            </div>
            {density === "compact" && <Check className="w-4 h-4 text-primary" />}
          </button>
        </div>
      </div>

      {/* Accent Palette */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Accent Palette
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose your signature color for buttons, tags, and highlights.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {accents.map((acc) => {
            const isSelected = accent === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccent(acc.id)}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20"
                    : "border-border hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: acc.color }}
                  />
                  <span>{acc.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Default Landing View */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Default Landing View
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose which view loads automatically after sign-in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {defaultViewOptions.map((opt) => {
            const isSelected = defaultView === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDefaultView(opt.id)}
                className={`p-3.5 rounded-lg border flex items-center justify-between text-left text-xs transition-all ${
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground ring-2 ring-primary/20 font-medium"
                    : "border-border hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{opt.desc}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
