
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AutoSwipeSettings } from '../../client/src/components/dashboard/auto-swipe-settings'

// Mock toast hook
vi.mock('../../client/src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock API request utility
vi.mock('../../client/src/lib/queryClient', () => ({
  apiRequest: vi.fn()
}))

describe('AutoSwipeSettings', () => {
  let queryClient: QueryClient
  const mockApiRequest = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })

    const { apiRequest } = require('../../client/src/lib/queryClient')
    apiRequest.mockImplementation(mockApiRequest)
  })

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AutoSwipeSettings userId="test-user-id" />
      </QueryClientProvider>
    )
  }

  it('shows loading state initially', () => {
    mockApiRequest.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithProviders()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders preferences when loaded', async () => {
    mockApiRequest.mockResolvedValue({
      json: async () => ({
        userId: 'test-user-id',
        autoSwipeEnabled: true,
        dailyLimit: 50,
        swipeInterval: 3,
        ageMin: 22,
        ageMax: 35,
        verifiedOnly: false,
        photoQuality: true,
        bioRequired: false
      })
    })

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Auto-Swipe')).toBeInTheDocument()
      expect(screen.getByText('Daily swipe limit: 50')).toBeInTheDocument()
      expect(screen.getByText('Swipe interval: 3s')).toBeInTheDocument()
    })
  })

  it('toggles auto-swipe setting', async () => {
    mockApiRequest
      .mockResolvedValueOnce({
        json: async () => ({
          userId: 'test-user-id',
          autoSwipeEnabled: false,
          dailyLimit: 50,
          swipeInterval: 3
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true })
      })

    renderWithProviders()

    await waitFor(() => {
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
    })

    expect(mockApiRequest).toHaveBeenCalledWith('PATCH', '/api/preferences/test-user-id', {
      autoSwipeEnabled: true
    })
  })

  it('updates daily limit via slider', async () => {
    mockApiRequest
      .mockResolvedValueOnce({
        json: async () => ({
          userId: 'test-user-id',
          autoSwipeEnabled: true,
          dailyLimit: 50
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true })
      })

    renderWithProviders()

    await waitFor(() => {
      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: 75 } })
    })

    expect(mockApiRequest).toHaveBeenCalledWith('PATCH', '/api/preferences/test-user-id', {
      dailyLimit: 75
    })
  })

  it('handles API errors with toast notification', async () => {
    const mockToast = vi.fn()
    vi.mocked(require('../../client/src/hooks/use-toast').useToast).mockReturnValue({
      toast: mockToast
    })

    mockApiRequest
      .mockResolvedValueOnce({
        json: async () => ({
          userId: 'test-user-id',
          autoSwipeEnabled: true
        })
      })
      .mockRejectedValueOnce(new Error('API Error'))

    renderWithProviders()

    await waitFor(() => {
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive'
      })
    })
  })
})
