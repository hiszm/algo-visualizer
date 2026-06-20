import type { Step } from '@/types/algorithm'

export function bubbleSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        pseudocodeLine: 2,
        message: `比较 ${arr[j]} 和 ${arr[j + 1]}`,
        data: { array: [...arr] },
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          pseudocodeLine: 3,
          message: `交换 ${arr[j]} 和 ${arr[j + 1]}`,
          data: { array: [...arr] },
        })
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }

  steps.push({
    type: 'final',
    indices: Array.from({ length: n }, (_, i) => i),
    pseudocodeLine: 4,
    message: '排序完成',
    data: { array: [...arr] },
  })

  return steps
}
