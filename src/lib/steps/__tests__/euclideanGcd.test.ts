import { describe, it, expect } from 'vitest'
import { euclideanGcdSteps } from '../euclideanGcd'

describe('euclideanGcdSteps', () => {
  it('computes gcd(48, 18) = 6', () => {
    const steps = euclideanGcdSteps({ a: 48, b: 18 })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.a).toBe(6)
  })

  it('computes gcd(35, 14) = 7', () => {
    const steps = euclideanGcdSteps({ a: 35, b: 14 })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.a).toBe(7)
  })

  it('handles gcd(a, 0) = a', () => {
    const steps = euclideanGcdSteps({ a: 21, b: 0 })
    const final = steps[steps.length - 1]
    expect(final.type).toBe('final')
    expect(final.data.a).toBe(21)
  })
})
