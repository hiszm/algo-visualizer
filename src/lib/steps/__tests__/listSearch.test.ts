import { describe, it, expect } from 'vitest'
import { listSearchSteps } from '../listSearch'

describe('listSearchSteps', () => {
  it('finds target in list', () => {
    const steps = listSearchSteps({ list: ['apple', 'banana', 'cherry'], target: 'banana' })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.foundIndex).toBe(1)
  })

  it('returns null when target is not found', () => {
    const steps = listSearchSteps({ list: ['apple', 'banana'], target: 'cherry' })
    const final = steps[steps.length - 1]
    expect(final.data.foundIndex).toBeNull()
  })
})
