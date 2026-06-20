import { describe, it, expect } from 'vitest'
import { runLengthEncodingSteps } from '../runLengthEncoding'

describe('runLengthEncodingSteps', () => {
  it('encodes AAABBC as A3B2C1', () => {
    const steps = runLengthEncodingSteps({ text: 'AAABBC' })
    const final = steps[steps.length - 1]
    expect(final.data.encoded).toBe('A3B2C1')
  })

  it('encodes single character A as A1', () => {
    const steps = runLengthEncodingSteps({ text: 'A' })
    const final = steps[steps.length - 1]
    expect(final.data.encoded).toBe('A1')
  })

  it('handles empty string', () => {
    const steps = runLengthEncodingSteps({ text: '' })
    const final = steps[steps.length - 1]
    expect(final.data.encoded).toBe('')
  })
})
