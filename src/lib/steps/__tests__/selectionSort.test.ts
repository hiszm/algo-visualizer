import { describe, it, expect } from 'vitest'
import { selectionSortSteps } from '../selectionSort'

describe('selectionSortSteps', () => {
  it('generates correct final sorted array', () => {
    const steps = selectionSortSteps([3, 1, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.data.array).toEqual([1, 2, 3])
  })

  it('contains compare and swap steps', () => {
    const steps = selectionSortSteps([2, 1])
    expect(steps.some(s => s.type === 'compare')).toBe(true)
    expect(steps.some(s => s.type === 'swap')).toBe(true)
  })

  it('has final step with all indices green', () => {
    const steps = selectionSortSteps([3, 1, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.indices).toEqual([0, 1, 2])
  })
})
