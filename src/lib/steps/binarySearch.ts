import type { Step } from '@/types/algorithm'

export function binarySearchSteps(input: { array: number[]; target: number }): Step[] {
  const { array, target } = input
  const steps: Step[] = []
  let left = 0
  let right = array.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({
      type: 'compare',
      indices: [mid],
      pseudocodeLine: 2,
      message: `比较中间值 ${array[mid]} 和目标值 ${target}`,
      data: { array, target, left, right, foundIndex: null },
    })

    if (array[mid] === target) {
      steps.push({
        type: 'final',
        indices: [mid],
        pseudocodeLine: 3,
        message: `找到目标值 ${target} 在索引 ${mid}`,
        data: { array, target, left, right, foundIndex: mid },
      })
      return steps
    } else if (array[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 4,
    message: `未找到目标值 ${target}`,
    data: { array, target, left, right, foundIndex: null },
  })

  return steps
}
