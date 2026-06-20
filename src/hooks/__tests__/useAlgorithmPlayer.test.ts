import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAlgorithmPlayer } from '../useAlgorithmPlayer'
import type { Step } from '@/types/algorithm'

const steps: Step[] = [
  { type: 'compare', indices: [0, 1], pseudocodeLine: 0, message: 'compare', data: {} },
  { type: 'swap', indices: [0, 1], pseudocodeLine: 1, message: 'swap', data: {} },
]

describe('useAlgorithmPlayer', () => {
  it('starts at step -1', () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    expect(result.current.currentStep).toBe(-1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('moves to next step', () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.next())
    expect(result.current.currentStep).toBe(0)
  })

  it('auto advances when playing', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.play())
    act(() => vi.advanceTimersByTime(600))
    await waitFor(() => expect(result.current.currentStep).toBe(0))
    vi.useRealTimers()
  })

  it('stops at last step', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.play())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.isPlaying).toBe(false)
    vi.useRealTimers()
  })
})
