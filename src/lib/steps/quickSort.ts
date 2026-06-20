import type { Step } from '@/types/algorithm'

export function quickSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  function partition(low: number, high: number): number {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        pseudocodeLine: 2,
        message: `比较 ${arr[j]} 和基准值 ${pivot}`,
        data: { array: [...arr] },
      })

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          steps.push({
            type: 'swap',
            indices: [i, j],
            pseudocodeLine: 3,
            message: `交换 ${arr[i]} 和 ${arr[j]}`,
            data: { array: [...arr] },
          })
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
      }
    }

    steps.push({
      type: 'swap',
      indices: [i + 1, high],
      pseudocodeLine: 3,
      message: `将基准值 ${pivot} 放到位置 ${i + 1}`,
      data: { array: [...arr] },
    })
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]

    return i + 1
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high)
      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    }
  }

  if (n > 0) {
    quickSort(0, n - 1)
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
