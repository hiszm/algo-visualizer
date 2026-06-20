import type { Step } from '@/types/algorithm'

export interface HuffmanNode {
  id: string
  char?: string
  weight: number
  left?: string
  right?: string
}

export function huffmanCodingSteps(input: { text: string }): Step[] {
  const { text } = input
  const steps: Step[] = []

  if (text.length === 0) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: '输入为空',
      data: { original: text, frequencies: {}, nodes: [], codes: {} },
    })
    return steps
  }

  // 统计频率
  const frequencies: Record<string, number> = {}
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1
  }

  steps.push({
    type: 'visit',
    indices: Object.keys(frequencies),
    pseudocodeLine: 0,
    message: `统计字符频率：${JSON.stringify(frequencies)}`,
    data: { original: text, frequencies, nodes: [], codes: {} },
  })

  // 所有节点（叶子 + 合并节点）都保存在这里，用于最终渲染
  const allNodes: HuffmanNode[] = []

  // 初始化叶子节点
  const nodes: HuffmanNode[] = Object.entries(frequencies).map(([char, weight]) => {
    const node: HuffmanNode = { id: `leaf-${char}`, char, weight }
    allNodes.push(node)
    return node
  })

  steps.push({
    type: 'visit',
    indices: nodes.map(n => n.id),
    pseudocodeLine: 1,
    message: '为每个字符创建叶子节点',
    data: { original: text, frequencies, nodes: [...allNodes], codes: {} },
  })

  let mergeIndex = 0

  // 合并节点
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.weight - b.weight)
    const left = nodes[0]
    const right = nodes[1]
    const merged: HuffmanNode = {
      id: `merge-${mergeIndex}`,
      weight: left.weight + right.weight,
      left: left.id,
      right: right.id,
    }

    steps.push({
      type: 'compare',
      indices: [left.id, right.id],
      pseudocodeLine: 2,
      message: `选择权值最小的两个节点合并：${left.weight} + ${right.weight} = ${merged.weight}`,
      data: { original: text, frequencies, nodes: [...allNodes], codes: {} },
    })

    nodes.shift()
    nodes.shift()
    nodes.push(merged)
    allNodes.push(merged)
    mergeIndex++

    steps.push({
      type: 'swap',
      indices: [merged.id],
      pseudocodeLine: 3,
      message: `生成新节点，权值为 ${merged.weight}`,
      data: { original: text, frequencies, nodes: [...allNodes], codes: {} },
    })
  }

  const root = nodes[0]

  steps.push({
    type: 'final',
    indices: root ? [root.id] : [],
    pseudocodeLine: 4,
    message: '霍夫曼树构建完成',
    data: { original: text, frequencies, nodes: [...allNodes], codes: {} },
  })

  // 生成编码
  const codes: Record<string, string> = {}

  if (root) {
    generateCodes(root, allNodes, '', codes)
    steps.push({
      type: 'final',
      indices: Object.keys(codes),
      pseudocodeLine: 5,
      message: `生成前缀码：${JSON.stringify(codes)}`,
      data: { original: text, frequencies, nodes: [...allNodes], codes },
    })
  }

  return steps
}

function generateCodes(
  node: HuffmanNode,
  allNodes: HuffmanNode[],
  prefix: string,
  codes: Record<string, string>
): void {
  if (node.char) {
    codes[node.char] = prefix || '0'
    return
  }

  const left = allNodes.find(n => n.id === node.left)
  const right = allNodes.find(n => n.id === node.right)

  if (left) generateCodes(left, allNodes, prefix + '0', codes)
  if (right) generateCodes(right, allNodes, prefix + '1', codes)
}
