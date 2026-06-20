import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

export function dfsSteps(input: { nodes: GraphNode[]; edges: GraphEdge[]; startId: string }): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const visited = new Set<string>()
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
      data: { nodes, edges, visited: [], stack: [] },
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
      data: { nodes, edges, visited: [], stack: [] },
    })
    return steps
  }

  function dfs(nodeId: string) {
    visited.add(nodeId)
    steps.push({
      type: 'visit',
      indices: [nodeId],
      pseudocodeLine: 1,
      message: `访问节点 ${nodeId}`,
      data: {
        nodes,
        edges,
        visited: Array.from(visited),
        stack: [],
      },
    })

    const neighbors = adj.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        steps.push({
          type: 'compare',
          indices: [nodeId, neighbor],
          pseudocodeLine: 3,
          message: `从 ${nodeId} 深入探索邻居 ${neighbor}`,
          data: {
            nodes,
            edges,
            visited: Array.from(visited),
            stack: [],
            activeEdgeIds: [`${nodeId}-${neighbor}`],
          },
        })
        dfs(neighbor)
      }
    }
  }

  dfs(startId)

  steps.push({
    type: 'final',
    indices: Array.from(visited),
    pseudocodeLine: 5,
    message: 'DFS 遍历完成',
    data: { nodes, edges, visited: Array.from(visited), stack: [] },
  })

  return steps
}
