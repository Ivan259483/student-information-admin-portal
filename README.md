# student-information-admin-portal

Admin portal of EduTrack SIS (React + TypeScript + Axios). Students use the EduTrack student portal; both share the EduTrack Express/MongoDB API.

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

## Backend connection (EduTrack SIS)

This portal is the administrator side of **EduTrack SIS** (`~/Desktop/edutrack-sis`). It signs in and
stores every record through the EduTrack Express/MongoDB REST API. See `edutrack-sis/README.md` for the
full setup (MongoDB, seeding, running all three apps).

- Runs on http://localhost:5174 (`strictPort`). The API defaults to `http://localhost:5001/api`;
  override with `VITE_API_URL` / `VITE_STUDENT_PORTAL_URL` (see `.env.example`).
- **Login**: `/login` posts to `/api/auth/login` (admin accounts only) and keeps the JWT in
  `localStorage` (`edutrack_admin_token`). Admins who sign in on the EduTrack login page are handed
  over with `#token=…`, which is validated with `/api/auth/me` and removed from the address bar.
  A 401 from the API ends the session.
- **Data**: after login, `GET /api/admin/bootstrap` loads all records. Pages keep using the same store
  (`useAdminCollection`), so validation in `src/data/transitions.ts` still runs first; each committed
  change is then translated into REST calls (`src/data/sync.ts`: POST new, PUT changed, DELETE removed)
  and sent in order. If the server rejects a change, a toast explains why and the data reloads from the
  server. Records refresh every 20 s and on window focus so new student enrollments/tickets appear.
- The server enforces the same business rules, so the database stays consistent with either portal.
- `src/data/repository.ts` (localStorage) is still used by the tests as an offline repository.

## Architecture

```text
src/auth/                JWT session (EduTrack API), login page and route guard
src/lib/api.ts           Axios instance, token storage, API error messages
src/data/remote.tsx      Loads records from the API and syncs committed changes
src/data/sync.ts         State diff -> REST requests
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

See [ADMIN_STABILIZATION_REPORT.md](ADMIN_STABILIZATION_REPORT.md) for changes, checks, dependency findings, and verification limits.
