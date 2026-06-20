import { useState, useEffect, useCallback, useRef } from 'react'
import type { Step } from '@/types/algorithm'

const DEFAULT_SPEED = 500

export function useAlgorithmPlayer(steps: Step[]) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, -1))
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep(s => s + 1)
    }, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, currentStep, steps.length, speed])

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    next,
    prev,
    setSpeed,
  }
}
