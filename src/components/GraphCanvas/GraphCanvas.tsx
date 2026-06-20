import { useMemo } from 'react'
import { calculateLayout } from '@/lib/graphLayout'
import type { GraphNode, GraphEdge } from '@/lib/graphLayout'
import styles from './GraphCanvas.module.css'

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNodeIds: string[]
  activeEdgeIds: string[]
}

export default function GraphCanvas({ nodes, edges, activeNodeIds, activeEdgeIds }: GraphCanvasProps) {
  const width = 500
  const height = 320
  const layoutedNodes = useMemo(() => calculateLayout(nodes, edges, width, height), [nodes, edges, width, height])
  const nodeMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; label: string }>()
    layoutedNodes.forEach(n => map.set(n.id, { x: n.x!, y: n.y!, label: n.label }))
    return map
  }, [layoutedNodes])

  return (
    <svg className={styles.canvas} viewBox={`0 0 ${width} ${height}`}>
      {edges.map((edge, index) => {
        const from = nodeMap.get(edge.from)
        const to = nodeMap.get(edge.to)
        if (!from || !to) return null
        const edgeId = `${edge.from}-${edge.to}`
        const isActive = activeEdgeIds.includes(edgeId)

        return (
          <g key={index}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`${styles.edge} ${isActive ? styles.activeEdge : ''}`}
            />
            {edge.weight !== undefined && (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                className={styles.edgeLabel}
              >
                {edge.weight}
              </text>
            )}
          </g>
        )
      })}

      {layoutedNodes.map(node => {
        const isActive = activeNodeIds.includes(node.id)
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              className={`${styles.node} ${isActive ? styles.activeNode : ''}`}
            />
            <text
              x={node.x}
              y={node.y}
              dy="0.35em"
              textAnchor="middle"
              className={styles.nodeLabel}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
