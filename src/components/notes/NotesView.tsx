"use client";

import React, { useState, useEffect, useRef } from "react";
import { Note, Task } from "@/types/database";
import { createNoteAction, updateNoteAction, deleteNoteAction } from "@/app/actions/notes";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  Link as LinkIcon,
  Search,
} from "lucide-react";

interface NotesViewProps {
  initialNotes: Note[];
  availableTasks: Task[];
}

export function NotesView({ initialNotes, availableTasks }: NotesViewProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Editor states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || null;
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync editor fields when active note selection changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || "");
      setContent(activeNote.content || "");
      setLinkedTaskId(activeNote.linked_task_id || "");
      setSaveStatus("saved");
    } else {
      setTitle("");
      setContent("");
      setLinkedTaskId("");
    }
  }, [activeNote]);

  // Debounced Autosave
  function triggerAutosave(newTitle: string, newContent: string, newLinkedTaskId: string) {
    if (!selectedNoteId) return;
    setSaveStatus("unsaved");

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const res = await updateNoteAction(selectedNoteId, {
        title: newTitle.trim() || "Untitled Note",
        content: newContent,
        linked_task_id: newLinkedTaskId || null,
      });

      if (res.success && res.data) {
        setSaveStatus("saved");
        const updated = res.data as Note;
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n))
        );
      } else {
        setSaveStatus("unsaved");
      }
    }, 800);
  }

  async function handleCreateNewNote() {
    if (isCreating) return;
    setIsCreating(true);

    const res = await createNoteAction({
      title: "Untitled Note",
      content: "",
    });

    setIsCreating(false);

    if (res.success && res.data) {
      const newNote = res.data as Note;
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } else {
      alert(res.error || "Failed to create note.");
    }
  }

  async function handleDeleteNote() {
    if (!selectedNoteId || isDeleting) return;
    if (!confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);
    const res = await deleteNoteAction(selectedNoteId);
    setIsDeleting(false);

    if (res.success) {
      const remaining = notes.filter((n) => n.id !== selectedNoteId);
      setNotes(remaining);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    } else {
      alert(res.error || "Failed to delete note.");
    }
  }

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px] max-h-[80vh]">
      {/* Sidebar: Notes List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col bg-surface/40 shrink-0">
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Notes ({notes.length})
            </span>
            <button
              onClick={handleCreateNewNote}
              disabled={isCreating}
              className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-50"
              title="Create new note"
            >
              {isCreating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter notes..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Notes List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-muted-foreground">No notes found</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId;
              const linkedTask = availableTasks.find((t) => t.id === note.linked_task_id);

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 cursor-pointer transition-colors text-left ${
                    isSelected
                      ? "bg-accent/70 border-l-4 border-l-primary"
                      : "hover:bg-surface-muted/50"
                  }`}
                >
                  <p className="font-semibold text-xs text-foreground truncate">
                    {note.title || "Untitled"}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    {note.content || "Empty note"}
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-2 text-[10px] text-muted-foreground">
                    <span>{formatDate(note.updated_at)}</span>
                    {linkedTask && (
                      <span className="flex items-center gap-1 text-primary truncate max-w-[120px]">
                        <LinkIcon className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{linkedTask.title}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area: Active Note Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface">
        {activeNote ? (
          <>
            {/* Editor Top Bar */}
            <div className="h-14 px-4 sm:px-6 border-b border-border flex items-center justify-between gap-3 shrink-0">
              {/* Linked Task Selector */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <select
                  value={linkedTaskId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setLinkedTaskId(newId);
                    triggerAutosave(title, content, newId);
                  }}
                  className="text-xs bg-surface-muted border border-border rounded-lg px-2.5 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary max-w-xs truncate"
                  aria-label="Link to task"
                >
                  <option value="">No linked task</option>
                  {availableTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      Task: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Autosave Status & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {saveStatus === "saving" && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span>Saving...</span>
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>Saved</span>
                    </>
                  )}
                  {saveStatus === "unsaved" && (
                    <span className="text-amber-500 font-medium">Unsaved</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDeleteNote}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete note"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Note Content Fields */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col space-y-3 overflow-y-auto">
              {/* Note Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  triggerAutosave(newTitle, content, linkedTaskId);
                }}
                placeholder="Note title..."
                className="text-xl sm:text-2xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 w-full"
              />

              {/* Note Content Textarea */}
              <textarea
                value={content}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setContent(newContent);
                  triggerAutosave(title, newContent, linkedTaskId);
                }}
                placeholder="Start writing thoughts, meeting notes, project plans, or markdown..."
                className="flex-1 w-full bg-transparent border-none outline-none text-sm text-foreground/90 placeholder:text-muted-foreground/50 resize-none leading-relaxed min-h-[300px]"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <h3 className="font-semibold text-base text-foreground">No note selected</h3>
            <p className="text-xs mt-1 max-w-xs">
              Select a note from the left sidebar or create a new note to start writing.
            </p>
            <button
              onClick={handleCreateNewNote}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create a note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
