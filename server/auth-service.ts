import { z } from 'zod'

/**
 * Tinder Authentication Service
 * 
 * Provides token generation capabilities using phone number OTP verification
 * and Facebook authentication methods, based on the tinder-token Python library.
 */

// Validation schemas
const PhoneNumberSchema = z.string().regex(/^\+\d{10,15}$/, 'Phone number must be in international format (+1234567890)')
const OTPCodeSchema = z.string().regex(/^\d{4,6}$/, 'OTP code must be 4-6 digits')
const RefreshTokenSchema = z.string().min(20, 'Refresh token must be at least 20 characters')

// Response interfaces
export interface TinderAuthResponse {
  success: boolean
  data?: {
    api_token?: string
    refresh_token?: string
    sms_sent?: boolean
  }
  error?: string
}

export interface TinderTokens {
  apiToken: string
  refreshToken: string
}

export class TinderAuthService {
  private static readonly TINDER_API_BASE_URL = 'https://api.gotinder.com'
  private static readonly REQUEST_HEADERS = {
    'User-Agent': 'Tinder/11.4.0 (iPhone; iOS 12.4.1; Scale/2.00)',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'app-session-id': 'generated-session-id',
    'app-session-time-elapsed': '0',
    'app-version': '11.4.0',
    'tinder-version': '11.4.0',
    'platform': 'ios'
  }

  // Phone Authentication URLs
  private static readonly PHONE_TOKEN_URL = `${this.TINDER_API_BASE_URL}/v2/auth/login/sms`
  private static readonly CODE_REQUEST_URL = `${this.TINDER_API_BASE_URL}/v2/auth/sms/send?auth_type=sms`
  private static readonly CODE_VALIDATE_URL = `${this.TINDER_API_BASE_URL}/v2/auth/sms/validate?auth_type=sms`

  // Facebook Authentication URLs  
  private static readonly FACEBOOK_LOGIN_URL = `${this.TINDER_API_BASE_URL}/v2/auth/login/facebook`
  private static readonly TOKEN_REFRESH_URL = `${this.TINDER_API_BASE_URL}/v2/auth`

