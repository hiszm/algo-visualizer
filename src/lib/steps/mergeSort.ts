import type { Step } from '@/types/algorithm'

export function mergeSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        pseudocodeLine: 2,
        message: `比较 ${leftArr[i]} 和 ${rightArr[j]}`,
        data: { array: [...arr] },
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      j++
      k++
    }

    steps.push({
      type: 'swap',
      indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      pseudocodeLine: 3,
      message: `合并区间 [${left}, ${right}]`,
      data: { array: [...arr] },
    })
  }

  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      mergeSort(left, mid)
      mergeSort(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeSort(0, n - 1)

  steps.push({
    type: 'final',
    indices: Array.from({ length: n }, (_, i) => i),
    pseudocodeLine: 4,
    message: '排序完成',
    data: { array: [...arr] },
  })

  return steps
}
