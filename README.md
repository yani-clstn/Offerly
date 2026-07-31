# UNDER DEVELOPMENT
# Offerly

A job application tracker built to replace the spreadsheet chaos of a real job search. Offerly tracks applications through a full status pipeline, logs every status change with a timestamped history, and keeps notes and resume/cover letter versions linked to each application — all backed by a proper relational schema instead of flat spreadsheet-style data.

## Why I am building this

Like most CS students and job seekers, chaos is tracking job applications in a spreadsheet — and losing track of follow-ups, interview stages, and which resume version I'd sent where. Offerly is my attempt to build the tool I actually needed, while getting hands-on practice with a modern full-stack TypeScript setup end to end: schema design, REST API design, and a real frontend consuming it.

## Features

- **Status pipeline** — track applications through `wishlist → applied → phone screen → interview → offer → accepted / rejected / withdrawn`
- **Status history timeline** — every status change is logged with a timestamp, not just overwritten, so you can see the full journey of each application.
- **Notes** — attach multiple timestamped notes to any application (interview prep, follow-up thoughts, etc.)
- **Document tracking** — link resume/cover letter versions (as external URLs, e.g. Google Drive) to specific applications
- **Filtering & search** *(in progress)*
- **Kanban board view** *(planned)*

## Tech Stack

**Frontend**
- React + Vite
- TypeScript
- React Router DOM
- Tailwind CSS v4

**Backend**
- Hono (lightweight TypeScript web framework)
- Drizzle ORM
- Neon (serverless PostgreSQL)
- REST API

## Database Schema

Offerly uses four related tables:

- **`applications`** — core application data (company, role, status, salary range, work type, etc.)
- **`status_history`** — every status transition, timestamped, linked to an application
- **`notes`** — freeform timestamped notes, linked to an application
- **`documents`** — resume/cover letter versions (external links), linked to an application

Status changes are logged separately from the main record rather than overwritten, which makes it possible to answer questions like "how long did this application sit in 'interview' before I heard back?"

## Getting Started

### Prerequisites
- Node.js (v22 or higher recommended)
- A free [Neon](https://neon.tech) account for the database

### Setup

Install dependencies for both apps
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
Set up environment variables

   In `server/`, create a `.env` file based on `.env.example`:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
Push the database schema to Neon
   ```bash
   cd server
   npm run db:push
   ```

Run the apps (in separate terminals)
   ```bash
   # Terminal 1 — backend
   cd server
   npm run dev

   # Terminal 2 — frontend
   cd client
   npm run dev
   ```

Open `http://localhost:5173` in your browser

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List all applications |
| GET | `/api/applications/:id` | Get one application with notes, documents, and status history |
| POST | `/api/applications` | Create a new application |
| PATCH | `/api/applications/:id` | Update application fields |
| PATCH | `/api/applications/:id/status` | Update status (logs to status history) |
| DELETE | `/api/applications/:id` | Delete an application |

## Roadmap

- [ ] Notes and documents API endpoints
- [ ] Frontend application list & detail views
- [ ] Kanban board with drag-and-drop status updates
- [ ] Filtering and search
- [ ] Deadline reminders
- [ ] Authentication (multi-user support)


