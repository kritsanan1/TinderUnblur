import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TinderAPI } from '../../client/src/lib/tinder-api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('TinderAPI', () => {
  let tinderAPI: TinderAPI
  const mockToken = 'test-token-123'

  beforeEach(() => {
    vi.clearAllMocks()
    tinderAPI = new TinderAPI(mockToken, {
      appSessionId: 'test-app-session',
      persistentDeviceId: 'test-device-id',
      userSessionId: 'test-user-session'
    })
  })

  describe('constructor', () => {
    it('should initialize with provided token and options', () => {
      expect(tinderAPI).toBeDefined()
    })

    it('should generate UUIDs when options not provided', () => {
      const api = new TinderAPI('token')
      expect(api).toBeDefined()
    })
  })

  describe('fetchTeasers', () => {
    it('should fetch teasers successfully', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'user123',
                name: 'Test User',
                photos: []
              }
            }
          ]
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.fetchTeasers()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/fast-match/teasers',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken,
            'platform': 'web',
            'Accept': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when API request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      await expect(tinderAPI.fetchTeasers()).rejects.toThrow('Tinder API error: 401 Unauthorized')
    })
  })

  describe('getProfile', () => {
    it('should fetch profile successfully', async () => {
      const mockProfile = {
        _id: 'user123',
        name: 'Test User',
        bio: 'Test bio',
        photos: []
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile)
      })

      const result = await tinderAPI.getProfile()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/profile',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken
          })
        })
      )
      expect(result).toEqual(mockProfile)
    })
  })

  describe('swipe', () => {
    it('should perform like swipe successfully', async () => {
      const mockResponse = {
        match: false,
        likes_remaining: 99
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.swipe('user123', 'like')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/like/user123?locale=en',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should perform pass swipe successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await tinderAPI.swipe('user123', 'pass')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/pass/user123?locale=en',
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  describe('getRecommendations', () => {
    it('should fetch recommendations successfully', async () => {
      const mockRecommendations = {
        meta: { status: 200 },
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'user123',
                name: 'Test User',
                photos: []
              }
            }
          ]
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations)
      })

      const result = await tinderAPI.getRecommendations()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/recs/core?locale=en',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken
          })
        })
      )
      expect(result).toEqual(mockRecommendations)
    })
  })

  describe('superLike', () => {
    it('should perform super like successfully', async () => {
      const mockResponse = {
        match: true,
        super_likes: {
          remaining: 2,
          alc_remaining: 0,
          new_alc_remaining: 0,
          allotment: 5,
          superlike_reset_at: '2023-12-01T00:00:00.000Z',
          alc_superlike_reset_at: '2023-12-01T00:00:00.000Z'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.superLike('user123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/like/user123/super',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken,
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateLocation', () => {
    it('should update location successfully', async () => {
      const mockResponse = { status: 'ok' }
      const lat = 40.7128
      const lon = -74.0060

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.updateLocation(lat, lon)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/user/ping',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ lat, lon })
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        api_token: 'new-token-456',
        refresh_token: 'new-refresh-token-789'
      }
      const refreshToken = 'old-refresh-token'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.refreshToken(refreshToken)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'platform': 'web'
          }),
          body: JSON.stringify({ refresh_token: refreshToken })
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getAnalytics', () => {
    it('should fetch analytics successfully', async () => {
      const mockAnalytics = {
        profile_views: 150,
        matches: 25,
        super_likes: 5
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalytics)
      })

      const result = await tinderAPI.getAnalytics()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/profile/analytics',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken
          })
        })
      )
      expect(result).toEqual(mockAnalytics)
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(tinderAPI.fetchTeasers()).rejects.toThrow('Network error')
    })

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(tinderAPI.getProfile()).rejects.toThrow('Tinder API error: 500 Internal Server Error')
    })
  })
})