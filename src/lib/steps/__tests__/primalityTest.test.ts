import { describe, it, expect } from 'vitest'
import { primalityTestSteps } from '../primalityTest'

describe('primalityTestSteps', () => {
  it('returns true for prime number 7', () => {
    const steps = primalityTestSteps({ n: 7 })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.isPrime).toBe(true)
  })

  it('returns false for composite number 12', () => {
    const steps = primalityTestSteps({ n: 12 })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.isPrime).toBe(false)
  })

  it('returns false for n = 1', () => {
    const steps = primalityTestSteps({ n: 1 })
    const final = steps[steps.length - 1]
    expect(final.data.isPrime).toBe(false)
  })

  it('returns true for prime number 29', () => {
    const steps = primalityTestSteps({ n: 29 })
    const final = steps[steps.length - 1]
    expect(final.data.isPrime).toBe(true)
  })
})
