"use client";

import React, { useState, useMemo } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/database";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import {
  TaskFilterBar,
  FilterStatus,
  FilterPriority,
  SortOption,
} from "@/components/tasks/TaskFilterBar";
import { deleteTaskAction } from "@/app/actions/tasks";
import { ListTodo, CheckSquare, Sparkles } from "lucide-react";

interface TasksViewProps {
  initialTasks: Task[];
  initialSubtasks?: Task[];
}

const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

export function TasksView({ initialTasks, initialSubtasks = [] }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subtasks, setSubtasks] = useState<Task[]>(initialSubtasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");

  // Modal States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Sort
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.parent_task_id) // Top-level tasks only in main list
      .filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDesc = t.description?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "due_asc") {
          if (!a.due_at) return 1;
          if (!b.due_at) return -1;
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        }
        if (sortOption === "priority_desc") {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortOption === "title_asc") {
          return a.title.localeCompare(b.title);
        }
        // Default: created_desc
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortOption]);

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
      {/* Quick Add */}
      <QuickAddTask onTaskCreated={() => window.location.reload()} />

      {/* Filter and Search Bar */}
      <TaskFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      {/* Task List */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <ListTodo className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No tasks found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Create your first task above to get started!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => {
              const childSubtasks = subtasks.filter((st) => st.parent_task_id === task.id);
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  subtaskCount={childSubtasks.length}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(t) => setDeletingTask(t)}
                  onStatusToggled={() => window.location.reload()}
                />
              );
            })}
          </div>
        )}
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
