import type { Step } from '@/types/algorithm'

export function heapSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  function heapify(size: number, root: number) {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < size) {
      steps.push({
        type: 'compare',
        indices: [largest, left],
        pseudocodeLine: 2,
        message: `比较 ${arr[largest]} 和左子节点 ${arr[left]}`,
        data: { array: [...arr] },
      })
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    if (right < size) {
      steps.push({
        type: 'compare',
        indices: [largest, right],
        pseudocodeLine: 2,
        message: `比较 ${arr[largest]} 和右子节点 ${arr[right]}`,
        data: { array: [...arr] },
      })
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      steps.push({
        type: 'swap',
        indices: [root, largest],
        pseudocodeLine: 3,
        message: `交换 ${arr[root]} 和 ${arr[largest]}`,
        data: { array: [...arr] },
      })
      ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
      heapify(size, largest)
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i)
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      type: 'swap',
      indices: [0, i],
      pseudocodeLine: 3,
      message: `将堆顶 ${arr[0]} 移到位置 ${i}`,
      data: { array: [...arr] },
    })
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    heapify(i, 0)
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
