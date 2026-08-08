import type { Application } from '../types/application'

const BASE_URL = 'http://localhost:3000/api/applications'

export async function getApplications(): Promise<Application[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch applications')
  return res.json()
}

export async function getApplication(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch application')
  return res.json()
}

export async function createApplication(data: Partial<Application>) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create application')
  return res.json()
}