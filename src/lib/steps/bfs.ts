import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

export function bfsSteps(input: { nodes: GraphNode[]; edges: GraphEdge[]; startId: string }): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const visited = new Set<string>()
  const queue: string[] = []
  const adj = new Map<string, string[]>()

  // Build adjacency list (undirected)
  edges.forEach(({ from, to }) => {
    if (!adj.has(from)) adj.set(from, [])
    adj.get(from)!.push(to)
    if (!adj.has(to)) adj.set(to, [])
    adj.get(to)!.push(from)
  })

  // Handle empty graph
  if (nodes.length === 0) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: '图为空，无需遍历',
      data: { nodes, edges, visited: [], queue: [] },
    })
    return steps
  }

  // Handle start node not in graph (defensive)
  if (!nodes.find(n => n.id === startId)) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: `起点 ${startId} 不在图中`,
      data: { nodes, edges, visited: [], queue: [] },
    })
    return steps
  }

  visited.add(startId)
  queue.push(startId)
  steps.push({
    type: 'visit',
    indices: [startId],
    pseudocodeLine: 1,
    message: `从起点 ${startId} 开始 BFS 遍历`,
    data: { nodes, edges, visited: Array.from(visited), queue: [...queue] },
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    const neighbors = adj.get(current) || []

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        steps.push({
          type: 'compare',
          indices: [current, neighbor],
          pseudocodeLine: 3,
          message: `发现 ${current} 的未访问邻居 ${neighbor}`,
          data: {
            nodes,
            edges,
            visited: Array.from(visited),
            queue: [...queue],
            activeEdgeIds: [`${current}-${neighbor}`],
          },
        })
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  steps.push({
    type: 'final',
    indices: Array.from(visited),
    pseudocodeLine: 5,
    message: 'BFS 遍历完成',
    data: { nodes, edges, visited: Array.from(visited), queue: [] },
  })

  return steps
}
