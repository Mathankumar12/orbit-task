"use client";

import React, { useState } from "react";
import { Checklist, ChecklistItem } from "@/types/database";
import { ChecklistCard } from "@/components/checklists/ChecklistCard";
import { CreateChecklistModal } from "@/components/checklists/CreateChecklistModal";
import { CheckSquare, Plus, Search } from "lucide-react";

interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

interface ChecklistsViewProps {
  initialChecklists: ChecklistWithItems[];
}

export function ChecklistsView({ initialChecklists }: ChecklistsViewProps) {
  const [checklists, setChecklists] = useState<ChecklistWithItems[]>(initialChecklists);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredChecklists = checklists.filter((cl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = cl.title.toLowerCase().includes(q);
    const matchDesc = cl.description?.toLowerCase().includes(q) || false;
    return matchTitle || matchDesc;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search checklists..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Checklist</span>
        </button>
      </div>

      {/* Grid of Checklists */}
      {filteredChecklists.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card/40">
          <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground mx-auto flex items-center justify-center mb-3">
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold">No checklists found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No checklists matched your search terms."
              : "Create reusable procedures, packaging checklists, sprint routines, or packing lists."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create your first checklist
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {filteredChecklists.map((cl) => (
            <ChecklistCard
              key={cl.id}
              checklist={cl}
              onRefresh={() => window.location.reload()}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateChecklistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => window.location.reload()}
      />
    </div>
  );
}
