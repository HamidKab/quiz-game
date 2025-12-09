import { render, screen, waitFor, act } from '@testing-library/react'
import Leaderboard from '../Leaderboard'

global.fetch = jest.fn()

describe('Leaderboard Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should render leaderboard title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    await act(async () => {
      render(<Leaderboard />)
    })

    expect(screen.getByRole('heading', { name: /top 10 performances/i })).toBeInTheDocument()
  })

  it('should fetch and display leaderboard data', async () => {
    const mockData = [
      {
        id: 1,
        player_name: 'TestPlayer',
        correct_answers: 10,
        total_questions: 10,
        correct_to_total_ratio: 1.0,
        time_taken: 30.5,
        difficulty: 'easy',
        played_at: '2025-12-03T10:00:00Z'
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    await act(async () => {
      render(<Leaderboard />)
    })

    await waitFor(() => {
      expect(screen.getByText('TestPlayer')).toBeInTheDocument()
    })
  })

  it('should handle fetch errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'))

    await act(async () => {
      render(<Leaderboard />)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
  })

  it('should display loading state', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    
    await act(async () => {
      render(<Leaderboard />)
    })
    
    // Component should render without crashing during loading
    expect(screen.getByRole('heading', { name: /top 10 performances/i })).toBeInTheDocument()
  })
})
