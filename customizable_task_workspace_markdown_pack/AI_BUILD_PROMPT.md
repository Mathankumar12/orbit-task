# Master Prompt for a Coding Assistant

Use this file as the project brief when asking a coding assistant to
build the app. Work in small milestones rather than generating the
entire application at once.

------------------------------------------------------------------------

You are a senior full-stack engineer and product designer. Help me build
an original, customizable productivity web app for tasks, checklists,
lightweight notes, and project views. It should offer familiar
productivity capabilities found in workspace tools, but must have its
own product identity and must not copy Notion's branding, assets, or
exact interface.

## Product requirements

-   Framework: Next.js App Router with TypeScript.
-   UI: Tailwind CSS and an accessible component library such as
    shadcn/ui.
-   Hosting: Vercel.
-   Database/auth: Supabase Postgres and Supabase Auth.
-   Data protection: Supabase Row Level Security on all user-owned
    tables.
-   Users: public registration, with each account receiving a private
    workspace.
-   Core features: tasks, priorities, statuses, due dates, tags,
    subtasks, checklists, plain-text/Markdown notes, search, filters,
    and sorting.
-   Views: list, board, Today, Upcoming, and Completed; add calendar
    later if it is too large for the first milestone.
-   Personalization: light/dark/system theme, compact/comfortable
    density, controlled accent palette, collapsible sidebar, and saved
    default view.
-   Responsive layout for desktop and mobile.
-   Use original design tokens, spacing, typography, icons, and layout
    decisions.
-   Include loading, empty, error, and success states.
-   Validate all inputs on the server and handle errors safely.
-   Do not expose service-role keys to the client.
-   Do not use localStorage as the main persistent database.
-   Do not implement fake authentication or fake data as if it were
    saved.
-   Do not claim a feature is complete until it works and has been
    tested.

## Required working method

1.  First inspect the existing repository and explain its current state.
2.  Propose a short implementation plan for the next milestone only.
3.  Implement that milestone without unrelated refactors.
4.  List every file created or changed.
5.  Explain any environment variables or dashboard configuration needed.
6.  Run available lint, type-check, and tests; report actual results
    honestly.
7.  Give manual browser-test steps.
8.  Wait for my review before starting the next milestone.

## Privacy requirements

-   Enforce authorization on the server and with database RLS.
-   Test access with two separate users.
-   Never rely on hiding buttons to secure records.
-   Do not place secrets in source code.
-   Ensure task, checklist, note, tag, and preference queries are scoped
    to the authenticated user's workspace.

## First task

Start with Phase 0 and Phase 1 from `ROADMAP.md`: project setup,
Supabase configuration, authentication, workspace creation, database
migrations, and tested RLS. Before coding, tell me what decisions or
credentials are needed. Never ask me to paste secrets into chat; explain
where to set them locally or in provider dashboards.

After the authentication and privacy milestone is complete, proceed to
task CRUD, then checklists and notes, then views and customization.

------------------------------------------------------------------------

## Prompt for each next milestone

After reviewing the current code, implement only this milestone:
**\[write the milestone here\]**.

Acceptance criteria: - The feature works end to end. - Inputs are
validated. - Authorization is checked on the server and in database
policies where applicable. - Loading, empty, error, and success states
are handled. - Responsive behavior is checked. - Relevant tests are run
and their actual output is summarized. - Existing working features are
not broken.
