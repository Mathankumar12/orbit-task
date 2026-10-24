"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, MoreVertical, Edit3, Trash2, ListTree } from "lucide-react";
import { Task, TaskStatus } from "@/types/database";
import { formatDate, isOverdue } from "@/lib/utils";
import { toggleTaskStatusAction } from "@/app/actions/tasks";

interface TaskItemProps {
  task: Task;
  subtaskCount?: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusToggled?: () => void;
}

export function TaskItem({
  task,
  subtaskCount = 0,
  onEdit,
  onDelete,
  onStatusToggled,
}: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const isDone = task.status === "done";
  const overdue = isOverdue(task.due_at) && !isDone;

  async function handleToggle() {
    if (isToggling) return;
    setIsToggling(true);
    await toggleTaskStatusAction(task.id, task.status);
    setIsToggling(false);
    onStatusToggled?.();
  }

  return (
    <div className="group p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-surface-muted/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          disabled={isToggling}
          onClick={handleToggle}
          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
            isDone
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border hover:border-primary/60 bg-surface"
          } ${isToggling ? "opacity-50" : ""}`}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
        >
          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>

        {/* Title & Description */}
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onEdit(task)}>
          <p
            className={`text-sm font-medium truncate ${
              isDone ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Badges & Meta */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Subtask count */}
        {subtaskCount > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-md border border-border/60">
            <ListTree className="w-3 h-3" />
            {subtaskCount}
          </span>
        )}

        {/* Priority Badge */}
        {task.priority && task.priority !== "none" && (
          <span
            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
              task.priority === "high"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                : task.priority === "medium"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
            }`}
          >
            {task.priority}
          </span>
        )}

        {/* Due Date */}
        {task.due_at && (
          <span
            className={`text-xs flex items-center gap-1 ${
              overdue
                ? "text-rose-600 dark:text-rose-400 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <Clock className="w-3 h-3" />
            {formatDate(task.due_at)}
          </span>
        )}

        {/* Actions Menu */}
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
