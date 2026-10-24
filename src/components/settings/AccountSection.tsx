"use client";

import React, { useState } from "react";
import {
  User,
  Download,
  AlertTriangle,
  Loader2,
  Check,
  Trash2,
} from "lucide-react";
import {
  updateProfileAction,
  exportUserDataAction,
  deleteAccountAction,
} from "@/app/actions/account";

interface AccountSectionProps {
  initialDisplayName: string;
  email: string;
}

export function AccountSection({
  initialDisplayName,
  email,
}: AccountSectionProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || isSavingProfile) return;

    setIsSavingProfile(true);
    setProfileSuccess(false);
    const res = await updateProfileAction(displayName.trim());
    setIsSavingProfile(false);

    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } else {
      alert(res.error || "Failed to update profile");
    }
  }

  async function handleExportData() {
    if (isExporting) return;
    setIsExporting(true);

    const res = await exportUserDataAction();
    setIsExporting(false);

    if (res.success && res.data) {
      // Trigger client-side JSON download
      const jsonStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbit-task-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(res.error || "Failed to export data.");
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmationInput !== "DELETE") return;
    setIsDeletingAccount(true);
    await deleteAccountAction();
  }

  return (
    <div className="space-y-6 pt-4 border-t border-border">
      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Account Profile
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal profile and display details.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3 py-2 text-xs bg-surface-muted text-muted-foreground rounded-lg border border-border cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-xs bg-surface text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSavingProfile || !displayName.trim()}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSavingProfile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save Profile</span>
            </button>

            {profileSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
                Profile updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Data Export Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Export Workspace Data
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Download a complete JSON export of all your tasks, subtasks, checklists, and notes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-border bg-surface text-foreground rounded-lg hover:bg-surface-muted transition-colors self-start sm:self-auto disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive">
              Danger Zone
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete your account, workspace, tasks, notes, and all related data.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-card border border-destructive/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This action is irreversible and wipes all records immediately.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              To confirm deletion, please type <strong className="text-foreground">DELETE</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-lg outline-none focus:ring-2 focus:ring-destructive"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationInput("");
                }}
                className="px-4 py-2 text-xs font-medium border border-border bg-surface text-foreground rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput !== "DELETE" || isDeletingAccount}
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
