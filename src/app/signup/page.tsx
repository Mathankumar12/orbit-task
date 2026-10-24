"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signupAction } from "@/app/auth/actions";
import { Sparkles, ArrowRight, Loader2, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Creating workspace...
        </>
      ) : (
        <>
          Create Account <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signupAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Orbit-Task</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Free private workspace with isolated Row-Level Security
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {state?.error && (
            <div className="mb-6 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{state.success}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Alex Rivera"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
