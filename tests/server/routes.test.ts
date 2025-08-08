import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express, { type Express } from 'express'
import { registerRoutes } from '../../server/routes'

// Mock storage - move to top level
vi.mock('../../server/storage', () => {
  const mockStorage = {
    getUserPreferences: vi.fn(),
    createUserPreferences: vi.fn(),
    updateUserPreferences: vi.fn(),
    getLatestAnalytics: vi.fn(),
    createAnalytics: vi.fn(),
    updateAnalytics: vi.fn(),
    getTeasers: vi.fn(),
    createTeaser: vi.fn(),
    getActivities: vi.fn(),
    createActivity: vi.fn(),
    getUserTeasers: vi.fn(),
    getUserActivities: vi.fn(),
    updateUserTinderToken: vi.fn(),
  }
  
  return { storage: mockStorage }
})

// Get the mocked storage instance
const mockStorageModule = await import('../../server/storage')
const mockStorage = mockStorageModule.storage as any

describe('API Routes', () => {
  let app: Express
  let server: any

  beforeEach(async () => {
    vi.clearAllMocks()
    app = express()
    app.use(express.json())
    server = await registerRoutes(app)
  })

  describe('GET /api/preferences/:userId', () => {
    it('should return existing user preferences', async () => {
      const mockPreferences = {
        id: 'pref1',
        userId: 'user1',
        autoSwipeEnabled: true,
        dailyLimit: 100
      }

      mockStorage.getUserPreferences.mockResolvedValue(mockPreferences)

      const response = await request(app)
        .get('/api/preferences/user1')
        .expect(200)

      expect(response.body).toEqual(mockPreferences)
      expect(mockStorage.getUserPreferences).toHaveBeenCalledWith('user1')
    })

    it('should create default preferences if none exist', async () => {
      const defaultPrefs = {
        id: 'pref1',
        userId: 'user1',
        autoSwipeEnabled: false,
        dailyLimit: 50,
        swipeInterval: 3,
        ageMin: 22,
        ageMax: 35,
        verifiedOnly: false,
        photoQuality: false,
        bioRequired: false,
      }

      mockStorage.getUserPreferences.mockResolvedValue(null)
      mockStorage.createUserPreferences.mockResolvedValue(defaultPrefs)

      const response = await request(app)
        .get('/api/preferences/user1')
        .expect(200)

      expect(response.body).toEqual(defaultPrefs)
      expect(mockStorage.createUserPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          autoSwipeEnabled: false,
          dailyLimit: 50
        })
      )
    })

    it('should handle storage errors', async () => {
      mockStorage.getUserPreferences.mockRejectedValue(new Error('Database error'))

      await request(app)
        .get('/api/preferences/user1')
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toBe('Failed to get user preferences')
        })
    })
  })

  describe('PATCH /api/preferences/:userId', () => {
    it('should update user preferences successfully', async () => {
      const updateData = {
        autoSwipeEnabled: true,
        dailyLimit: 100
      }
      const updatedPrefs = {
        id: 'pref1',
        userId: 'user1',
        ...updateData
      }

      mockStorage.updateUserPreferences.mockResolvedValue(updatedPrefs)

      const response = await request(app)
        .patch('/api/preferences/user1')
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual(updatedPrefs)
      expect(mockStorage.updateUserPreferences).toHaveBeenCalledWith('user1', updateData)
    })

    it('should return 404 if preferences not found', async () => {
      mockStorage.updateUserPreferences.mockResolvedValue(null)

      await request(app)
        .patch('/api/preferences/user1')
        .send({ dailyLimit: 100 })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('User preferences not found')
        })
    })

    it('should validate request body', async () => {
      await request(app)
        .patch('/api/preferences/user1')
        .send({ invalidField: 'invalid' })
        .expect(400)
    })
  })

  describe('GET /api/analytics/:userId', () => {
    it('should return existing analytics', async () => {
      const mockAnalytics = {
        id: 'analytics1',
        userId: 'user1',
        matches: 50,
        profileViews: 1000,
        swipes: 200,
        matchRate: 2500,
        profileScore: 85
      }

      mockStorage.getLatestAnalytics.mockResolvedValue(mockAnalytics)

      const response = await request(app)
        .get('/api/analytics/user1')
        .expect(200)

      expect(response.body).toEqual(mockAnalytics)
      expect(mockStorage.getLatestAnalytics).toHaveBeenCalledWith('user1')
    })

    it('should create default analytics if none exist', async () => {
      const defaultAnalytics = {
        id: 'analytics1',
        userId: 'user1',
        matches: 1247,
        profileViews: 8932,
        swipes: 5067,
        matchRate: 2460,
        profileScore: 92
      }

      mockStorage.getLatestAnalytics.mockResolvedValue(null)
      mockStorage.createAnalytics.mockResolvedValue(defaultAnalytics)

      const response = await request(app)
        .get('/api/analytics/user1')
        .expect(200)

      expect(response.body).toEqual(defaultAnalytics)
      expect(mockStorage.createAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          matches: 1247
        })
      )
    })
  })

  describe('GET /api/teasers/:userId', () => {
    it('should return user teasers', async () => {
      const mockTeasers = [
        {
          id: 'teaser1',
          userId: 'user1',
          teaserData: { user: { name: 'Test User' } },
          isUnblurred: false
        }
      ]

      mockStorage.getTeasers.mockResolvedValue(mockTeasers)

      const response = await request(app)
        .get('/api/teasers/user1')
        .expect(200)

      expect(response.body).toEqual(mockTeasers)
      expect(mockStorage.getTeasers).toHaveBeenCalledWith('user1')
    })

    it('should return empty array if no teasers', async () => {
      mockStorage.getTeasers.mockResolvedValue([])

      const response = await request(app)
        .get('/api/teasers/user1')
        .expect(200)

      expect(response.body).toEqual([])
    })
  })

  describe('GET /api/activities/:userId', () => {
    it('should return user activities', async () => {
      const mockActivities = [
        {
          id: 'activity1',
          userId: 'user1',
          type: 'match',
          title: 'New Match!',
          description: 'You matched with Sarah',
          icon: 'heart'
        }
      ]

      mockStorage.getActivities.mockResolvedValue(mockActivities)

      const response = await request(app)
        .get('/api/activities/user1')
        .expect(200)

      expect(response.body).toEqual(mockActivities)
      expect(mockStorage.getActivities).toHaveBeenCalledWith('user1')
    })
  })

  describe('Error handling', () => {
    it('should handle malformed JSON', async () => {
      await request(app)
        .patch('/api/preferences/user1')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400)
    })

    it('should handle missing parameters', async () => {
      await request(app)
        .get('/api/preferences/')
        .expect(404)
    })
  })
})