"use client";

import React, { useState } from "react";
import { X, Loader2, CheckSquare } from "lucide-react";
import { createChecklistAction } from "@/app/actions/checklists";

interface CreateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateChecklistModal({
  isOpen,
  onClose,
  onCreated,
}: CreateChecklistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await createChecklistAction({
      title: title.trim(),
      description: description.trim() || null,
    });
    setIsSubmitting(false);

    if (res.success) {
      setTitle("");
      setDescription("");
      onCreated?.();
      onClose();
    } else {
      alert(res.error || "Failed to create checklist");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">New Checklist</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deployment Routine, Grocery List, Sprint Launch"
              className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this procedure or list for?"
              className="w-full px-3 py-2 text-xs bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
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
              <span>Create Checklist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
