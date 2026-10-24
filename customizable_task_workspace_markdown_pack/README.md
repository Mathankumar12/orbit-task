# Personalizable Tasks & Workspace App

A customizable task, checklist, and notes workspace inspired by the
broad functionality of apps such as Notion. Build an original product
and UI; do not copy Notion's branding, assets, or exact interface.

## Product goal

Create a web app where one person can manage personal tasks, checklists,
notes, and projects, while other people can register and use their own
private workspace after the app is deployed publicly.

## Core principles

-   **Private by default:** each user's data is visible only to that
    user unless sharing is deliberately added.
-   **Customizable views:** users can choose layouts, density, colors,
    and how tasks are grouped or sorted.
-   **Responsive:** usable on desktop, tablet, and mobile.
-   **Deployable:** hosted on Vercel with a managed database and
    authentication provider.
-   **Incremental:** launch a useful MVP first, then add advanced
    workspace features.

## Suggested stack

-   Next.js with App Router and TypeScript
-   Tailwind CSS plus a component system such as shadcn/ui
-   Supabase for Postgres, authentication, and optional file storage
-   Vercel for hosting
-   Zod for validation
-   React Hook Form for forms
-   A drag-and-drop library such as dnd-kit when board reordering is
    implemented

Choose current stable versions when creating the project and follow
their official documentation.

## Documentation index

-   [Product requirements](PRD.md)
-   [Technical architecture](TECH_STACK.md)
-   [Database schema](DATABASE_SCHEMA.md)
-   [Build roadmap](ROADMAP.md)
-   [Deployment guide](DEPLOYMENT.md)
-   [Security and privacy](SECURITY.md)
-   [Prompt for a coding assistant](AI_BUILD_PROMPT.md)

## Public use and personal use

Yes. Once deployed, anyone can open the public site and create an
account if sign-up is enabled. Each account should receive a separate
workspace. You can use your own account for personal tasks. A public URL
does **not** mean users' tasks should be public. Keep access private
unless you explicitly build sharing.

## MVP acceptance checklist

-   [ ] A visitor can register, sign in, and sign out.
-   [ ] A user can create, edit, complete, delete, and search tasks.
-   [ ] Tasks can have due dates, priorities, tags, and subtasks.
-   [ ] A user can create reusable checklists and notes.
-   [ ] List, board, and calendar-style views are available (calendar
    can be a later phase).
-   [ ] Users can choose a theme and basic layout preferences.
-   [ ] Users cannot read or modify another user's records.
-   [ ] The production app works on mobile and desktop.
-   [ ] Environment secrets are stored in Vercel/Supabase settings, not
    committed to Git.
