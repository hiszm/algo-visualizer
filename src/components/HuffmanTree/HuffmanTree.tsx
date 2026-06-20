import type { HuffmanNode } from '@/lib/steps/huffmanCoding'
import styles from './HuffmanTree.module.css'

interface HuffmanTreeProps {
  nodes: HuffmanNode[]
  activeNodeIds: string[]
  codes: Record<string, string>
}

interface LayoutNode extends HuffmanNode {
  x: number
  y: number
}

export default function HuffmanTree({ nodes, activeNodeIds, codes }: HuffmanTreeProps) {
  if (!nodes.length) {
    return <div className={styles.container}>暂无数据</div>
  }

  const nodeMap = new Map<string, HuffmanNode>()
  nodes.forEach(node => nodeMap.set(node.id, node))

  // 找到根节点：不是任何节点的子节点的那个
  const childIds = new Set<string>()
  nodes.forEach(node => {
    if (node.left) childIds.add(node.left)
    if (node.right) childIds.add(node.right)
  })
  const root = nodes.find(node => !childIds.has(node.id)) || nodes[0]

  // 计算每个节点的深度
  const depths = new Map<string, number>()
  function calcDepth(node: HuffmanNode, depth: number): void {
    depths.set(node.id, depth)
    if (node.left) {
      const child = nodeMap.get(node.left)
      if (child) calcDepth(child, depth + 1)
    }
    if (node.right) {
      const child = nodeMap.get(node.right)
      if (child) calcDepth(child, depth + 1)
    }
  }
  calcDepth(root, 0)

  const maxDepth = Math.max(...Array.from(depths.values()))

  // 简单布局：按深度分层，每层节点水平均匀分布
  const nodesByDepth: HuffmanNode[][] = []
  depths.forEach((depth, id) => {
    const node = nodeMap.get(id)
    if (!node) return
    if (!nodesByDepth[depth]) nodesByDepth[depth] = []
    nodesByDepth[depth].push(node)
  })

  const width = 600
  const height = 300
  const paddingX = 40
  const paddingY = 40
  const availableWidth = width - paddingX * 2
  const availableHeight = height - paddingY * 2

  const layoutNodes = new Map<string, LayoutNode>()

  nodesByDepth.forEach((levelNodes, depth) => {
    const y = paddingY + (maxDepth === 0 ? 0 : depth / maxDepth) * availableHeight
    const count = levelNodes.length
    levelNodes.forEach((node, index) => {
      const x = count === 1
        ? width / 2
        : paddingX + (index / (count - 1)) * availableWidth
      layoutNodes.set(node.id, { ...node, x, y })
    })
  })

  // 绘制边
  const edges: JSX.Element[] = []
  layoutNodes.forEach((node) => {
    if (node.left) {
      const child = layoutNodes.get(node.left)
      if (child) {
        const isActive = activeNodeIds.includes(node.id) && activeNodeIds.includes(child.id)
        edges.push(
          <line
            key={`${node.id}-${child.id}`}
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            className={`${styles.edge} ${isActive ? styles.edgeActive : ''}`}
          />
        )
      }
    }
    if (node.right) {
      const child = layoutNodes.get(node.right)
      if (child) {
        const isActive = activeNodeIds.includes(node.id) && activeNodeIds.includes(child.id)
        edges.push(
          <line
            key={`${node.id}-${child.id}`}
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            className={`${styles.edge} ${isActive ? styles.edgeActive : ''}`}
          />
        )
      }
    }
  })

  return (
    <div className={styles.container}>
      <svg className={styles.tree} viewBox={`0 0 ${width} ${height}`}>
        {edges}
        {Array.from(layoutNodes.values()).map(node => {
          const isActive = activeNodeIds.includes(node.id)
          const isFinal = activeNodeIds.includes(node.id) && Object.keys(codes).length > 0
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.char ? 22 : 18}
                className={`${styles.nodeCircle} ${isFinal ? styles.nodeFinal : ''} ${isActive && !isFinal ? styles.nodeActive : ''}`}
              />
              <text x={node.x} y={node.y} className={styles.label}>
                {node.char || ''}
              </text>
              <text x={node.x} y={node.y + (node.char ? 36 : 30)} className={styles.weight}>
                {node.weight}
              </text>
            </g>
          )
        })}
      </svg>

      {Object.keys(codes).length > 0 && (
        <div className={styles.codes}>
          {Object.entries(codes).map(([char, code]) => (
            <div key={char} className={styles.code}>{char}: {code}</div>
          ))}
        </div>
      )}
    </div>
  )
}
