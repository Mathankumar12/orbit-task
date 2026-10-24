"use client";

import React, { useState, useMemo } from "react";
import { Task } from "@/types/database";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { deleteTaskAction } from "@/app/actions/tasks";
import { isOverdue, isDueToday } from "@/lib/utils";
import { CalendarDays, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

interface TodayViewProps {
  initialTasks: Task[];
  initialSubtasks?: Task[];
}

export function TodayView({ initialTasks, initialSubtasks = [] }: TodayViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subtasks, setSubtasks] = useState<Task[]>(initialSubtasks);

  // Modal States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Segregate Tasks
  const topTasks = useMemo(() => tasks.filter((t) => !t.parent_task_id), [tasks]);

  const overdueTasks = useMemo(() => {
    return topTasks.filter((t) => t.status !== "done" && isOverdue(t.due_at) && !isDueToday(t.due_at));
  }, [topTasks]);

  const dueTodayTasks = useMemo(() => {
    return topTasks.filter((t) => t.status !== "done" && (isDueToday(t.due_at) || (!t.due_at && t.status === "inbox")));
  }, [topTasks]);

  const completedTasks = useMemo(() => {
    return topTasks.filter((t) => t.status === "done");
  }, [topTasks]);

  const activeSubtasksForEditing = useMemo(() => {
    if (!editingTask) return [];
    return subtasks.filter((st) => st.parent_task_id === editingTask.id);
  }, [editingTask, subtasks]);

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

  return (
    <div className="space-y-6">
      {/* Quick Add pre-configured with today's date */}
      <QuickAddTask
        defaultDueToday={true}
        placeholder="Add a task for today... (Press Enter to save)"
        onTaskCreated={() => window.location.reload()}
      />

      {/* Overdue Section (if any) */}
      {overdueTasks.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Overdue ({overdueTasks.length})</span>
          </div>

          <div className="divide-y divide-border border border-rose-500/30 rounded-xl bg-card overflow-hidden">
            {overdueTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subtaskCount={subtasks.filter((st) => st.parent_task_id === task.id).length}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
                onStatusToggled={() => window.location.reload()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Due Today Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <CalendarDays className="w-4 h-4" />
          <span>Today&apos;s Focus & Inbox ({dueTodayTasks.length})</span>
        </div>

        <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
          {dueTodayTasks.length === 0 ? (
            <div className="p-8 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Nothing pending for today!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add a quick task above or review other views.
              </p>
            </div>
          ) : (
            dueTodayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subtaskCount={subtasks.filter((st) => st.parent_task_id === task.id).length}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
                onStatusToggled={() => window.location.reload()}
              />
            ))
          )}
        </div>
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-2.5 pt-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed ({completedTasks.length})</span>
          </div>

          <div className="divide-y divide-border border border-border rounded-xl bg-card/60 overflow-hidden">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subtaskCount={subtasks.filter((st) => st.parent_task_id === task.id).length}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
                onStatusToggled={() => window.location.reload()}
              />
            ))}
          </div>
        </div>
      )}

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
