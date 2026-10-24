# Product Requirements Document

## 1. Vision

Build a personal productivity workspace combining to-do lists,
checklists, lightweight notes, and flexible task views. It should feel
adaptable rather than forcing every user into one layout.

The goal is **similar categories of functionality**, not a
pixel-for-pixel Notion clone. Use original naming, visual design, and
components.

## 2. Target users

1.  **Personal user:** manages daily tasks, routines, projects, and
    notes.
2.  **Public user:** registers on the deployed app and uses an isolated
    private workspace.
3.  **Future team user:** may share selected pages or projects, if
    collaboration is added later.

## 3. MVP features

### Authentication and workspace

-   Email/password or magic-link sign-in through Supabase Auth.
-   Sign-up, sign-in, sign-out, password recovery.
-   One private workspace per user at first.
-   Profile settings and account deletion flow.
-   Optional demo/guest mode only if it cannot expose real user data.

### Tasks

-   Create, edit, complete, reopen, and delete tasks.
-   Fields: title, description, status, priority, due date, tags,
    created time, updated time.
-   Subtasks with nesting limited to one level in the MVP.
-   Optional reminder field; actual push/email reminders can come later.
-   Quick-add task input.
-   Search by task title and description.
-   Filters for status, priority, tag, and due date.
-   Sort by due date, priority, creation date, or custom order.
-   Bulk complete and bulk delete with confirmation.

### Checklists

-   Create named checklists.
-   Add, edit, reorder, check, and remove checklist items.
-   Show completion count and progress.
-   Duplicate a checklist as a reusable template.
-   Optional due date on a checklist.

### Notes and pages

-   Create simple text/Markdown notes.
-   Link a note to a project or task.
-   Autosave with visible save status.
-   Avoid a complex block editor in the first release; add rich blocks
    later.

### Views

-   **List:** compact, scannable rows.
-   **Board:** columns by status, with drag-and-drop when supported.
-   **Today:** tasks due today plus overdue tasks.
-   **Upcoming:** tasks ordered by due date.
-   **Calendar:** monthly/weekly due-date view, planned after the MVP if
    needed.
-   **Completed:** searchable completed tasks.

### UI personalization

-   Light, dark, and system themes.
-   Adjustable density: comfortable or compact.
-   Sidebar show/hide and collapsible groups.
-   Custom workspace accent color from a controlled palette.
-   Choose a default landing view.
-   Remember view filters, sort order, and layout preferences per user.
-   Responsive mobile navigation.

### Reliability

-   Loading, empty, error, and offline/failed-save states.
-   Confirmation before destructive actions.
-   Keyboard-accessible controls and visible focus states.
-   Clear success/error messages.

## 4. Later features

-   Rich block editor with headings, callouts, images, toggles, and
    drag-to-reorder blocks.
-   Database-like custom properties.
-   User-defined templates.
-   Shared pages, permissions, and collaboration.
-   Comments, mentions, activity history.
-   File uploads.
-   Recurring tasks and reminders.
-   Export to Markdown/CSV and account data export.
-   PWA installation and offline editing.
-   Import from common task formats.

## 5. Non-goals for the MVP

-   Pixel-perfect imitation of Notion.
-   Full enterprise project management.
-   Real-time multi-user editing.
-   Complex automations.
-   Native mobile apps.
-   Publicly accessible task data by default.

## 6. Primary user flows

### First use

1.  User opens the public site.
2.  User registers or signs in.
3.  App creates or loads the user's private workspace.
4.  User sees a helpful empty state with a create-task action.
5.  User creates a task and chooses a view.

### Daily planning

1.  Open Today.
2.  Review overdue and due-today tasks.
3.  Mark completed or change priority.
4.  Add a new task using quick add.
5.  Switch to a project/list or board.

### Personalization

1.  Open Settings.
2.  Change theme, density, accent, and default view.
3.  App saves preferences to the account.
4.  Preferences persist across devices after sign-in.

## 7. MVP success criteria

-   New user can create and complete a task without guidance.
-   Main task actions are available within a few interactions.
-   Views remain usable on mobile.
-   A user cannot access another user's records by changing a URL or
    request.
-   No secrets are exposed in client-side code.
-   Core actions have automated tests or a documented manual test
    checklist.
