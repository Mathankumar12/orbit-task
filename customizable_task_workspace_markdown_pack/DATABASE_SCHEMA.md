# Database Schema Proposal

This is a starting point for Supabase Postgres. Adjust column types and
constraints to match the chosen implementation. Enable Row Level
Security on every user-owned table.

## 1. profiles

  Column         Type          Notes
  -------------- ------------- -----------------------------------------
  id             uuid          Primary key; references `auth.users.id`
  display_name   text          Optional
  created_at     timestamptz   Default current timestamp
  updated_at     timestamptz   Updated by application or trigger

## 2. workspaces

Start with one workspace per user. This makes future sharing possible
without redesigning every table.

  Column       Type          Notes
  ------------ ------------- ----------------------------
  id           uuid          Primary key
  owner_id     uuid          References `auth.users.id`
  name         text          Required
  created_at   timestamptz   Default current timestamp

## 3. workspace_members (future-ready)

  Column         Type          Notes
  -------------- ------------- ---------------------------------------
  workspace_id   uuid          References workspaces
  user_id        uuid          References auth.users
  role           text          Constrain to owner, editor, or viewer
  created_at     timestamptz   Default current timestamp

For the MVP, membership may be omitted if only the owner can access a
workspace. If created now, define precise RLS policies before enabling
it.

## 4. tasks

  Column           Type                   Notes
  ---------------- ---------------------- --------------------------------------------
  id               uuid                   Primary key
  workspace_id     uuid                   References workspaces
  created_by       uuid                   References auth.users
  parent_task_id   uuid nullable          Self-reference for subtasks
  title            text                   Required, trimmed, reasonable length limit
  description      text nullable          Plain text or sanitized Markdown
  status           text                   e.g. inbox, todo, in_progress, done
  priority         text                   e.g. none, low, medium, high
  due_at           timestamptz nullable   Store timestamps consistently
  position         numeric                Ordering within a view/list
  completed_at     timestamptz nullable   Set/clear when status changes
  created_at       timestamptz            Default current timestamp
  updated_at       timestamptz            Updated on mutations

Suggested indexes: `(workspace_id, status)`, `(workspace_id, due_at)`,
`(workspace_id, created_at)`, and `(parent_task_id)`.

## 5. tags and task_tags

`tags`: id, workspace_id, name, color, created_at.

`task_tags`: task_id, tag_id. Use a composite primary key and ensure
tags and tasks belong to the same workspace.

## 6. checklists and checklist_items

`checklists`: id, workspace_id, created_by, title, description,
position, created_at, updated_at.

`checklist_items`: id, checklist_id, title, is_checked, position,
created_at, updated_at.

Use indexes for checklist ownership and ordering. Ensure access to an
item is authorized through its parent checklist/workspace.

## 7. notes

  Column           Type            Notes
  ---------------- --------------- -----------------------------
  id               uuid            Primary key
  workspace_id     uuid            References workspaces
  created_by       uuid            References auth.users
  title            text            Required
  content          text            Markdown/plain text for MVP
  linked_task_id   uuid nullable   Optional task relationship
  created_at       timestamptz     Default current timestamp
  updated_at       timestamptz     Updated on save

## 8. user_preferences

  Column              Type          Notes
  ------------------- ------------- ------------------------------------
  user_id             uuid          Primary key, references auth.users
  theme               text          light, dark, system
  density             text          comfortable, compact
  accent              text          Validated palette key
  default_view        text          today, list, board, etc.
  sidebar_collapsed   boolean       Default false
  updated_at          timestamptz   Updated on save

## RLS policy requirements

-   A user can select/update their profile only.
-   Workspace access requires ownership or valid membership.
-   Task, checklist, checklist-item, tag, task-tag, note, and preference
    policies must all enforce the same ownership boundary.
-   For nested records, use an `exists` check through the parent record
    and workspace.
-   Do not assume a foreign key alone prevents cross-user access.
-   Test policies using two separate test users before launch.

## Data integrity

-   Use foreign keys and appropriate `ON DELETE` behavior.
-   Prevent blank task titles.
-   Constrain status, priority, theme, density, and role values.
-   Use transactions where one user action changes multiple related
    rows.
-   Add pagination for potentially large lists.
