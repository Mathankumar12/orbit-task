import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orbit-Task</span>
          </Link>
          <span className="font-semibold text-sm">Privacy Policy</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-3">
            <Shield className="w-3.5 h-3.5" />
            Privacy by Design
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: October 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground/90">
          <h2 className="text-lg font-bold text-foreground">1. Private by Default</h2>
          <p>
            Orbit-Task is built around the principle that your tasks, procedures, and personal thoughts belong exclusively to you. Every user account operates in a strictly isolated workspace guarded by PostgreSQL Row Level Security (RLS). No other user can view, edit, or search your records.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>Account Information:</strong> Your email address and optional display name for authentication.</li>
            <li><strong>Workspace Content:</strong> Tasks, subtasks, checklists, items, and notes you create.</li>
            <li><strong>Preferences:</strong> Your selected interface theme, density, accent palette, and default landing view.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Data Ownership & Portability</h2>
          <p>
            You retain 100% ownership of your data at all times. Orbit-Task provides a built-in one-click <strong>Export Workspace Data (JSON)</strong> feature in your Settings, allowing you to back up or migrate your records whenever you choose.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Account & Data Deletion</h2>
          <p>
            You have the right to permanently erase your data at any time. Under Settings $\rightarrow$ Danger Zone, you can trigger a permanent deletion that cascades across your workspace, wiping all tasks, checklists, notes, preferences, and profile records from the database immediately.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">5. Security Infrastructure</h2>
          <p>
            Data is stored in managed Supabase Postgres with end-to-end transport encryption (HTTPS/TLS) and strict token validation on every mutation. Service-role privileges are strictly isolated from client-side code.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Orbit-Task. Private & customizable productivity flow.</p>
      </footer>
    </div>
  );
}
