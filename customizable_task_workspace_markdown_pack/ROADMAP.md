# Build Roadmap

Build and test in small stages. Do not begin with a full Notion-style
block editor; it increases complexity before the core product is proven.

## Phase 0 --- Decisions and setup

-   [ ] Choose a product name and original visual identity.
-   [ ] Create a GitHub repository.
-   [ ] Create a Next.js + TypeScript project.
-   [ ] Configure formatting, linting, and environment variables.
-   [ ] Create a Supabase project for development.
-   [ ] Connect the project to a Vercel preview deployment.

**Done when:** the starter app deploys successfully and secrets are not
committed.

## Phase 1 --- Authentication and privacy

-   [ ] Configure Supabase Auth.
-   [ ] Build sign-up, sign-in, sign-out, and password recovery.
-   [ ] Add profile/workspace creation.
-   [ ] Create initial database tables.
-   [ ] Enable and test RLS policies with two test accounts.
-   [ ] Protect authenticated routes.

**Done when:** two users can sign in and each sees only their own
workspace.

## Phase 2 --- Task fundamentals

-   [ ] Create/edit/delete/complete tasks.
-   [ ] Add status, priority, due date, and description.
-   [ ] Add quick-add.
-   [ ] Add search, filters, and sorting.
-   [ ] Add empty, loading, error, and confirmation states.
-   [ ] Add unit/integration tests.

**Done when:** personal task management works reliably on desktop and
mobile.

## Phase 3 --- Checklists and notes

-   [ ] Create and edit checklists.
-   [ ] Add, reorder, check, and delete checklist items.
-   [ ] Show progress and duplicate a checklist.
-   [ ] Create and autosave Markdown/plain-text notes.
-   [ ] Link notes to tasks.

**Done when:** users can organize recurring procedures and supporting
notes.

## Phase 4 --- Views and customization

-   [ ] Build list view.
-   [ ] Build board view grouped by status.
-   [ ] Build Today, Upcoming, and Completed views.
-   [ ] Add theme selection and system theme.
-   [ ] Add compact/comfortable density.
-   [ ] Add accent palette and default view.
-   [ ] Persist preferences across devices.

**Done when:** users can make the app feel like their own without
breaking usability.

## Phase 5 --- Quality and launch

-   [ ] Add mobile navigation and responsive layouts.
-   [ ] Audit keyboard access and focus indicators.
-   [ ] Add app icon, metadata, and basic landing page.
-   [ ] Add privacy policy and terms appropriate to the service.
-   [ ] Add account deletion and data export plan.
-   [ ] Test production environment variables.
-   [ ] Test signup, CRUD, RLS, and deployment end to end.
-   [ ] Monitor errors and database usage.

**Done when:** a new person can register and safely use the hosted app.

## Phase 6 --- Advanced features (only after MVP)

-   [ ] Calendar view.
-   [ ] Recurring tasks and reminders.
-   [ ] Rich block editor.
-   [ ] Custom properties and templates.
-   [ ] Page sharing and permissions.
-   [ ] File uploads and comments.
-   [ ] Import/export and offline support.

## Recommended order of work with a coding assistant

Ask it to implement only one phase or a few related tasks at a time.
After each stage: 1. Review changed files. 2. Run lint/type checks and
tests. 3. Test the feature in the browser. 4. Verify authorization and
privacy. 5. Commit the working version.
