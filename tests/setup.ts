import { beforeAll, vi } from 'vitest'

// Mock fetch globally
beforeAll(() => {
  global.fetch = vi.fn()
})

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_API_URL: 'http://localhost:5000',
  NODE_ENV: 'test'
}))