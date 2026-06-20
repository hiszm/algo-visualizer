import type { Step } from '@/types/algorithm'

export function insertionSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    while (j >= 0) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        pseudocodeLine: 2,
        message: `比较 ${arr[j]} 和 ${key}`,
        data: { array: [...arr] },
      })

      if (arr[j] > key) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          pseudocodeLine: 3,
          message: `将 ${arr[j]} 后移`,
          data: { array: [...arr] },
        })
        arr[j + 1] = arr[j]
        j--
      } else {
        break
      }
    }

    arr[j + 1] = key
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
