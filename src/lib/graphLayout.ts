export interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
}

export function calculateLayout(nodes: GraphNode[], _edges: GraphEdge[], width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  const angleStep = (2 * Math.PI) / nodes.length

  return nodes.map((node, index) => ({
    ...node,
    x: centerX + radius * Math.cos(index * angleStep - Math.PI / 2),
    y: centerY + radius * Math.sin(index * angleStep - Math.PI / 2),
  }))
}
