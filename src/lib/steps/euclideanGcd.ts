import type { Step } from '@/types/algorithm'

export function euclideanGcdSteps(input: { a: number; b: number }): Step[] {
  let { a, b } = input
  const steps: Step[] = []

  steps.push({
    type: 'visit',
    indices: ['a', 'b'],
    pseudocodeLine: 0,
    message: `计算 gcd(${a}, ${b})`,
    data: { a, b, quotient: null, remainder: null },
  })

  while (b !== 0) {
    const remainder = a % b
    const quotient = Math.floor(a / b)

    steps.push({
      type: 'compare',
      indices: ['a', 'b'],
      pseudocodeLine: 1,
      message: `${a} ÷ ${b} = ${quotient} 余 ${remainder}`,
      data: { a, b, quotient, remainder },
    })

    steps.push({
      type: 'swap',
      indices: ['a', 'b', 'remainder'],
      pseudocodeLine: 2,
      message: `令 a = ${b}，b = ${remainder}`,
      data: { a: b, b: remainder, quotient: null, remainder: null },
    })

    a = b
    b = remainder
  }

  steps.push({
    type: 'final',
    indices: ['a'],
    pseudocodeLine: 3,
    message: `b 为 0，最大公约数是 ${a}`,
    data: { a, b, quotient: null, remainder: null },
  })

  return steps
}
