"use client";

import React, { useState, useMemo } from "react";
import { Task } from "@/types/database";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { deleteTaskAction } from "@/app/actions/tasks";
import { Calendar, CalendarClock, Sparkles } from "lucide-react";

interface UpcomingViewProps {
  initialTasks: Task[];
  initialSubtasks?: Task[];
}

export function UpcomingView({ initialTasks, initialSubtasks = [] }: UpcomingViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subtasks, setSubtasks] = useState<Task[]>(initialSubtasks);

  // Modals
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Grouping logic
  const { tomorrowTasks, thisWeekTasks, laterTasks, unscheduledTasks } = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);

    const tmrw: Task[] = [];
    const thisWk: Task[] = [];
    const ltr: Task[] = [];
    const unsched: Task[] = [];

    tasks.forEach((t) => {
      if (!t.due_at) {
        unsched.push(t);
        return;
      }

      const dueDayStr = t.due_at.split("T")[0];
      const dueDate = new Date(t.due_at);

      if (dueDayStr === tomorrowStr) {
        tmrw.push(t);
      } else if (dueDate <= weekLater) {
        thisWk.push(t);
      } else {
        ltr.push(t);
      }
    });

    return {
      tomorrowTasks: tmrw,
      thisWeekTasks: thisWk,
      laterTasks: ltr,
      unscheduledTasks: unsched,
    };
  }, [tasks]);

  const activeSubtasksForEditing = editingTask
    ? subtasks.filter((st) => st.parent_task_id === editingTask.id)
    : [];

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

  function renderGroup(title: string, groupTasks: Task[]) {
    if (groupTasks.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{title} ({groupTasks.length})</span>
        </div>

        <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          {groupTasks.map((task) => (
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
    );
  }

  return (
    <div className="space-y-6">
      <QuickAddTask
        placeholder="Add an upcoming task... (Press Enter to save)"
        onTaskCreated={() => window.location.reload()}
      />

      {tasks.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card/40">
          <CalendarClock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No upcoming tasks scheduled</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Assign due dates to your tasks to see them organized by upcoming timeline here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderGroup("Tomorrow", tomorrowTasks)}
          {renderGroup("Next 7 Days", thisWeekTasks)}
          {renderGroup("Later", laterTasks)}
          {renderGroup("Unscheduled Backlog", unscheduledTasks)}
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
