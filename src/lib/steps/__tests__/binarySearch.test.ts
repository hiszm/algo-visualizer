import { describe, it, expect } from 'vitest'
import { binarySearchSteps } from '../binarySearch'

describe('binarySearchSteps', () => {
  it('finds target and returns correct foundIndex', () => {
    const steps = binarySearchSteps({ array: [1, 3, 5, 7, 9], target: 7 })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.foundIndex).toBe(3)
    expect(lastStep.indices).toContain(3)
  })

  it('returns null foundIndex when target is not found', () => {
    const steps = binarySearchSteps({ array: [1, 3, 5, 7, 9], target: 99 })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.foundIndex).toBeNull()
    expect(lastStep.indices).toEqual([])
  })
})
