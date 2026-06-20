import type { Step } from '@/types/algorithm'

export function linearSearchSteps(input: { array: number[]; target: number }): Step[] {
  const { array, target } = input
  const steps: Step[] = []

  for (let i = 0; i < array.length; i++) {
    steps.push({
      type: 'visit',
      indices: [i],
      pseudocodeLine: 1,
      message: `检查索引 ${i}，值 ${array[i]}`,
      data: { array, target, foundIndex: null },
    })

    if (array[i] === target) {
      steps.push({
        type: 'final',
        indices: [i],
        pseudocodeLine: 2,
        message: `找到目标值 ${target} 在索引 ${i}`,
        data: { array, target, foundIndex: i },
      })
      return steps
    }
  }

  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 3,
    message: `未找到目标值 ${target}`,
    data: { array, target, foundIndex: null },
  })

  return steps
}
