import type { Step } from '@/types/algorithm'

export function securityInfoSteps(topic: string): Step[] {
  return [
    {
      type: 'final',
      indices: [],
      pseudocodeLine: -1,
      message: topic,
      data: { topic },
    },
  ]
}
