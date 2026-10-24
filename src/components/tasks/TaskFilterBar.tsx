"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { TaskPriority, TaskStatus } from "@/types/database";

export type FilterStatus = "all" | TaskStatus;
export type FilterPriority = "all" | TaskPriority;
export type SortOption = "created_desc" | "due_asc" | "priority_desc" | "title_asc";

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (s: FilterStatus) => void;
  priorityFilter: FilterPriority;
  onPriorityFilterChange: (p: FilterPriority) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
}

const statusOptions: { id: FilterStatus; label: string }[] = [
  { id: "all", label: "All Tasks" },
  { id: "inbox", label: "Inbox" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export function TaskFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortOption,
  onSortOptionChange,
}: TaskFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full h-9 pl-9 pr-4 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as FilterPriority)}
              className="h-9 px-3 text-xs bg-card border border-border rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              aria-label="Filter by priority"
            >
              <option value="all">Priority: All</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
              <option value="none">No Priority</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
              className="h-9 px-3 text-xs bg-card border border-border rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              aria-label="Sort tasks"
            >
              <option value="created_desc">Newest First</option>
              <option value="due_asc">Due Date (Earliest)</option>
              <option value="priority_desc">Priority (Highest)</option>
              <option value="title_asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStatusFilterChange(opt.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-muted"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
