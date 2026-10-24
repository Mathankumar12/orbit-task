import Link from "next/link";
import { CheckCircle2, Shield, Sliders, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Orbit-Task</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            Private by default • Row Level Security
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            A customizable workspace for your daily tasks & thoughts.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage your personal tasks, checklists, and notes in an isolated private workspace with customizable layouts, density, and themes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 text-base font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover shadow transition-all flex items-center justify-center gap-2"
            >
              Start Free Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 text-base font-semibold border border-border bg-surface text-foreground rounded-xl hover:bg-surface-muted transition-all"
            >
              Sign In to Your Workspace
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Task Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Priorities, tags, subtasks, and instant views (List, Board, Today, Upcoming). Organize tasks the way your brain works.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Deep Personalization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select your preferred theme (Light/Dark/System), comfortable or compact density, and an accent palette that fits your style.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Strict Privacy by Design</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by Supabase Row-Level Security. Every account receives a strictly isolated private workspace.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-6 mb-3">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Orbit-Task. Your personal productivity flow.</p>
      </footer>
    </div>
  );
}
