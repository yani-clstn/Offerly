# Offerly — AI Handoff Doc

## Overview
Job application tracker. Full-stack portfolio project. Status pipeline + timestamped status history + notes + documents + auth (multi-user) + analytics.

## Stack
- Frontend: React + Vite + TypeScript + React Router DOM + Tailwind CSS v4
- Backend: Hono + TypeScript
- DB: Neon (serverless Postgres) + Drizzle ORM
- Auth: Better Auth (email/password)
- Deploy: Vercel (two separate projects — frontend and backend)

## Repo structure
```
offerly/
├── client/          # Vite React app
│   └── src/
│       ├── api/applications.ts       # all fetch calls, credentials: 'include' required
│       ├── lib/auth-client.ts        # Better Auth client
│       ├── lib/theme.ts              # dark mode helper
│       ├── components/               # ApplicationCard, StatusUpdater, StatsBar, FilterBar,
│       │                               NoteForm, DocumentForm, FollowUpPicker, ThemeToggle,
│       │                               ProtectedRoute, layout/AppShell
│       ├── pages/                    # Dashboard, ApplicationDetail, NewApplication,
│       │                               Login, Signup, Analytics
│       └── types/application.ts
├── server/
│   ├── api/index.ts                  # Vercel entry — MUST be plain `export default app`,
│   │                                    NOT wrapped in handle() — see Known Issues
│   ├── vercel.json                   # NOT currently present — removed, zero-config used instead
│   └── src/
│       ├── app.ts                    # Hono app, all routes mounted, CORS, auth handler
│       ├── index.ts                  # local dev entry only (calls serve())
│       ├── types.ts                  # Hono Variables type (user on context)
│       ├── lib/auth.ts               # Better Auth config
│       ├── middleware/auth.ts        # requireAuth middleware
│       ├── db/schema.ts              # Drizzle schema — applications, status_history, notes,
│       │                               documents, user, session, account, verification
│       ├── db/index.ts               # Drizzle + Neon connection
│       └── routes/                   # applications.ts, notes.ts, documents.ts, analytics.ts
```

## Deployed URLs
- Frontend: https://offerly-job-tracker.vercel.app
- Backend: https://offerly-server.vercel.app
- These are TWO SEPARATE Vercel projects, not subdomains of one project — cross-domain, not same-site.

## Env vars
**server/.env (local) + Vercel backend project env vars:**
- `DATABASE_URL` — Neon connection string
- `BETTER_AUTH_SECRET` — random 32-byte hex, same value local + prod
- `BETTER_AUTH_URL` — backend's own URL (prod), unset/localhost for local dev

**client/.env / client/.env.production:**
- `VITE_API_URL` — backend URL (local: http://localhost:3000, prod: https://offerly-server.vercel.app)

## Known issues / hard-won fixes (don't redo this pain)
1. **TypeScript 7.x has a compiler bug on Vercel builds** — "Cannot read properties of undefined (reading 'readFile')". Server pinned to `typescript: ^5.7.2` in devDependencies. Do not upgrade without testing a Vercel deploy first.
2. **server/package.json has NO `build` script.** Do not add one. A `tsc` build step breaks Vercel's zero-config Hono detection (produces `.js` output missing `.js` extensions on relative imports → `ERR_MODULE_NOT_FOUND` / `ERR_UNSUPPORTED_DIR_IMPORT` at runtime).
3. **server/api/index.ts must be a plain Hono export**, not wrapped in `handle()` from `hono/vercel`:
   ```ts
   import app from '../src/app.js'
   export default app
   ```
   Vercel's official zero-config Hono support auto-detects this shape. The `handle()` adapter caused Edge/Node runtime signature mismatches (function hangs, times out at 504) when tried.
4. **All relative imports in server/src/** use explicit `.js` extensions (e.g. `from './lib/auth.js'`) even though source files are `.ts`. Required for Node ESM resolution in the deployed function. Directory imports (`from '../db'`) must point at `index.js` explicitly (`from '../db/index.js'`) — Node doesn't resolve directory imports automatically.
5. **Cross-domain cookies**: frontend and backend are different domains (not subdomains), so Better Auth cookies need `sameSite: 'none', secure: true, partitioned: true` in production, but `lax`/non-secure for local http dev. Handled via `NODE_ENV` check in `server/src/lib/auth.ts`. If auth session stops persisting after login, check this first.
6. CORS `origin` list and Better Auth `trustedOrigins` must both list the exact frontend URL (no trailing slash, exact scheme). Both live in `server/src/app.ts` and `server/src/lib/auth.ts`.

## Data model notes
- `applications.userId` scopes every row to its owner. Every query in `routes/applications.ts` filters by `userId` — this is the actual multi-tenancy boundary.
- `notes`/`documents` are scoped only via their parent `applicationId`, not independently re-checked against `userId` in those routes — acceptable simplification for portfolio scope, flagged as a known gap (not hardened against someone guessing another user's `applicationId` directly against notes/documents endpoints).
- `status_history` logs every transition with timestamp — this is what powers the Analytics page (avg days per stage = time between consecutive history entries; current/ongoing stage excluded from averages since it has no end time).

## Design system
Palette: `#F0EFEC` (cream), `#FAF9F6` (offwhite), `#152536` (navy), `#808080` (gray), `#DF864B` (terracotta accent). Dark mode via CSS custom properties + `.dark` class on `<html>`, toggled/persisted via `client/src/lib/theme.ts` + localStorage. Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (status log timestamps), Playfair Display italic (personalized greeting name on Dashboard).

## Features implemented
Full CRUD applications, status pipeline with history log, notes, documents (external URL links), filtering + sorting on dashboard, custom status dropdown UI, auth (signup/login/logout, protected routes), follow-up date/time reminders (manual + auto-stale-after-7-days flag), dark mode, stage-duration analytics page, kanban board (drag-and-drop status columns), search by company/role text

## Not yet built (from original roadmap)
- Responsive/mobile layout check — never verified
- README is stale — written before auth, filtering, documents, dark mode, analytics existed

## Suggested next steps
1. Test analytics with real data (move an app through 2-3 statuses with time gaps)
2. Responsive check
3. README rewrite to match current feature set
4. Consider hardening notes/documents routes with userId check (see Data model notes)