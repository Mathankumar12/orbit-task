# Technical Architecture and Stack

## Recommended architecture

Use a conventional full-stack Next.js application. Keep UI, server-side
validation, database access, and authentication responsibilities clear.

### Front end

-   Next.js App Router
-   TypeScript
-   Tailwind CSS
-   shadcn/ui or another accessible component library
-   React Hook Form + Zod for validated forms
-   dnd-kit for drag-and-drop in a later phase
-   A date/calendar library chosen after reviewing current maintenance
    and accessibility

### Backend and data

-   Supabase Postgres
-   Supabase Auth
-   Supabase Row Level Security (RLS)
-   Supabase Storage only if uploads are added
-   Server Actions or Route Handlers for mutations, with server-side
    authorization checks

### Hosting

-   Vercel for the Next.js app
-   Supabase for database/auth
-   GitHub for version control and deployment integration

## High-level request flow

1.  Browser requests a page.
2.  Next.js resolves the authenticated user on the server.
3.  Server and database policies verify ownership.
4.  Data is fetched for that user only.
5.  UI renders the selected view and user preferences.
6.  Mutations are validated on the server and enforced again by database
    policies.

## Suggested route structure

``` text
app/
  (public)/
    page.tsx
    login/page.tsx
    signup/page.tsx
  (app)/
    layout.tsx
    today/page.tsx
    tasks/page.tsx
    board/page.tsx
    checklists/page.tsx
    notes/page.tsx
    settings/page.tsx
  auth/
    callback/route.ts
  api/                 # only where a Route Handler is needed
components/
  app-shell/
  tasks/
  checklists/
  notes/
  views/
  settings/
lib/
  supabase/
  validation/
  auth/
  queries/
  actions/
types/
  database.ts
```

Treat this as a starting structure, not a rigid requirement.

## Design-system approach

Define tokens instead of hard-coding colors throughout the app: -
background and surface colors - primary text and muted text - borders -
accent color - status colors - spacing and radius scale - typography
scale

Store user preferences as data and map them to a controlled set of CSS
variables. Do not let arbitrary user input become raw CSS or HTML.

## Data access rules

-   Every user-owned record must have an owner or workspace
    relationship.
-   Verify identity server-side before mutations.
-   Use RLS for all user-owned tables.
-   Validate IDs and payloads on the server.
-   Do not trust hidden UI controls as authorization.
-   Never put the Supabase service-role key in browser code.
-   Prefer typed query helpers and centralized validation.

## Testing

-   Unit tests for validation and pure helpers.
-   Integration tests for task/checklist data access.
-   End-to-end tests for signup, CRUD, filters, and view switching.
-   Explicit tests proving user A cannot read or mutate user B's
    records.

## Important implementation note

Vercel hosts the web app, but persistent data should live in a database
such as Supabase. Do not rely on local browser storage as the only
database if users need accounts and cross-device sync. Local storage is
suitable for non-sensitive UI preferences or temporary drafts.
