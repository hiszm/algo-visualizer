import type { Step } from '@/types/algorithm'

export function listSearchSteps(input: { list: string[]; target: string }): Step[] {
  const { list, target } = input
  const steps: Step[] = []

  for (let i = 0; i < list.length; i++) {
    steps.push({
      type: 'visit',
      indices: [i],
      pseudocodeLine: 1,
      message: `检查索引 ${i}，值 "${list[i]}"`,
      data: { list, target, foundIndex: null },
    })

    if (list[i] === target) {
      steps.push({
        type: 'final',
        indices: [i],
        pseudocodeLine: 2,
        message: `找到目标值 "${target}" 在索引 ${i}`,
        data: { list, target, foundIndex: i },
      })
      return steps
    }
  }

  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 3,
    message: `未找到目标值 "${target}"`,
    data: { list, target, foundIndex: null },
  })

  return steps
}
