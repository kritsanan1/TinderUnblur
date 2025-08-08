import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Phone, Facebook, Key, CheckCircle, AlertCircle } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiRequest } from '@/lib/queryClient'

// Form schemas
const PhoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10,15}$/, 'Phone number must be in international format (+1234567890)')
})

const OTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10,15}$/),
  otpCode: z.string().regex(/^\d{4,6}$/, 'OTP code must be 4-6 digits')
})

const FacebookSchema = z.object({
  facebookToken: z.string().min(10, 'Valid Facebook access token is required')
})

const TokenSchema = z.object({
  apiToken: z.string().min(10, 'Valid API token is required')
})

type PhoneFormData = z.infer<typeof PhoneSchema>
type OTPFormData = z.infer<typeof OTPSchema>
type FacebookFormData = z.infer<typeof FacebookSchema>
type TokenFormData = z.infer<typeof TokenSchema>

interface AuthResponse {
  success: boolean
  data?: {
    api_token?: string
    refresh_token?: string
    sms_sent?: boolean
  }
  error?: string
}

interface TinderAuthModalProps {
  onTokenReceived: (token: string, refreshToken?: string) => void
  trigger?: React.ReactNode
}

export function TinderAuthModal({ onTokenReceived, trigger }: TinderAuthModalProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('phone')
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'complete'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form instances
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phoneNumber: '' }
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { phoneNumber: '', otpCode: '' }
  })

  const facebookForm = useForm<FacebookFormData>({
    resolver: zodResolver(FacebookSchema),
    defaultValues: { facebookToken: '' }
  })

  const tokenForm = useForm<TokenFormData>({
    resolver: zodResolver(TokenSchema),
    defaultValues: { apiToken: '' }
  })

  const resetState = () => {
    setAuthStep('phone')
    setPhoneNumber('')
    setError(null)
    setSuccess(null)
    setIsLoading(false)
    phoneForm.reset()
    otpForm.reset()
    facebookForm.reset()
    tokenForm.reset()
  }

  const handleClose = () => {
    setOpen(false)
    resetState()
  }

  const handleSendOTP = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('/api/auth/phone/send-otp', {
        method: 'POST',
        body: { phoneNumber: data.phoneNumber }
      }) as AuthResponse

      if (response.success && response.data?.sms_sent) {
        setPhoneNumber(data.phoneNumber)
        setAuthStep('otp')
        setSuccess('OTP code sent successfully! Check your phone.')
        otpForm.setValue('phoneNumber', data.phoneNumber)
      } else {
        setError(response.error || 'Failed to send OTP code')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateOTP = async (data: OTPFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('/api/auth/phone/validate-otp', {
        method: 'POST',
        body: data
      }) as AuthResponse

      if (response.success && response.data?.api_token) {
        setAuthStep('complete')
        setSuccess('Authentication successful!')
        onTokenReceived(response.data.api_token, response.data.refresh_token)
        setTimeout(handleClose, 2000)
      } else {
        setError(response.error || 'Invalid OTP code')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate OTP code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookAuth = async (data: FacebookFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('/api/auth/facebook', {
        method: 'POST',
        body: data
      }) as AuthResponse

      if (response.success && response.data?.api_token) {
        setSuccess('Facebook authentication successful!')
        onTokenReceived(response.data.api_token, response.data.refresh_token)
        setTimeout(handleClose, 2000)
      } else {
        setError(response.error || 'Facebook authentication failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Facebook authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectToken = async (data: TokenFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('/api/auth/validate-token', {
        method: 'POST',
        body: data
      }) as { success: boolean; valid: boolean; error?: string }

      if (response.success && response.valid) {
        setSuccess('Token validated successfully!')
        onTokenReceived(data.apiToken)
        setTimeout(handleClose, 2000)
      } else {
        setError('Invalid or expired token')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token validation failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" />
            Connect Tinder Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tinder Authentication</DialogTitle>
          <DialogDescription>
            Connect your Tinder account to enable real-time features and data synchronization.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="phone" disabled={isLoading}>
              <Phone className="mr-2 h-4 w-4" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="facebook" disabled={isLoading}>
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="token" disabled={isLoading}>
              <Key className="mr-2 h-4 w-4" />
              Token
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-4">
            {authStep === 'phone' && (
              <Card>
                <CardHeader>
                  <CardTitle>Phone Authentication</CardTitle>
                  <CardDescription>
                    Enter your phone number to receive an OTP code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
                      <FormField
                        control={phoneForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="+1234567890"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Use international format (+country code + number)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP Code
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {authStep === 'otp' && (
              <Card>
                <CardHeader>
                  <CardTitle>Enter OTP Code</CardTitle>
                  <CardDescription>
                    Enter the verification code sent to {phoneNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleValidateOTP)} className="space-y-4">
                      <FormField
                        control={otpForm.control}
                        name="otpCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OTP Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="123456"
                                disabled={isLoading}
                                maxLength={6}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the 4-6 digit code from your SMS
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setAuthStep('phone')}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Verify Code
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {authStep === 'complete' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-medium">Authentication Complete!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your Tinder account has been successfully connected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="facebook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facebook Authentication</CardTitle>
                <CardDescription>
                  Enter your Facebook access token to authenticate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...facebookForm}>
                  <form onSubmit={facebookForm.handleSubmit(handleFacebookAuth)} className="space-y-4">
                    <FormField
                      control={facebookForm.control}
                      name="facebookToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Access Token</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="EAABwzLixnjY..."
                              disabled={isLoading}
                              type="password"
                            />
                          </FormControl>
                          <FormDescription>
                            Your Facebook access token for Tinder authentication
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Authenticate with Facebook
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="token" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Direct Token Entry</CardTitle>
                <CardDescription>
                  If you already have a Tinder API token, enter it directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...tokenForm}>
                  <form onSubmit={tokenForm.handleSubmit(handleDirectToken)} className="space-y-4">
                    <FormField
                      control={tokenForm.control}
                      name="apiToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tinder API Token</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                              disabled={isLoading}
                              type="password"
                            />
                          </FormControl>
                          <FormDescription>
                            Your existing Tinder API authentication token
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Validate Token
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}