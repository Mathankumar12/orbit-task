# Deploy to Vercel

## Services

-   **Vercel:** builds and hosts the Next.js app.
-   **Supabase:** database and authentication.
-   **GitHub:** source control and deployment integration.

Free tiers and limits can change. Check the current pricing, usage
limits, and commercial-use terms for each provider before inviting many
users.

## Local development

1.  Install a current supported Node.js LTS release.
2.  Create the Next.js TypeScript project.
3.  Install the Supabase client and server-side helpers recommended by
    the current Supabase documentation.
4.  Create a Supabase project.
5.  Add local environment variables in `.env.local`.
6.  Run the development server and test sign-up, sign-in, and task CRUD.
7.  Keep `.env.local` out of version control.

Example environment variable names (use the exact names required by your
chosen Supabase SDK version):

``` text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only expose public client configuration to the browser. A service-role
key is privileged and must never use a `NEXT_PUBLIC_` prefix or be
imported into client components. If the application does not need
service-role access, do not configure it.

## GitHub and Vercel

1.  Push the code to a private or public GitHub repository.
2.  Sign in to Vercel and import the repository.
3.  Select the Next.js framework preset if it is not detected
    automatically.
4.  Add required environment variables in Vercel Project Settings.
5.  Deploy a preview build.
6.  Test authentication callbacks and database operations on the preview
    URL.
7.  Deploy to production after tests pass.
8.  Configure a custom domain if desired.

## Supabase configuration

-   Configure allowed site URLs and authentication redirect URLs for
    local development, preview, and production.
-   Use the exact deployed domain in production settings.
-   Apply database migrations in a controlled way.
-   Enable RLS on every user-owned table.
-   Test policies with at least two different accounts.
-   Never put database credentials in source code or public repository
    history.

## Can anyone use it?

Yes, if you deploy it publicly and allow new registrations. To make it
usable by other people: - Keep the landing page public. - Enable the
signup method you intend to support. - Add basic terms and a privacy
policy. - Apply rate limits or abuse controls where appropriate. -
Monitor database/storage usage and provider limits. - Ensure each
account's records are private by default.

A public deployment is not the same as a shared workspace. Each person
should have a separate private workspace unless you deliberately
implement sharing.

## Production checklist

-   [ ] Production environment variables set.
-   [ ] Authentication callback URLs verified.
-   [ ] Database migrations applied.
-   [ ] RLS policies tested.
-   [ ] No service keys in client bundles or Git history.
-   [ ] Signup and password recovery tested on the production domain.
-   [ ] Account deletion/data handling documented.
-   [ ] Error and usage monitoring reviewed.
-   [ ] Provider limits and billing alerts reviewed.
