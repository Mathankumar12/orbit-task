"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Calendar,
  Flag,
  CheckCircle2,
  ListPlus,
  Trash2,
} from "lucide-react";
import { updateTaskAction, createSubtaskAction, toggleTaskStatusAction, deleteTaskAction } from "@/app/actions/tasks";
import { Task, TaskPriority, TaskStatus } from "@/types/database";

interface TaskEditModalProps {
  task: Task | null;
  subtasks?: Task[];
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function TaskEditModal({
  task,
  subtasks = [],
  isOpen,
  onClose,
  onUpdated,
}: TaskEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("inbox");
  const [priority, setPriority] = useState<TaskPriority>("none");
  const [dueDate, setDueDate] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubtaskSubmitting, setIsSubtaskSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "inbox");
      setPriority(task.priority || "none");
      setDueDate(task.due_at ? task.due_at.split("T")[0] : "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const dueAtFormatted = dueDate ? new Date(`${dueDate}T23:59:59Z`).toISOString() : null;

    const res = await updateTaskAction(task!.id, {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_at: dueAtFormatted,
    });

    setIsSubmitting(false);

    if (res.success) {
      onUpdated?.();
      onClose();
    } else {
      alert(res.error || "Failed to update task");
    }
  }

  async function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isSubtaskSubmitting) return;

    setIsSubtaskSubmitting(true);
    const res = await createSubtaskAction(task!.id, newSubtaskTitle.trim());
    setIsSubtaskSubmitting(false);

    if (res.success) {
      setNewSubtaskTitle("");
      onUpdated?.();
    } else {
      alert(res.error || "Failed to add subtask");
    }
  }

  async function handleToggleSubtask(subtaskId: string, currentStatus: TaskStatus) {
    await toggleTaskStatusAction(subtaskId, currentStatus);
    onUpdated?.();
  }

  async function handleDeleteSubtask(subtaskId: string) {
    await deleteTaskAction(subtaskId);
    onUpdated?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Edit Task Details
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors font-medium"
              placeholder="Task title"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="inbox">Inbox</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context or notes..."
              className="w-full px-3 py-2 text-xs bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
            />
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-border/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ListPlus className="w-3.5 h-3.5" />
                Subtasks ({subtasks.length})
              </span>
            </div>

            {/* List existing subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 divide-y divide-border/40 border border-border rounded-lg p-2 bg-surface">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 pt-1.5 first:pt-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(st.id, st.status)}
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          st.status === "done"
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {st.status === "done" && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      <span
                        className={`text-xs truncate ${
                          st.status === "done" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      title="Delete subtask"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask inline input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 px-3 py-1.5 text-xs bg-surface border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim() || isSubtaskSubmitting}
                className="px-3 py-1.5 text-xs font-medium bg-surface-muted hover:bg-surface border border-border rounded-lg text-foreground transition-colors disabled:opacity-40"
              >
                {isSubtaskSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium border border-border bg-surface text-foreground rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
