# student-information-admin-portal

Admin-only React/TypeScript portal. The existing visual system and eight Admin pages are retained. No Student Portal is implemented.

## Run and verify

Use Node.js 24 LTS or a newer supported Node release (verified here on Node 26.5).

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
npm audit
npm audit --omit=dev
```

`npm run build` creates `dist/`. Production hosting must serve `index.html` for non-asset Admin routes so direct navigation and refresh work. Test the deployment's rewrite configuration separately; Vite's local fallback is not proof of a host's configuration.

## Demo data and session

- Use sample data only. This is a local demonstration, **not production authentication or a secure student-record system**.
- `src/data/store.tsx` owns all shared records. Pages retain only transient filters, selection, and form drafts.
- `src/data/repository.ts` stores a validated, versioned envelope under `university-admin:v1`. Replace this repository for the shared database phase.
- Writes are validated and persisted before the UI commits them. Read/write failures are visible. Corrupt storage is preserved; stale-tab writes are rejected with a reload prompt. This is not a multi-user database transaction system.
- The initial sample dataset is loaded only when there is no saved envelope. Browser origin/port matters: different ports have separate saved data. Tests use isolated storage/origins.
- “End demo session” ends only the tab's demo session. It does not authenticate users, revoke credentials, or erase local records. The profile explains this explicitly.
- Back up the existing localStorage entry through browser developer tools before any manual reset/recovery. Do not clear live records casually. Student CSV exports are not a full database backup.

## Architecture

```text
src/auth/                Isolated demo-session provider and route guard
src/data/schema.ts       Persisted record validation
src/data/transitions.ts  Seed data and shared mutation rules
src/data/repository.ts   Replaceable local persistence boundary
src/data/context.ts      Shared data hooks/interface
src/data/store.tsx       Persist-first updates, activity, notifications
src/lib/domain.ts        Grades, GPA, enrollment, schedules, CSV, dates
src/lib/search.ts        Cross-record search/deep links
src/pages/               Eight lazy-loaded Admin routes plus 404
src/components/shared/   Reused forms, print layout, state components
src/test/                Domain, persistence, routing and workflow tests
```

Students with enrollment/grade/support history cannot be hard-deleted: update their status to preserve referential integrity. Unlinked students can be deleted after confirmation. CSV includes all rows matching the current filters, across pagination, not only the visible page.

Settings describe the current working academic period. Existing grade records retain their own historical period, which is shown on transcripts. Enrollment and schedule samples represent the current working dataset; multi-year enrollment/schedule history is deferred to the database schema phase.

## Authentication/database phase

Supabase is installed but no client, project configuration, keys, auth session, role policy, or database is configured. No environment variables are read today, so there is intentionally no `.env.example` with invented values.

When that phase is explicitly authorized:

1. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or the project's legacy public anon-key variable if required). These are proposed future configuration names, not currently consumed variables.
2. Create a genuine session adapter and server-authoritative Admin role checks. Replace the demo guard. Enforce database Row Level Security and least-privilege access.
3. Replace local persistence with an asynchronous database repository, transactions, concurrency controls, migrations, audit retention, and loading/error handling.
4. Enforce the same domain rules on the server. Model academic periods and historical relationships explicitly.
5. Connect incoming enrollment/ticket events, notification delivery and shared records. Currently preferences govern local record events; there are no email/push/student-facing services.

Never expose a Supabase service-role/secret key in a `VITE_*` variable or frontend source. `.env`, `.env.*`, and local environment files are ignored. Production authentication/database work and Student Portal work are not part of this stabilization.

See [ADMIN_STABILIZATION_REPORT.md](ADMIN_STABILIZATION_REPORT.md) for changes, checks, dependency findings, and verification limits.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-2p1re8q2)
