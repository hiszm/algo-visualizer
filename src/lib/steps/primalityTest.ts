import type { Step } from '@/types/algorithm'

export function primalityTestSteps(input: { a: number }): Step[] {
  const a = input.a
  const steps: Step[] = []

  steps.push({
    type: 'visit',
    indices: ['a'],
    pseudocodeLine: 0,
    message: `判断 ${a} 是否为素数`,
    data: { a, b: null, isPrime: null },
  })

  if (a < 2) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 1,
      message: `${a} 小于 2，不是素数`,
      data: { a, b: null, isPrime: false },
    })
    return steps
  }

  for (let b = 2; b * b <= a; b++) {
    steps.push({
      type: 'compare',
      indices: ['a', 'b'],
      pseudocodeLine: 2,
      message: `尝试用 ${b} 整除 ${a}`,
      data: { a, b, isPrime: null },
    })

    if (a % b === 0) {
      steps.push({
        type: 'final',
        indices: ['b'],
        pseudocodeLine: 3,
        message: `${a} 能被 ${b} 整除，不是素数`,
        data: { a, b, isPrime: false },
      })
      return steps
    }
  }

  steps.push({
    type: 'final',
    indices: ['a'],
    pseudocodeLine: 4,
    message: `没有找到能整除 ${a} 的数，${a} 是素数`,
    data: { a, b: null, isPrime: true },
  })

  return steps
}
