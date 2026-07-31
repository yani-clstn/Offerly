import { pgTable, serial, text, varchar, timestamp, pgEnum, integer, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const statusEnum = pgEnum('status', [
  'wishlist',
  'applied',
  'phone_screen',
  'interview',
  'offer',
  'accepted',
  'rejected',
  'withdrawn',
])

export const workTypeEnum = pgEnum('work_type', ['remote', 'hybrid', 'onsite'])

export const documentTypeEnum = pgEnum('document_type', ['resume', 'cover_letter', 'other'])

// Applications table
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  jobPostingUrl: text('job_posting_url'),
  location: varchar('location', { length: 255 }),
  workType: workTypeEnum('work_type'),
  salaryMin: decimal('salary_min', { precision: 10, scale: 2 }),
  salaryMax: decimal('salary_max', { precision: 10, scale: 2 }),
  status: statusEnum('status').notNull().default('wishlist'),
  source: varchar('source', { length: 100 }), // e.g. "LinkedIn", "Referral"
  appliedAt: timestamp('applied_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Status history table — logs every transition
export const statusHistory = pgTable('status_history', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  status: statusEnum('status').notNull(),
  note: text('note'),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
})

// Notes table
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Documents table
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  type: documentTypeEnum('type').notNull(),
  label: varchar('label', { length: 255 }).notNull(), // e.g. "Resume v3 - Backend focus"
  url: text('url').notNull(), // Google Drive link, etc.
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
})

// Relations (for query joins later)
export const applicationsRelations = relations(applications, ({ many }) => ({
  statusHistory: many(statusHistory),
  notes: many(notes),
  documents: many(documents),
}))

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  application: one(applications, {
    fields: [statusHistory.applicationId],
    references: [applications.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  application: one(applications, {
    fields: [notes.applicationId],
    references: [applications.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(applications, {
    fields: [documents.applicationId],
    references: [applications.id],
  }),
}))