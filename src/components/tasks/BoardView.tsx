"use client";

import React, { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/database";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { deleteTaskAction, updateTaskAction } from "@/app/actions/tasks";
import { formatDate, isOverdue } from "@/lib/utils";
import {
  LayoutGrid,
  Plus,
  Clock,
  Edit3,
  Trash2,
  ListTree,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface BoardViewProps {
  initialTasks: Task[];
  initialSubtasks?: Task[];
}

const columns: { id: TaskStatus; label: string; color: string; next?: TaskStatus; prev?: TaskStatus }[] = [
  { id: "inbox", label: "Inbox", color: "bg-slate-500", next: "todo" },
  { id: "todo", label: "To Do", color: "bg-blue-500", prev: "inbox", next: "in_progress" },
  { id: "in_progress", label: "In Progress", color: "bg-amber-500", prev: "todo", next: "done" },
  { id: "done", label: "Done", color: "bg-emerald-500", prev: "in_progress" },
];

export function BoardView({ initialTasks, initialSubtasks = [] }: BoardViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subtasks, setSubtasks] = useState<Task[]>(initialSubtasks);
  const [activeColQuickAdd, setActiveColQuickAdd] = useState<TaskStatus | null>(null);

  // Modals
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleMoveStatus(taskId: string, newStatus: TaskStatus) {
    const res = await updateTaskAction(taskId, { status: newStatus });
    if (res.success) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    }
  }

  async function handleConfirmDelete() {
    if (!deletingTask) return;
    setIsDeleting(true);
    const res = await deleteTaskAction(deletingTask.id);
    setIsDeleting(false);

    if (res.success) {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setSubtasks((prev) => prev.filter((st) => st.parent_task_id !== deletingTask.id));
      setDeletingTask(null);
    } else {
      alert(res.error || "Failed to delete task.");
    }
  }

  const activeSubtasksForEditing = editingTask
    ? subtasks.filter((st) => st.parent_task_id === editingTask.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter(
            (t) => !t.parent_task_id && t.status === col.id
          );

          return (
            <div
              key={col.id}
              className="bg-surface/60 border border-border rounded-xl p-3 flex flex-col min-h-[450px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveColQuickAdd(activeColQuickAdd === col.id ? null : col.id)
                    }
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Add for this column */}
              {activeColQuickAdd === col.id && (
                <div className="mb-2.5">
                  <QuickAddTask
                    defaultStatus={col.id}
                    placeholder={`New ${col.label} task...`}
                    onTaskCreated={() => {
                      setActiveColQuickAdd(null);
                      window.location.reload();
                    }}
                  />
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-border/80 rounded-lg">
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const taskSubtaskCount = subtasks.filter(
                      (st) => st.parent_task_id === task.id
                    ).length;
                    const overdue = isOverdue(task.due_at) && task.status !== "done";

                    return (
                      <div
                        key={task.id}
                        className="group p-3 bg-card border border-border rounded-lg shadow-sm hover:border-primary/50 transition-all text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`font-semibold text-sm leading-snug cursor-pointer ${
                              task.status === "done"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                            onClick={() => setEditingTask(task)}
                          >
                            {task.title}
                          </p>

                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="p-1 rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeletingTask(task)}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-muted-foreground line-clamp-2 text-xs">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer */}
                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-border/40">
                          <div className="flex items-center gap-1.5">
                            {task.priority && task.priority !== "none" && (
                              <span
                                className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  task.priority === "high"
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                    : task.priority === "medium"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {task.priority}
                              </span>
                            )}

                            {taskSubtaskCount > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground bg-surface-muted px-1.5 py-0.5 rounded">
                                <ListTree className="w-2.5 h-2.5" />
                                {taskSubtaskCount}
                              </span>
                            )}

                            {task.due_at && (
                              <span
                                className={`flex items-center gap-0.5 text-[10px] ${
                                  overdue
                                    ? "text-rose-600 dark:text-rose-400 font-semibold"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <Clock className="w-2.5 h-2.5" />
                                {formatDate(task.due_at)}
                              </span>
                            )}
                          </div>

                          {/* Quick Shift buttons */}
                          <div className="flex items-center gap-1">
                            {col.prev && (
                              <button
                                onClick={() => handleMoveStatus(task.id, col.prev!)}
                                className="p-1 rounded bg-surface hover:bg-surface-muted border border-border text-muted-foreground hover:text-foreground"
                                title={`Move to ${col.prev}`}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.next && (
                              <button
                                onClick={() => handleMoveStatus(task.id, col.next!)}
                                className="p-1 rounded bg-surface hover:bg-surface-muted border border-border text-muted-foreground hover:text-foreground"
                                title={`Move to ${col.next}`}
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <TaskEditModal
        isOpen={!!editingTask}
        task={editingTask}
        subtasks={activeSubtasksForEditing}
        onClose={() => setEditingTask(null)}
        onUpdated={() => window.location.reload()}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        title={deletingTask?.title || ""}
        isDeleting={isDeleting}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
