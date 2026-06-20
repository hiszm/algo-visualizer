import type { Step } from '@/types/algorithm'

export function selectionSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIdx, j],
        pseudocodeLine: 2,
        message: `比较当前最小值 ${arr[minIdx]} 和 ${arr[j]}`,
        data: { array: [...arr] },
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        pseudocodeLine: 3,
        message: `将最小值 ${arr[minIdx]} 放到位置 ${i}`,
        data: { array: [...arr] },
      })
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
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