  /**
   * Request OTP code to be sent to the provided phone number
   */
  static async sendOTPCode(phoneNumber: string): Promise<TinderAuthResponse> {
    try {
      // Validate phone number format
      PhoneNumberSchema.parse(phoneNumber)

      // Remove the + prefix as per Tinder API documentation
      const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber

      const payload = {
        phone_number: cleanPhoneNumber
      }

      console.log('Sending OTP request to:', this.CODE_REQUEST_URL)
      console.log('Payload:', payload)
      console.log('Headers:', this.REQUEST_HEADERS)

      const response = await fetch(this.CODE_REQUEST_URL, {
        method: 'POST',
        headers: this.REQUEST_HEADERS,
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      // Get response text first to debug empty responses
      const responseText = await response.text()
      console.log('Response text:', responseText)

      if (!responseText) {
        return {
          success: false,
          error: `Empty response from Tinder API (Status: ${response.status})`
        }
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        return {
          success: false,
          error: `Invalid JSON response: ${responseText.substring(0, 200)}...`
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: {
          sms_sent: data.data?.sms_sent || false
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0].message
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Validate OTP code and get refresh token
   */
  static async validateOTPCode(phoneNumber: string, otpCode: string): Promise<TinderAuthResponse> {
    try {
      // Validate inputs
      PhoneNumberSchema.parse(phoneNumber)
      OTPCodeSchema.parse(otpCode)

      // Remove the + prefix as per Tinder API documentation
      const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber

      const payload = {
        phone_number: cleanPhoneNumber,
        otp_code: otpCode
      }

      console.log('Validating OTP:', payload)

      const response = await fetch(this.CODE_VALIDATE_URL, {
        method: 'POST',
        headers: this.REQUEST_HEADERS,
        body: JSON.stringify(payload)
      })

      const responseText = await response.text()
      console.log('Validate OTP response:', responseText)

      if (!responseText) {
        return {
          success: false,
          error: `Empty response from Tinder API (Status: ${response.status})`
        }
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        return {
          success: false,
          error: `Invalid JSON response: ${responseText.substring(0, 200)}...`
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: {
          refresh_token: data.data?.refresh_token
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0].message
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Generate API token using refresh token
   */
  static async getTinderTokenFromRefreshToken(refreshToken: string): Promise<TinderAuthResponse> {
    try {
      // Validate refresh token
      RefreshTokenSchema.parse(refreshToken)

      const payload = {
        refresh_token: refreshToken
      }

      console.log('Getting API token from refresh token')

      const response = await fetch(this.PHONE_TOKEN_URL, {
        method: 'POST',
        headers: this.REQUEST_HEADERS,
        body: JSON.stringify(payload)
      })

      const responseText = await response.text()
      console.log('Token generation response:', responseText)

      if (!responseText) {
        return {
          success: false,
          error: `Empty response from Tinder API (Status: ${response.status})`
        }
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        return {
          success: false,
          error: `Invalid JSON response: ${responseText.substring(0, 200)}...`
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: {
          api_token: data.data?.api_token,
          refresh_token: data.data?.refresh_token || refreshToken
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0].message
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Authenticate using Facebook token (requires Facebook access token)
   */
  static async authenticateWithFacebook(facebookToken: string): Promise<TinderAuthResponse> {
    try {
      if (!facebookToken || facebookToken.length < 10) {
        return {
          success: false,
          error: 'Valid Facebook access token is required'
        }
      }

      const payload = {
        token: facebookToken
      }

      const response = await fetch(this.FACEBOOK_LOGIN_URL, {
        method: 'POST',
        headers: this.REQUEST_HEADERS,
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: {
          api_token: data.data?.api_token,
          refresh_token: data.data?.refresh_token
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Refresh API token using refresh token
   */
  static async refreshApiToken(refreshToken: string): Promise<TinderAuthResponse> {
    try {
      RefreshTokenSchema.parse(refreshToken)

      const payload = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }

      const response = await fetch(this.TOKEN_REFRESH_URL, {
        method: 'POST',
        headers: this.REQUEST_HEADERS,
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: {
          api_token: data.data?.api_token,
          refresh_token: data.data?.refresh_token
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0].message
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Complete phone authentication flow
   * Step 1: Send OTP, Step 2: Validate OTP, Step 3: Generate token
   */
  static async authenticateWithPhone(phoneNumber: string, otpCode?: string): Promise<TinderAuthResponse> {
    if (!otpCode) {
      // Step 1: Send OTP code
      return await this.sendOTPCode(phoneNumber)
    } else {
      // Step 2: Validate OTP and get refresh token
      const validateResult = await this.validateOTPCode(phoneNumber, otpCode)

      if (!validateResult.success || !validateResult.data?.refresh_token) {
        return validateResult
      }

      // Step 3: Generate API token from refresh token
      return await this.getTinderTokenFromRefreshToken(validateResult.data.refresh_token)
    }
  }

  /**
   * Validate if a token is still valid by making a test API call
   */
  static async validateToken(apiToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.TINDER_API_BASE_URL}/profile`, {
        headers: {
          'X-Auth-Token': apiToken,
          'Accept': 'application/json',
          'User-Agent': this.REQUEST_HEADERS['User-Agent']
        }
      })

      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Get user profile information using API token (for validation)
   */
  static async getUserProfile(apiToken: string): Promise<TinderAuthResponse> {
    try {
      const response = await fetch(`${this.TINDER_API_BASE_URL}/profile`, {
        headers: {
          'X-Auth-Token': apiToken,
          'Accept': 'application/json',
          'User-Agent': this.REQUEST_HEADERS['User-Agent']
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export default TinderAuthService