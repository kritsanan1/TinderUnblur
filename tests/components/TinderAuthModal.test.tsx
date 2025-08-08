
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TinderAuthModal } from '../../client/src/components/auth/TinderAuthModal'

// Mock toast hook
vi.mock('../../client/src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock API requests
global.fetch = vi.fn()

describe('TinderAuthModal', () => {
  let queryClient: QueryClient
  const mockOnSuccess = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
  })

  const renderWithProviders = (isOpen = true) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TinderAuthModal
          isOpen={isOpen}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      </QueryClientProvider>
    )
  }

  it('renders when open', () => {
    renderWithProviders()
    expect(screen.getByText('Connect to Tinder')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(false)
    expect(screen.queryByText('Connect to Tinder')).not.toBeInTheDocument()
  })

  it('shows phone authentication tab by default', () => {
    renderWithProviders()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument()
  })

  it('validates phone number format', async () => {
    renderWithProviders()
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const sendOtpButton = screen.getByText('Send Code')

    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } })
    fireEvent.click(sendOtpButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument()
    })
  })

  it('sends OTP for valid phone number', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    renderWithProviders()
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const sendOtpButton = screen.getByText('Send Code')

    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
    fireEvent.click(sendOtpButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/phone/send-otp', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+1234567890' })
      }))
    })
  })

  it('switches to Facebook tab', () => {
    renderWithProviders()
    
    fireEvent.click(screen.getByText('Facebook'))
    expect(screen.getByPlaceholderText('Enter Facebook access token')).toBeInTheDocument()
  })

  it('validates Facebook token', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        token: 'test-token',
        refreshToken: 'refresh-token',
        profile: { name: 'Test User' }
      })
    } as Response)

    renderWithProviders()
    
    fireEvent.click(screen.getByText('Facebook'))
    
    const tokenInput = screen.getByPlaceholderText('Enter Facebook access token')
    const connectButton = screen.getByText('Connect')

    fireEvent.change(tokenInput, { target: { value: 'valid-fb-token' } })
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('test-token')
    })
  })

  it('handles API errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    renderWithProviders()
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number')
    const sendOtpButton = screen.getByText('Send Code')

    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
    fireEvent.click(sendOtpButton)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })
})
