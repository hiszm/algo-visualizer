import type { Step } from '@/types/algorithm'

export function primalityTestSteps(input: { n: number }): Step[] {
  const { n } = input
  const steps: Step[] = []

  steps.push({
    type: 'visit',
    indices: ['n'],
    pseudocodeLine: 0,
    message: `判断 ${n} 是否为素数`,
    data: { n, divisor: null, isPrime: null },
  })

  if (n < 2) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 1,
      message: `${n} 小于 2，不是素数`,
      data: { n, divisor: null, isPrime: false },
    })
    return steps
  }

  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    steps.push({
      type: 'compare',
      indices: ['n', 'divisor'],
      pseudocodeLine: 2,
      message: `尝试用 ${divisor} 整除 ${n}`,
      data: { n, divisor, isPrime: null },
    })

    if (n % divisor === 0) {
      steps.push({
        type: 'final',
        indices: ['divisor'],
        pseudocodeLine: 3,
        message: `${n} 能被 ${divisor} 整除，不是素数`,
        data: { n, divisor, isPrime: false },
      })
      return steps
    }
  }

  steps.push({
    type: 'final',
    indices: ['n'],
    pseudocodeLine: 4,
    message: `没有找到能整除 ${n} 的数，${n} 是素数`,
    data: { n, divisor: null, isPrime: true },
  })

  return steps
}
