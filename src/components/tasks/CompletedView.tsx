"use client";

import React, { useState } from "react";
import { Task } from "@/types/database";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { deleteTaskAction } from "@/app/actions/tasks";
import { CheckCircle2, Search, Sparkles } from "lucide-react";

interface CompletedViewProps {
  initialTasks: Task[];
  initialSubtasks?: Task[];
}

export function CompletedView({ initialTasks, initialSubtasks = [] }: CompletedViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subtasks, setSubtasks] = useState<Task[]>(initialSubtasks);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false)
    );
  });

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

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search completed tasks..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
        />
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card/40">
          <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No completed tasks found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No tasks matched your search query."
              : "Tasks you complete across Today, All Tasks, and Board will be safely archived here."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          {filteredTasks.map((task) => (
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
