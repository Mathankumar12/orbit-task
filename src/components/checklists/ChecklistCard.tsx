"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  CheckCircle2,
  Copy,
  Trash2,
  Plus,
  Loader2,
  MoreVertical,
} from "lucide-react";
import {
  addChecklistItemAction,
  toggleChecklistItemAction,
  deleteChecklistItemAction,
  duplicateChecklistAction,
  deleteChecklistAction,
} from "@/app/actions/checklists";
import { Checklist, ChecklistItem } from "@/types/database";

interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

interface ChecklistCardProps {
  checklist: ChecklistWithItems;
  onRefresh?: () => void;
}

export function ChecklistCard({ checklist, onRefresh }: ChecklistCardProps) {
  const [items, setItems] = useState<ChecklistItem[]>(checklist.checklist_items || []);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const completedCount = items.filter((i) => i.is_checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  async function handleToggleItem(item: ChecklistItem) {
    const res = await toggleChecklistItemAction(item.id, item.is_checked);
    if (res.success) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_checked: !item.is_checked } : i))
      );
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemTitle.trim() || isAddingItem) return;

    setIsAddingItem(true);
    const res = await addChecklistItemAction(checklist.id, newItemTitle.trim());
    setIsAddingItem(false);

    if (res.success && res.data) {
      setItems((prev) => [...prev, res.data as ChecklistItem]);
      setNewItemTitle("");
    }
  }

  async function handleDeleteItem(itemId: string) {
    const res = await deleteChecklistItemAction(itemId);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  }

  async function handleDuplicate() {
    if (isDuplicating) return;
    setIsDuplicating(true);
    const res = await duplicateChecklistAction(checklist.id);
    setIsDuplicating(false);

    if (res.success) {
      onRefresh?.();
    } else {
      alert(res.error || "Failed to duplicate checklist.");
    }
  }

  async function handleDeleteChecklist() {
    if (!confirm(`Delete checklist "${checklist.title}"?`)) return;
    setIsDeleting(true);
    const res = await deleteChecklistAction(checklist.id);
    setIsDeleting(false);

    if (res.success) {
      onRefresh?.();
    } else {
      alert(res.error || "Failed to delete checklist.");
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
      <div>
        {/* Header & Actions */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-base text-foreground truncate">
              {checklist.title}
            </h3>
            {checklist.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {checklist.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
              title="Duplicate as template"
            >
              {isDuplicating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleDeleteChecklist}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete checklist"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1 pb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              {completedCount} of {totalCount} completed
            </span>
            <span className="font-bold text-foreground">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-1.5 divide-y divide-border/40 max-h-56 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-2.5 pt-1.5 first:pt-0"
            >
              <div
                onClick={() => handleToggleItem(item)}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    item.is_checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary/60 bg-surface"
                  }`}
                >
                  {item.is_checked && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span
                  className={`text-xs truncate ${
                    item.is_checked
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                title="Delete item"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Inline */}
      <form onSubmit={handleAddItem} className="pt-2 border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Add an item..."
          className="flex-1 px-2.5 py-1 text-xs bg-surface border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!newItemTitle.trim() || isAddingItem}
          className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 transition-colors"
          title="Add item"
        >
          {isAddingItem ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </button>
      </form>
    </div>
  );
}
