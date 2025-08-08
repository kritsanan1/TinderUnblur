import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TinderAPI } from '../../client/src/lib/tinder-api'

// Mock fetch for this test file
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Tinder API Integration Tests', () => {
  let tinderAPI: TinderAPI
  const mockToken = 'test-auth-token-123'

  beforeEach(() => {
    vi.clearAllMocks()
    
    tinderAPI = new TinderAPI(mockToken, {
      appSessionId: 'test-app-session-id',
      persistentDeviceId: 'test-device-id',
      userSessionId: 'test-user-session-id'
    })
  })

  describe('Real API Contract Tests', () => {
    it('should make correct like request following Tinder API spec', async () => {
      const userId = 'test-user-123'
      const mockResponse = {
        match: false,
        likes_remaining: 99,
        'X-Padding': '{"meta":{"code":200}}',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.swipe(userId, 'like')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/like/test-user-123?locale=en',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Auth-Token': mockToken,
            'platform': 'web',
            'Accept': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle rate limiting response correctly', async () => {
      const userId = 'test-user-123'
      const mockResponse = {
        match: false,
        likes_remaining: 0,
        rate_limited_until: 1556811475570,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse)
      })

      const result = await tinderAPI.swipe(userId, 'like')

      expect(result.likes_remaining).toBe(0)
      expect(result.rate_limited_until).toBe(1556811475570)
    })

    it('should make correct recommendations request', async () => {
      const mockResponse = {
        meta: { status: 200 },
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: '5c350b7ce6e654b05b6e7c52',
                name: 'Test User',
                bio: 'Test bio',
                birth_date: '1997-04-25T04:16:43.928Z',
                photos: [
                  {
                    id: '0cbf65a2-ae0e-480c-906c-a6ca4cdc5e69',
                    url: 'https://images-ssl.gotinder.com/test.jpg',
                    processedFiles: []
                  }
                ]
              }
            }
          ]
        }
      }

      const scope = nock('https://api.gotinder.com')
        .get('/v2/recs/core')
        .query({ locale: 'en' })
        .matchHeader('X-Auth-Token', mockToken)
        .reply(200, mockResponse)

      const result = await tinderAPI.getRecommendations()

      expect(scope.isDone()).toBe(true)
      expect(result.meta.status).toBe(200)
      expect(result.data.results).toHaveLength(1)
      expect(result.data.results[0].user.name).toBe('Test User')
    })

    it('should make correct teaser request', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'teaser-user-123',
                name: 'Teaser User',
                photos: []
              }
            }
          ]
        }
      }

      const scope = nock('https://api.gotinder.com')
        .get('/v2/fast-match/teasers')
        .matchHeader('X-Auth-Token', mockToken)
        .reply(200, mockResponse)

      const result = await tinderAPI.fetchTeasers()

      expect(scope.isDone()).toBe(true)
      expect(result.data.results).toHaveLength(1)
    })

    it('should handle profile request correctly', async () => {
      const mockProfile = {
        _id: 'user-profile-123',
        name: 'Test Profile',
        bio: 'Profile bio',
        birth_date: '1990-01-01T00:00:00.000Z',
        create_date: '2020-01-01T00:00:00.000Z',
        email: 'test@example.com',
        photos: []
      }

      const scope = nock('https://api.gotinder.com')
        .get('/profile')
        .matchHeader('X-Auth-Token', mockToken)
        .reply(200, mockProfile)

      const result = await tinderAPI.getProfile()

      expect(scope.isDone()).toBe(true)
      expect(result._id).toBe('user-profile-123')
      expect(result.name).toBe('Test Profile')
    })

    it('should handle super like request correctly', async () => {
      const userId = 'super-like-user-123'
      const mockResponse = {
        match: true,
        super_likes: {
          remaining: 4,
          alc_remaining: 0,
          new_alc_remaining: 0,
          allotment: 5,
          superlike_reset_at: '2023-12-01T00:00:00.000Z',
          alc_superlike_reset_at: '2023-12-01T00:00:00.000Z'
        }
      }

      const scope = nock('https://api.gotinder.com')
        .post(`/like/${userId}/super`)
        .matchHeader('X-Auth-Token', mockToken)
        .matchHeader('Content-Type', 'application/json')
        .reply(200, mockResponse)

      const result = await tinderAPI.superLike(userId)

      expect(scope.isDone()).toBe(true)
      expect(result.match).toBe(true)
      expect(result.super_likes?.remaining).toBe(4)
    })

    it('should handle location update correctly', async () => {
      const lat = 40.7128
      const lon = -74.0060
      const mockResponse = { status: 'ok' }

      const scope = nock('https://api.gotinder.com')
        .post('/user/ping')
        .matchHeader('X-Auth-Token', mockToken)
        .matchHeader('Content-Type', 'application/json')
        .reply(200, mockResponse)

      const result = await tinderAPI.updateLocation(lat, lon)

      expect(scope.isDone()).toBe(true)
      expect(result.status).toBe('ok')
    })

    it('should handle 404 responses correctly', async () => {
      const userId = 'non-existent-user'

      nock('https://api.gotinder.com')
        .get(`/like/${userId}`)
        .query({ locale: 'en' })
        .reply(404, { error: 'User not found' })

      await expect(tinderAPI.swipe(userId, 'like')).rejects.toThrow('Tinder API error: 404 Not Found')
    })

    it('should handle authentication errors', async () => {
      nock('https://api.gotinder.com')
        .get('/profile')
        .reply(401, { error: 'Unauthorized' })

      await expect(tinderAPI.getProfile()).rejects.toThrow('Tinder API error: 401 Unauthorized')
    })

    it('should handle network errors gracefully', async () => {
      nock('https://api.gotinder.com')
        .get('/profile')
        .replyWithError('Network connection failed')

      await expect(tinderAPI.getProfile()).rejects.toThrow('Network connection failed')
    })
  })

  describe('Header Validation', () => {
    it('should include all required headers as per API spec', async () => {
      const scope = nock('https://api.gotinder.com')
        .get('/profile')
        .matchHeader('Accept', 'application/json')
        .matchHeader('app-session-id', 'test-app-session-id')
        .matchHeader('app-version', '1020343')
        .matchHeader('Origin', 'https://tinder.com')
        .matchHeader('persistent-device-id', 'test-device-id')
        .matchHeader('platform', 'web')
        .matchHeader('Referer', 'https://tinder.com/')
        .matchHeader('user-session-id', 'test-user-session-id')
        .matchHeader('X-Auth-Token', mockToken)
        .matchHeader('x-supported-image-formats', 'webp,jpeg')
        .reply(200, { _id: 'test' })

      await tinderAPI.getProfile()

      expect(scope.isDone()).toBe(true)
    })
  })
})