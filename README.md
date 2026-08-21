# Offerly | Your Job Application Tracker

A full-stack job application tracker designed to replace the spreadsheet chaos of a modern job search. Offerly tracks applications through an end-to-end status pipeline, records timestamped history for every transition, stores notes and external document links, provides interactive Kanban drag-and-drop workflows, and offers stage-duration analytics—all backed by a multi-tenant relational schema.

---

## Why I Built This

Tracking job applications across spreadsheets often leads to untracked follow-ups, lost interview prep notes, and confusion over which resume version was submitted where. Offerly provides a dedicated, purpose-built workspace to manage the entire application lifecycle while demonstrating full-stack TypeScript engineering: relational schema design, RESTful API development, session-based authentication, and responsive frontend interface design.

---

## Features

- **Multi-Tenant Authentication** — Secure user registration and login with session management, ensuring complete data isolation per user.
- **Status Pipeline & History** — Track applications across statuses (`wishlist` → `applied` → `phone_screen` → `interview` → `offer` → `accepted` / `rejected` / `withdrawn`). Every status transition creates an immutable, timestamped record.
- **Interactive Kanban Board** — Drag-and-drop support across status columns for fast pipeline updates.
- **Filtering, Sorting & Text Search** — Instant client-side text searching (by company or role), multi-attribute filtering, and custom sorting.
- **Notes & External Documents** — Attach timestamped notes and link external documents (e.g., Google Drive links for tailored resumes or cover letters).
- **Follow-Up Reminders** — Set follow-up timestamps with automated flags for stale applications lacking recent activity.
- **Stage-Duration Analytics** — Visual analytics calculating average days spent in each pipeline stage based on historical transition timestamps.
- **Location & Distance Calculation** — Geocoding and road-distance calculations using OpenStreetMap (Nominatim) and OSRM to track job location distance in kilometers.
- **Dark Mode Support** — Theme-aware interface with persistent dark/light mode toggle.

---

## Tech Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM (`react-router-dom`)
- **Styling:** Tailwind CSS v4 with custom CSS variable tokens (`--cream`, `--offwhite`, `--navy`, `--terracotta`, `--border`) supporting theme toggling
- **Drag-and-Drop:** `@hello-pangea/dnd`
- **Deployment:** Vercel

### Backend
- **Framework:** Hono (Node.js / Edge-ready TypeScript API)
- **Database & ORM:** PostgreSQL on Neon managed via Drizzle ORM
- **Authentication:** Better Auth (session-based authentication with scoped database queries)
- **Geocoding & Routing APIs:** OpenStreetMap (Nominatim) & OSRM (Open Source Routing Machine)
- **Deployment:** Vercel (Serverless Functions)

---

## Database Schema

Offerly operates on a multi-tenant relational schema:

- **`user`**, **`session`**, **`account`**, **`verification`** — Auth and user identity management handled via Better Auth.
- **`applications`** — Core record containing company, role, status, salary range, employment type (`full_time`, `part_time`, `contract`, `temporary`, `internship`), work model (`onsite`, `remote`, `hybrid`), location, distance (`distanceKm`), follow-up date, and owner reference (`userId`).
- **`status_history`** — Immutable status transition logs with timestamps, powering pipeline duration calculations.
- **`notes`** — Timestamped notes linked to parent application records.
- **`documents`** — Named document records linking external URLs (resumes, cover letters, portfolios).

---

## Getting Started

### Prerequisites
- Node.js (v22 or higher)
- A [Neon](https://neon.tech) PostgreSQL database instance

### Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   git clone [https://github.com/your-username/offerly.git](https://github.com/your-username/offerly.git)
   cd offerly

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install

```

2. **Configure Environment Variables:**
In `server/.env`:
```env
DATABASE_URL=postgres://user:password@endpoint.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your_32_byte_hex_secret
BETTER_AUTH_URL=http://localhost:3000

```


In `client/.env`:
```env
VITE_API_URL=http://localhost:3000

```


3. **Push Database Schema:**
```bash
cd server
npm run db:push

```


4. **Start Development Servers:**
```bash
# Terminal 1 — Backend API
cd server
npm run dev

# Terminal 2 — Frontend App
cd client
npm run dev

```


Open `http://localhost:5173` in your browser.

---

## API Reference

All application endpoints are authenticated and scoped to the active session user.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/*` | Better Auth authentication routes (login, signup, session, logout) |
| `GET` | `/api/applications` | List user applications (supports search, filter, and sorting params) |
| `POST` | `/api/applications` | Create a new application record |
| `GET` | `/api/applications/:id` | Get application details, including status history, notes, and documents |
| `PATCH` | `/api/applications/:id` | Update application details (e.g., job details, follow-up date, distance) |
| `PATCH` | `/api/applications/:id/status` | Transition status and append a new `status_history` record |
| `DELETE` | `/api/applications/:id` | Delete an application record and cascaded relations |
| `GET` | `/api/notes?applicationId=:id` | Fetch notes for a given application |
| `POST` | `/api/notes` | Create a note linked to an application |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `GET` | `/api/documents?applicationId=:id` | Fetch external document links for an application |
| `POST` | `/api/documents` | Link a document URL to an application |
| `DELETE` | `/api/documents/:id` | Remove a document link |
| `GET` | `/api/analytics` | Retrieve stage-duration metrics and pipeline conversion stats |

---

## Roadmap

* [x] Multi-user authentication & data isolation
* [x] Kanban board with drag-and-drop status updates
* [x] Notes and external documents attachments
* [x] Search, filtering, and custom sorting
* [x] Stage-duration analytics dashboard
* [x] Geographic distance calculation for jobs
* [ ] Automated email/calendar notifications for follow-up reminders
* [ ] Export application history to CSV / JSON
