import type { Application } from '../types/application'

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/applications`

export async function getApplications(): Promise<Application[]> {
  const res = await fetch(BASE_URL, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch applications')
  return res.json()
}

export async function getApplication(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch application')
  return res.json()
}

export async function createApplication(data: Partial<Application>) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create application')
  return res.json()
}

export async function updateApplication(id: number, data: Partial<Application>): Promise<Application> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update application')
  return res.json()
}

export async function updateApplicationStatus(id: number, status: string, note?: string) {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status, note }),
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

export async function updateFollowUpDate(id: number, followUpDate: string | null) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ followUpDate }),
  })
  if (!res.ok) throw new Error('Failed to update follow-up date')
  return res.json()
}

export async function addNote(applicationId: number, content: string) {
  const res = await fetch(`${BASE_URL}/${applicationId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('Failed to add note')
  return res.json()
}

export async function addDocument(applicationId: number, data: { type: string; label: string; url: string }) {
  const res = await fetch(`${BASE_URL}/${applicationId}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to add document')
  return res.json()
}

export interface StageDuration {
  status: string
  avgDays: number
  count: number
}

export async function getStageDurations(): Promise<StageDuration[]> {
  const res = await fetch(`${BASE_URL}/analytics/stage-durations`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}