import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

export function dijkstraSteps(input: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  startId: string
}): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const dist = new Map<string, number>()
  const visited = new Set<string>()

  nodes.forEach((n) => dist.set(n.id, Infinity))
  dist.set(startId, 0)

  // Handle empty graph
  if (nodes.length === 0) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: '图为空，无需计算',
      data: { nodes, edges, dist: {}, visited: [] },
    })
    return steps
  }

  // Handle start node not in graph
  if (!nodes.find((n) => n.id === startId)) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: `起点 ${startId} 不在图中`,
      data: { nodes, edges, dist: Object.fromEntries(dist), visited: [] },
    })
    return steps
  }

  while (visited.size < nodes.length) {
    let minNode: string | null = null
    nodes.forEach((n) => {
      if (!visited.has(n.id) && (minNode === null || dist.get(n.id)! < dist.get(minNode)!)) {
        minNode = n.id
      }
    })

    if (minNode === null || dist.get(minNode) === Infinity) break

    const currentNode = minNode
    visited.add(currentNode)
    steps.push({
      type: 'visit',
      indices: [currentNode],
      pseudocodeLine: 2,
      message: `确定节点 ${currentNode} 的最短距离为 ${dist.get(currentNode)}`,
      data: {
        nodes,
        edges,
        dist: Object.fromEntries(dist),
        visited: Array.from(visited),
      },
    })

    edges
      .filter((e) => e.from === currentNode && !visited.has(e.to))
      .forEach((edge) => {
        const newDist = dist.get(currentNode)! + (edge.weight || 0)
        if (newDist < dist.get(edge.to)!) {
          dist.set(edge.to, newDist)
          steps.push({
            type: 'compare',
            indices: [currentNode, edge.to],
            pseudocodeLine: 3,
            message: `更新 ${edge.to} 的距离为 ${newDist}`,
            data: {
              nodes,
              edges,
              dist: Object.fromEntries(dist),
              visited: Array.from(visited),
              activeEdgeIds: [`${edge.from}-${edge.to}`],
            },
          })
        }
      })
  }

  steps.push({
    type: 'final',
    indices: Array.from(visited),
    pseudocodeLine: 4,
    message: '最短路径计算完成',
    data: { nodes, edges, dist: Object.fromEntries(dist), visited: Array.from(visited) },
  })

  return steps
}
