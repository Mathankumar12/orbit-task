# Security and Privacy Checklist

This app may store private tasks, routines, notes, and personal plans.
Treat the data as private by default.

## Authentication

-   Use a maintained authentication provider rather than implementing
    password storage yourself.
-   Protect authenticated routes on the server.
-   Validate authentication state for every data mutation.
-   Add account recovery and a clear account deletion path.
-   Consider email verification and abuse prevention before public
    launch.

## Authorization

-   Enable Supabase Row Level Security for all user-owned tables.
-   Enforce ownership in database policies, not only in the UI.
-   Test with two independent users.
-   Check nested records through their parent workspace.
-   Do not trust user-supplied workspace IDs, owner IDs, or role values.
-   Add explicit permissions before implementing workspace sharing.

## Secrets

-   Never commit `.env.local`, database passwords, or service-role keys.
-   Never expose privileged secrets to browser code.
-   Rotate any key accidentally committed or shared.
-   Use separate development and production projects where practical.

## Input and content

-   Validate every server action and API payload.
-   Enforce title and description length limits.
-   Sanitize Markdown/HTML if rendering untrusted content as HTML.
-   Avoid rendering user content with unsafe HTML injection.
-   Validate uploaded file types and sizes if file uploads are added.

## Data handling

-   Keep data private by default.
-   Provide a way to delete an account and its associated data.
-   Define backup/retention behavior.
-   Avoid logging task content, note content, tokens, or passwords.
-   Collect only the data needed for the product.
-   Publish a clear privacy policy before broad public use.

## Abuse and reliability

-   Consider rate limiting sign-up and expensive operations.
-   Add sensible database constraints and query limits.
-   Paginate large task lists.
-   Use server-side error messages that do not reveal secrets or
    internal details.
-   Monitor errors and unusual usage.
-   Review provider pricing/quotas before inviting a large audience.

## Release gate

Do not launch publicly until: - \[ \] RLS is enabled and tested on every
user-owned table. - \[ \] A user cannot read, edit, or delete another
user's data. - \[ \] Privileged keys are absent from client bundles and
repository history. - \[ \] Account deletion behavior is defined. - \[
\] Authentication redirects and recovery flows work.
