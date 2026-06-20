import type { Algorithm } from '@/types/algorithm'
import { bubbleSortSteps } from '@/lib/steps/bubbleSort'

export const algorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: '冒泡排序',
    categoryId: 'sorting',
    description: '相邻元素两两比较，逐步上浮最大值。',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-2',
      '    if a[j] > a[j+1]',
      '      swap(a[j], a[j+1])',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: bubbleSortSteps,
    renderer: 'sorting',
  },
]

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find(a => a.id === id)
}
