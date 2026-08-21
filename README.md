# Offerly | Your Job Application Tracker

A full-stack job application tracker designed to replace the spreadsheet chaos of a modern job search. Offerly tracks applications through an end-to-end status pipeline, records timestamped history for every transition, stores notes and external document links, provides interactive Kanban drag-and-drop workflows, and offers stage-duration analytics—all backed by a multi-tenant relational schema.

---

## Why I Built This

Tracking job applications across spreadsheets often leads to untracked follow-ups, lost interview prep notes, and confusion over which resume version was submitted where. Offerly provides a dedicated, purpose-built workspace to manage the entire application lifecycle while demonstrating full-stack TypeScript engineering: relational schema design, RESTful API development, session-based authentication, and responsive frontend interface design.

---

## Features

- **Status pipeline** — track applications through `wishlist → applied → phone screen → interview → offer → accepted / rejected / withdrawn`
- **Status history timeline** — every status change is logged with a timestamp, not just overwritten, so you can see the full journey of each application.
- **Notes** — attach multiple timestamped notes to any application (interview prep, follow-up thoughts, etc.)
- **Document tracking** — link resume/cover letter versions (as external URLs, e.g. Google Drive) to specific applications
- **Filtering & search** *(in progress)*
- **Kanban board view** - drag and drop existing applications

## Tech Stack

**Frontend**
- Framework: React 18+ with TypeScript
- Routing: React Router (react-router-dom)
- Styling & Design System: Tailwind CSS with custom CSS variables (--cream, --offwhite, --navy, --terracotta, --border) supporting theme-aware light/dark modes
- Drag-and-Drop: @hello-pangea/dnd (for interactive Kanban board column updates)
- Build Tool & Hosting: Vite, deployed on Vercel

**Backend**
- Server Framework: Hono (Node.js / Edge-ready TypeScript API)
- Database & ORM: PostgreSQL hosted on Neon, managed via Drizzle ORM
- Authentication: Better Auth (session-based authentication with scoped database queries)

**Development & Tooling**
- Type Safety: Full-stack TypeScript (strict mode enabled with verbatimModuleSyntax)
- Version Control: Git & GitHub (feature-branch deployment workflow)

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
