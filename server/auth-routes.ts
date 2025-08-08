import { Router } from 'express'
import { z } from 'zod'
import TinderAuthService from './auth-service'

const router = Router()

// Request validation schemas
const SendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10,15}$/, 'Phone number must be in international format (+1234567890)')
})

const ValidateOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10,15}$/),
  otpCode: z.string().regex(/^\d{4,6}$/, 'OTP code must be 4-6 digits')
})

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(20, 'Refresh token must be at least 20 characters')
})

const FacebookAuthSchema = z.object({
  facebookToken: z.string().min(10, 'Valid Facebook access token is required')
})

const TokenValidationSchema = z.object({
  apiToken: z.string().min(10, 'Valid API token is required')
})

/**
 * @api {post} /api/auth/phone/send-otp Send OTP Code
 * @apiName SendOTPCode
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Sends an OTP code to the specified phone number for Tinder authentication.
 * 
 * @apiBody {String} phoneNumber Phone number in international format (+1234567890)
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {Boolean} data.sms_sent Whether SMS was sent successfully
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.post('/auth/phone/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = SendOTPSchema.parse(req.body)
    
    const result = await TinderAuthService.sendOTPCode(phoneNumber)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0].message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
})

/**
 * @api {post} /api/auth/phone/validate-otp Validate OTP Code
 * @apiName ValidateOTPCode
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Validates OTP code and returns Tinder API tokens.
 * 
 * @apiBody {String} phoneNumber Phone number in international format
 * @apiBody {String} otpCode OTP code received via SMS (4-6 digits)
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} data.api_token Tinder API authentication token
 * @apiSuccess {String} data.refresh_token Token for refreshing API token
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.post('/auth/phone/validate-otp', async (req, res) => {
  try {
    const { phoneNumber, otpCode } = ValidateOTPSchema.parse(req.body)
    
    // First validate OTP and get refresh token
    const validateResult = await TinderAuthService.validateOTPCode(phoneNumber, otpCode)
    
    if (!validateResult.success || !validateResult.data?.refresh_token) {
      return res.status(400).json(validateResult)
    }

    // Then generate API token from refresh token
    const tokenResult = await TinderAuthService.getTinderTokenFromRefreshToken(
      validateResult.data.refresh_token
    )
    
    if (tokenResult.success) {
      res.json(tokenResult)
    } else {
      res.status(400).json(tokenResult)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0].message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
})

/**
 * @api {post} /api/auth/facebook Facebook Authentication
 * @apiName FacebookAuth
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Authenticates with Tinder using Facebook access token.
 * 
 * @apiBody {String} facebookToken Facebook access token
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} data.api_token Tinder API authentication token
 * @apiSuccess {String} data.refresh_token Token for refreshing API token
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.post('/auth/facebook', async (req, res) => {
  try {
    const { facebookToken } = FacebookAuthSchema.parse(req.body)
    
    const result = await TinderAuthService.authenticateWithFacebook(facebookToken)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0].message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
})

/**
 * @api {post} /api/auth/refresh-token Refresh API Token
 * @apiName RefreshToken
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Refreshes Tinder API token using refresh token.
 * 
 * @apiBody {String} refreshToken Refresh token obtained during authentication
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} data.api_token New Tinder API authentication token
 * @apiSuccess {String} data.refresh_token New refresh token
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.post('/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = RefreshTokenSchema.parse(req.body)
    
    const result = await TinderAuthService.refreshApiToken(refreshToken)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0].message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
})

/**
 * @api {post} /api/auth/validate-token Validate API Token
 * @apiName ValidateToken
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Validates if a Tinder API token is still active.
 * 
 * @apiBody {String} apiToken Tinder API token to validate
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Boolean} valid Whether the token is valid
 * @apiSuccess {Object} data User profile data (if token is valid)
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.post('/auth/validate-token', async (req, res) => {
  try {
    const { apiToken } = TokenValidationSchema.parse(req.body)
    
    const isValid = await TinderAuthService.validateToken(apiToken)
    
    if (isValid) {
      // Get user profile for additional validation
      const profileResult = await TinderAuthService.getUserProfile(apiToken)
      
      res.json({
        success: true,
        valid: true,
        data: profileResult.data
      })
    } else {
      res.json({
        success: true,
        valid: false
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0].message
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
})

/**
 * @api {get} /api/auth/profile Get User Profile
 * @apiName GetUserProfile
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * 
 * @apiDescription Gets user profile information using API token.
 * 
 * @apiHeader {String} X-Auth-Token Tinder API authentication token
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} data User profile data
 * 
 * @apiError {Boolean} success=false Operation failed
 * @apiError {String} error Error message
 */
router.get('/auth/profile', async (req, res) => {
  try {
    const apiToken = req.headers['x-auth-token'] as string
    
    if (!apiToken) {
      return res.status(401).json({
        success: false,
        error: 'X-Auth-Token header is required'
      })
    }
    
    const result = await TinderAuthService.getUserProfile(apiToken)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(401).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router