import { describe, it, expect } from 'vitest'
import { linearSearchSteps } from '../linearSearch'

describe('linearSearchSteps', () => {
  it('finds target and returns correct foundIndex', () => {
    const steps = linearSearchSteps({ array: [3, 7, 1, 9, 5], target: 9 })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.foundIndex).toBe(3)
    expect(lastStep.indices).toContain(3)
  })

  it('returns null foundIndex when target is not found', () => {
    const steps = linearSearchSteps({ array: [3, 7, 1, 9, 5], target: 99 })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.foundIndex).toBeNull()
    expect(lastStep.indices).toEqual([])
  })
})
