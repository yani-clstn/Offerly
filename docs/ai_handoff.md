# Offerly — AI Handoff Doc

## Overview
Full-stack job application tracking platform. Features multi-tenant authentication, pipeline status history tracking, interactive Kanban board, attached notes/documents, distance calculation, theme toggling, and stage-duration analytics.

## Stack
- **Frontend:** React + Vite + TypeScript + React Router DOM + Tailwind CSS v4 + `@hello-pangea/dnd`
- **Backend:** Hono + TypeScript (Node.js runtime on local, Vercel Serverless in prod)
- **DB & ORM:** Neon (serverless Postgres) + Drizzle ORM
- **Auth:** Better Auth (session cookie-based authentication)
- **Deploy:** Vercel (two separate Vercel projects: `offerly-job-tracker` frontend and `offerly-server` backend)

## Directory Structure

```

offerly/
├── client/                      # Vite React frontend
│   └── src/
│       ├── api/
│       │   ├── applications.ts  # Application API client (credentials: 'include')
│       │   ├── notes.ts         # Notes API endpoints
│       │   ├── documents.ts     # External document links API endpoints
│       │   └── analytics.ts     # Analytics API client
│       ├── lib/
│       │   ├── auth-client.ts   # Better Auth client instance
│       │   └── theme.ts         # Theme/dark mode toggle manager
│       ├── components/          # ApplicationCard, StatusUpdater, StatsBar, FilterBar,
│       │                        # KanbanBoard, NoteForm, DocumentForm, FollowUpPicker,
│       │                        # ThemeToggle, ProtectedRoute, layout/AppShell
│       ├── pages/               # Dashboard, ApplicationDetail, NewApplication,
│       │                        # Login, Signup, Analytics
│       └── types/               # TypeScript interfaces (application.ts, analytics.ts, etc.)
└── server/                      # Hono backend API
├── api/
│   └── index.ts             # Vercel entry point — plain `export default app`
└── src/
├── app.ts               # Hono setup, route mounting, CORS, Better Auth handler
├── index.ts             # Local development entry point
├── types.ts             # Context type extensions (user context)
├── lib/
│   └── auth.ts          # Better Auth initialization & database binding
├── middleware/
│   └── auth.ts          # Session authentication guard
├── db/
│   ├── schema.ts        # Drizzle schema (applications, status_history, notes, documents, auth)
│   └── index.ts         # Neon Postgres connection client
└── routes/              # applications.ts, notes.ts, documents.ts, analytics.ts

```

## Deployed Environments
- **Frontend:** `https://offerly-job-tracker.vercel.app`
- **Backend:** `https://offerly-server.vercel.app`
- *Note:* Deployed as two distinct Vercel projects. Cross-domain CORS and cookie configuration apply.

## Environment Variables
**Backend (`server/.env` / Vercel Backend Project):**
- `DATABASE_URL` — Neon Postgres connection string
- `BETTER_AUTH_SECRET` — 32-byte secret key for session signatures
- `BETTER_AUTH_URL` — Backend public origin (production: `https://offerly-server.vercel.app`, dev: empty or `http://localhost:3000`)

**Frontend (`client/.env` / Vercel Frontend Project):**
- `VITE_API_URL` — Backend API base URL (`http://localhost:3000` in dev, `https://offerly-server.vercel.app` in prod)

## Critical Build & Configuration Constraints

1. **TypeScript Version Pinning:** Server is pinned to `typescript: ^5.7.2` in `devDependencies`. Upgrading to TypeScript 7.x causes Vercel build container failures (`Cannot read properties of undefined (reading 'readFile')`).
2. **No `build` script in `server/package.json`:** Vercel uses zero-config Hono detection. Running `tsc` outputs `.js` files that omit explicit `.js` extensions on relative imports, triggering `ERR_MODULE_NOT_FOUND` / `ERR_UNSUPPORTED_DIR_IMPORT` at runtime.
3. **Plain Export for `server/api/index.ts`:**
   ```ts
   import app from '../src/app.js'
   export default app

```

Do not wrap with `handle()` from `hono/vercel`.
4. **Explicit `.js` Relative Imports:** All relative imports in `server/src/` must specify explicit `.js` extensions (e.g., `from './lib/auth.js'`). Directory index files must be imported directly (`from '../db/index.js'`).
5. **Cross-Domain Session Cookies:** Better Auth cookies require `sameSite: 'none'`, `secure: true`, and `partitioned: true` in production environments, but `lax` / non-secure settings for local HTTP development. Handled via environment toggles in `server/src/lib/auth.ts`.
6. **Explicit Origin Matching:** Both CORS (`app.ts`) and `trustedOrigins` (`lib/auth.ts`) must explicitly list the frontend origin URL without trailing slashes.

## Data Model & Multi-Tenancy

* **`applications.userId`:** Primary multi-tenancy boundary. Every query in `routes/applications.ts` enforces `eq(applications.userId, user.id)`.
* **`status_history`:** Appends an entry on every status transition with a timestamp. Powers stage-duration metrics in the Analytics service (calculates time elapsed between consecutive stage logs; ongoing stages are excluded from completed averages).
* **`notes` & `documents`:** Linked to parent `applicationId`.

## Implemented Features

* Full CRUD for job applications with search, filtering, and custom sorting
* Interactive Kanban Board (`@hello-pangea/dnd`)
* Multi-user authentication via Better Auth (Signup, Login, Protected Routes)
* Immutable timestamped status transition logs
* Attached notes and external URL document links
* Geographic routing distance calculation using Nominatim geocoding and OSRM driving distance
* Follow-up date scheduling with stale status flags
* Stage-duration analytics calculation engine and UI
* Custom CSS variable-based dark/light theme switching

## Open Hardening / Next Engineering Steps

1. **Cascade Verification on Sub-Resources:** Harden `notes` and `documents` routes by verifying parent application ownership (`userId`) prior to executing mutations.
2. **Mobile Layout Polishing:** Further optimize Kanban and analytics table views for smaller mobile viewports.

