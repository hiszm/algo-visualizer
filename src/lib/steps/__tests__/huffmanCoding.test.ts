import { describe, it, expect } from 'vitest'
import { huffmanCodingSteps } from '../huffmanCoding'

describe('huffmanCodingSteps', () => {
  it('builds a tree for "AABBC"', () => {
    const steps = huffmanCodingSteps({ text: 'AABBC' })
    const final = steps[steps.length - 1]
    expect(final.data.codes).toBeDefined()
    expect(Object.keys(final.data.codes).length).toBe(3)
  })

  it('produces prefix codes', () => {
    const steps = huffmanCodingSteps({ text: 'AAABBC' })
    const final = steps[steps.length - 1]
    const codes: Record<string, string> = final.data.codes
    const values = Object.values(codes)
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (i !== j) {
          expect(values[i].startsWith(values[j])).toBe(false)
        }
      }
    }
  })

  it('handles single character', () => {
    const steps = huffmanCodingSteps({ text: 'A' })
    const final = steps[steps.length - 1]
    expect(final.data.codes['A']).toBe('0')
  })
})
