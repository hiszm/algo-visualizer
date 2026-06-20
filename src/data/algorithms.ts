import type { Algorithm } from '@/types/algorithm'
import { bubbleSortSteps } from '@/lib/steps/bubbleSort'
import { selectionSortSteps } from '@/lib/steps/selectionSort'
import { insertionSortSteps } from '@/lib/steps/insertionSort'
import { heapSortSteps } from '@/lib/steps/heapSort'
import { mergeSortSteps } from '@/lib/steps/mergeSort'
import { quickSortSteps } from '@/lib/steps/quickSort'

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
  {
    id: 'selection-sort',
    name: '选择排序',
    categoryId: 'sorting',
    description: '每次从未排序区间选择最小元素，放到已排序区间末尾。',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1',
      '  minIdx = i',
      '  for j = i+1 to n-1',
      '    if a[j] < a[minIdx]',
      '      minIdx = j',
      '  swap(a[i], a[minIdx])',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: selectionSortSteps,
    renderer: 'sorting',
  },
  {
    id: 'insertion-sort',
    name: '插入排序',
    categoryId: 'sorting',
    description: '将每个元素插入到已排序区间的正确位置。',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i = 1 to n-1',
      '  key = a[i]',
      '  j = i - 1',
      '  while j >= 0 and a[j] > key',
      '    a[j+1] = a[j]',
      '    j = j - 1',
      '  a[j+1] = key',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: insertionSortSteps,
    renderer: 'sorting',
  },
  {
    id: 'heap-sort',
    name: '堆排序',
    categoryId: 'sorting',
    description: '利用堆数据结构，每次取出最大元素放到末尾。',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'build max heap',
      'for i = n-1 down to 1',
      '  swap(a[0], a[i])',
      '  heapify(a, 0, i)',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: heapSortSteps,
    renderer: 'sorting',
  },
  {
    id: 'merge-sort',
    name: '归并排序',
    categoryId: 'sorting',
    description: '分治法：将数组分成两半分别排序，再合并。',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'mergeSort(a, left, right)',
      '  if left < right',
      '    mid = (left + right) / 2',
      '    mergeSort(a, left, mid)',
      '    mergeSort(a, mid+1, right)',
      '    merge(a, left, mid, right)',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: mergeSortSteps,
    renderer: 'sorting',
  },
  {
    id: 'quick-sort',
    name: '快速排序',
    categoryId: 'sorting',
    description: '分治法：选择基准值，将小于基准的放左边，大于的放右边。',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'quickSort(a, low, high)',
      '  if low < high',
      '    pi = partition(a, low, high)',
      '    quickSort(a, low, pi-1)',
      '    quickSort(a, pi+1, high)',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: quickSortSteps,
    renderer: 'sorting',
  },
]

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find(a => a.id === id)
}
