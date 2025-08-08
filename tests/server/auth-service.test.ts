import { describe, it, expect, beforeEach, vi } from 'vitest'
import TinderAuthService from '../../server/auth-service'

// Mock fetch globally
global.fetch = vi.fn()

describe('TinderAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendOTPCode', () => {
    it('should send OTP code successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { sms_sent: true }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.sendOTPCode('+1234567890')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/auth/sms/send?auth_type=sms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'User-Agent': 'Tinder/11.4.0 (iPhone; iOS 12.4.1; Scale/2.00)',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ phone_number: '+1234567890' })
        })
      )

      expect(result).toEqual({
        success: true,
        data: { sms_sent: true }
      })
    })

    it('should handle invalid phone number', async () => {
      const result = await TinderAuthService.sendOTPCode('invalid-phone')

      expect(result).toEqual({
        success: false,
        error: 'Phone number must be in international format (+1234567890)'
      })
    })

    it('should handle API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({
          error: { message: 'Invalid phone number' }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.sendOTPCode('+1234567890')

      expect(result).toEqual({
        success: false,
        error: 'Invalid phone number'
      })
    })
  })

  describe('validateOTPCode', () => {
    it('should validate OTP code successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { refresh_token: 'mock-refresh-token' }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.validateOTPCode('+1234567890', '123456')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/auth/sms/validate?auth_type=sms',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            phone_number: '+1234567890',
            otp_code: '123456'
          })
        })
      )

      expect(result).toEqual({
        success: true,
        data: { refresh_token: 'mock-refresh-token' }
      })
    })

    it('should handle invalid OTP code format', async () => {
      const result = await TinderAuthService.validateOTPCode('+1234567890', 'abc')

      expect(result).toEqual({
        success: false,
        error: 'OTP code must be 4-6 digits'
      })
    })
  })

  describe('getTinderTokenFromRefreshToken', () => {
    it('should generate API token from refresh token', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { 
            api_token: 'mock-api-token',
            refresh_token: 'new-refresh-token'
          }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.getTinderTokenFromRefreshToken('mock-refresh-token')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/auth/login/sms',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refresh_token: 'mock-refresh-token' })
        })
      )

      expect(result).toEqual({
        success: true,
        data: { 
          api_token: 'mock-api-token',
          refresh_token: 'new-refresh-token'
        }
      })
    })

    it('should handle short refresh token', async () => {
      const result = await TinderAuthService.getTinderTokenFromRefreshToken('short')

      expect(result).toEqual({
        success: false,
        error: 'Refresh token must be at least 20 characters'
      })
    })
  })

  describe('authenticateWithFacebook', () => {
    it('should authenticate with Facebook token', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { 
            api_token: 'mock-api-token',
            refresh_token: 'mock-refresh-token'
          }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.authenticateWithFacebook('mock-facebook-token')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/v2/auth/login/facebook',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'mock-facebook-token' })
        })
      )

      expect(result).toEqual({
        success: true,
        data: { 
          api_token: 'mock-api-token',
          refresh_token: 'mock-refresh-token'
        }
      })
    })

    it('should handle invalid Facebook token', async () => {
      const result = await TinderAuthService.authenticateWithFacebook('short')

      expect(result).toEqual({
        success: false,
        error: 'Valid Facebook access token is required'
      })
    })
  })

  describe('validateToken', () => {
    it('should validate API token successfully', async () => {
      const mockResponse = { ok: true }
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.validateToken('mock-api-token')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.gotinder.com/profile',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Auth-Token': 'mock-api-token'
          })
        })
      )

      expect(result).toBe(true)
    })

    it('should handle invalid token', async () => {
      const mockResponse = { ok: false }
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.validateToken('invalid-token')

      expect(result).toBe(false)
    })

    it('should handle network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const result = await TinderAuthService.validateToken('mock-api-token')

      expect(result).toBe(false)
    })
  })

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockProfileData = {
        _id: 'user123',
        name: 'Test User',
        photos: []
      }
      
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockProfileData)
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.getUserProfile('mock-api-token')

      expect(result).toEqual({
        success: true,
        data: mockProfileData
      })
    })

    it('should handle unauthorized access', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({
          error: { message: 'Invalid token' }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.getUserProfile('invalid-token')

      expect(result).toEqual({
        success: false,
        error: 'Invalid token'
      })
    })
  })

  describe('authenticateWithPhone', () => {
    it('should send OTP when no code provided', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { sms_sent: true }
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response)

      const result = await TinderAuthService.authenticateWithPhone('+1234567890')

      expect(result).toEqual({
        success: true,
        data: { sms_sent: true }
      })
    })

    it('should complete authentication when OTP code provided', async () => {
      // Mock OTP validation
      const validateResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { refresh_token: 'mock-refresh-token' }
        })
      }
      
      // Mock token generation
      const tokenResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { 
            api_token: 'mock-api-token',
            refresh_token: 'mock-refresh-token'
          }
        })
      }
      
      vi.mocked(fetch)
        .mockResolvedValueOnce(validateResponse as Response)
        .mockResolvedValueOnce(tokenResponse as Response)

      const result = await TinderAuthService.authenticateWithPhone('+1234567890', '123456')

      expect(result).toEqual({
        success: true,
        data: { 
          api_token: 'mock-api-token',
          refresh_token: 'mock-refresh-token'
        }
      })
    })
  })
})