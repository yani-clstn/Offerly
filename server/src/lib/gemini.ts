import { GoogleGenAI } from '@google/genai'

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export const matchScoreSchema = {
  type: 'object',
  properties: {
    score: { type: 'integer', description: 'Fit score 0-100' },
    matchingSkills: { type: 'array', items: { type: 'string' } },
    missingSkills: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string', description: 'One or two sentence summary of fit' },
  },
  required: ['score', 'matchingSkills', 'missingSkills', 'summary'],
}