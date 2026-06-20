import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

export function bellmanFordSteps(input: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  startId: string
}): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const dist = new Map<string, number>()

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

  // Relaxation steps
  for (let i = 0; i < nodes.length - 1; i++) {
    let anyUpdated = false
    for (const edge of edges) {
      const fromDist = dist.get(edge.from)!
      if (fromDist !== Infinity) {
        const newDist = fromDist + (edge.weight || 0)
        if (newDist < dist.get(edge.to)!) {
          dist.set(edge.to, newDist)
          anyUpdated = true
          steps.push({
            type: 'compare',
            indices: [edge.from, edge.to],
            pseudocodeLine: 2,
            message: `第 ${i + 1} 轮松弛：更新 ${edge.to} 的距离为 ${newDist}`,
            data: {
              nodes,
              edges,
              dist: Object.fromEntries(dist),
              visited: [],
              activeEdgeIds: [`${edge.from}-${edge.to}`],
            },
          })
        }
      }
    }
    if (!anyUpdated) break
  }

  // Check for negative cycles
  let hasNegativeCycle = false
  for (const edge of edges) {
    const fromDist = dist.get(edge.from)!
    if (fromDist !== Infinity && fromDist + (edge.weight || 0) < dist.get(edge.to)!) {
      hasNegativeCycle = true
      break
    }
  }

  const visited = nodes
    .filter((n) => dist.get(n.id)! < Infinity)
    .map((n) => n.id)

  steps.push({
    type: 'final',
    indices: visited,
    pseudocodeLine: 3,
    message: hasNegativeCycle ? '检测到负权环' : '最短路径计算完成',
    data: {
      nodes,
      edges,
      dist: Object.fromEntries(dist),
      visited,
      hasNegativeCycle,
    },
  })

  return steps
}
