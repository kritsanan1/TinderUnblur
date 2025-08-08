import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AutoSwiper } from '../../client/src/lib/auto-swiper'
import { TinderAPI } from '../../client/src/lib/tinder-api'

// Mock TinderAPI
vi.mock('../../client/src/lib/tinder-api')

describe('AutoSwiper', () => {
  let autoSwiper: AutoSwiper
  let mockTinderAPI: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockTinderAPI = {
      getRecommendations: vi.fn(),
      swipe: vi.fn(),
      superLike: vi.fn()
    }
    
    // Mock the TinderAPI constructor
    vi.mocked(TinderAPI).mockImplementation(() => mockTinderAPI)
    
    autoSwiper = new AutoSwiper('test-token')
  })

  describe('start', () => {
    it('should start auto-swiping with provided settings', async () => {
      const mockRecommendations = {
        meta: { status: 200 },
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'user1',
                name: 'Test User',
                age: 25,
                verified: true,
                photos: [{ id: 'photo1' }],
                bio: 'Test bio'
              }
            }
          ]
        }
      }

      const settings = {
        enabled: true,
        dailyLimit: 10,
        swipeInterval: 1,
        ageMin: 22,
        ageMax: 35,
        verifiedOnly: true,
        photoQuality: true,
        bioRequired: true
      }

      mockTinderAPI.getRecommendations.mockResolvedValue(mockRecommendations)
      mockTinderAPI.swipe.mockResolvedValue({ match: false, likes_remaining: 99 })

      const onProgress = vi.fn()
      autoSwiper.start(settings, onProgress)

      // Wait for initial execution
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockTinderAPI.getRecommendations).toHaveBeenCalled()
      expect(mockTinderAPI.swipe).toHaveBeenCalledWith('user1', 'like')
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          totalSwipes: 1,
          matches: 0,
          isRunning: true
        })
      )

      autoSwiper.stop()
    })

    it('should filter users based on settings', async () => {
      const mockRecommendations = {
        meta: { status: 200 },
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'user1',
                name: 'Young User',
                age: 18, // Below ageMin
                verified: false,
                photos: [],
                bio: ''
              }
            },
            {
              type: 'user',
              user: {
                _id: 'user2',
                name: 'Perfect User',
                age: 25,
                verified: true,
                photos: [{ id: 'photo1' }],
                bio: 'Great bio'
              }
            }
          ]
        }
      }

      const settings = {
        enabled: true,
        dailyLimit: 10,
        swipeInterval: 1,
        ageMin: 22,
        ageMax: 35,
        verifiedOnly: true,
        photoQuality: true,
        bioRequired: true
      }

      mockTinderAPI.getRecommendations.mockResolvedValue(mockRecommendations)
      mockTinderAPI.swipe.mockResolvedValue({ match: false, likes_remaining: 99 })

      const onProgress = vi.fn()
      autoSwiper.start(settings, onProgress)

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should only swipe on user2 (user1 filtered out)
      expect(mockTinderAPI.swipe).toHaveBeenCalledTimes(1)
      expect(mockTinderAPI.swipe).toHaveBeenCalledWith('user2', 'like')

      autoSwiper.stop()
    })

    it('should respect daily limit', async () => {
      const mockRecommendations = {
        meta: { status: 200 },
        data: {
          results: [
            {
              type: 'user',
              user: {
                _id: 'user1',
                name: 'Test User',
                age: 25,
                verified: false,
                photos: [{ id: 'photo1' }],
                bio: 'Test'
              }
            }
          ]
        }
      }

      const settings = {
        enabled: true,
        dailyLimit: 1, // Very low limit
        swipeInterval: 0.1,
        ageMin: 18,
        ageMax: 50,
        verifiedOnly: false,
        photoQuality: false,
        bioRequired: false
      }

      mockTinderAPI.getRecommendations.mockResolvedValue(mockRecommendations)
      mockTinderAPI.swipe.mockResolvedValue({ match: false, likes_remaining: 99 })

      const onProgress = vi.fn()
      autoSwiper.start(settings, onProgress)

      await new Promise(resolve => setTimeout(resolve, 200))

      // Should stop after reaching daily limit
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          totalSwipes: 1,
          isRunning: false
        })
      )

      autoSwiper.stop()
    })

    it('should handle API errors gracefully', async () => {
      const settings = {
        enabled: true,
        dailyLimit: 10,
        swipeInterval: 1,
        ageMin: 18,
        ageMax: 50,
        verifiedOnly: false,
        photoQuality: false,
        bioRequired: false
      }

      mockTinderAPI.getRecommendations.mockRejectedValue(new Error('API Error'))

      const onProgress = vi.fn()
      autoSwiper.start(settings, onProgress)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          isRunning: false,
          error: 'API Error'
        })
      )

      autoSwiper.stop()
    })
  })

  describe('stop', () => {
    it('should stop the auto-swiper', () => {
      const settings = {
        enabled: true,
        dailyLimit: 10,
        swipeInterval: 1,
        ageMin: 18,
        ageMax: 50,
        verifiedOnly: false,
        photoQuality: false,
        bioRequired: false
      }

      autoSwiper.start(settings, vi.fn())
      autoSwiper.stop()

      expect(autoSwiper.isRunning).toBe(false)
    })
  })

  describe('getStats', () => {
    it('should return current statistics', () => {
      const stats = autoSwiper.getStats()

      expect(stats).toEqual({
        totalSwipes: 0,
        matches: 0,
        likes: 0,
        passes: 0,
        isRunning: false,
        timeStarted: null,
        error: null
      })
    })
  })
})