"use client";

import React, { useState } from "react";
import { Plus, Loader2, Calendar, Flag } from "lucide-react";
import { createTaskAction } from "@/app/actions/tasks";
import { TaskPriority, TaskStatus } from "@/types/database";

interface QuickAddTaskProps {
  defaultStatus?: TaskStatus;
  defaultDueToday?: boolean;
  onTaskCreated?: () => void;
  placeholder?: string;
}

export function QuickAddTask({
  defaultStatus = "inbox",
  defaultDueToday = false,
  onTaskCreated,
  placeholder = "Add a task... (Press Enter to save)",
}: QuickAddTaskProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [dueDate, setDueDate] = useState<string>(
    defaultDueToday ? new Date().toISOString().split("T")[0] : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const dueAtFormatted = dueDate ? new Date(`${dueDate}T23:59:59Z`).toISOString() : null;

    const res = await createTaskAction({
      title: title.trim(),
      status: defaultStatus,
      priority,
      due_at: dueAtFormatted,
    });

    setIsSubmitting(false);

    if (res.success) {
      setTitle("");
      setPriority("none");
      if (!defaultDueToday) setDueDate("");
      setShowOptions(false);
      onTaskCreated?.();
    } else {
      alert(res.error || "Failed to create task");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
    >
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:hover:bg-primary/10 disabled:hover:text-primary"
          title="Add task"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.length > 0 && !showOptions) {
              setShowOptions(true);
            }
          }}
          onFocus={() => setShowOptions(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />

        {showOptions && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Priority Selector */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="text-xs bg-surface border border-border rounded-md px-2 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Task priority"
            >
              <option value="none">Priority: None</option>
              <option value="low">Priority: Low</option>
              <option value="medium">Priority: Medium</option>
              <option value="high">Priority: High</option>
            </select>

            {/* Due Date Input */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs bg-surface border border-border rounded-md px-2 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Due date"
            />
          </div>
        )}
      </div>
    </form>
  );
}
