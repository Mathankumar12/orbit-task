import Link from "next/link";
import { ArrowLeft, FileCheck } from "lucide-react";

export default function TermsOfServicePage() {
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
          <span className="font-semibold text-sm">Terms of Service</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-3">
            <FileCheck className="w-3.5 h-3.5" />
            User Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: October 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground/90">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Orbit-Task, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Acceptable Use</h2>
          <p>
            Orbit-Task is provided for personal task, checklist, and notes management. You agree not to use the service for illegal activities, reverse-engineering, security probing, or attempting to breach the Row Level Security boundaries separating user workspaces.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Limitation of Liability</h2>
          <p>
            Orbit-Task is provided &ldquo;as is&rdquo; without warranties of any kind. While we design the application for high reliability, data protection, and availability, we shall not be liable for any indirect or consequential damages resulting from the use or inability to use the service.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Orbit-Task. All rights reserved.</p>
      </footer>
    </div>
  );
}
