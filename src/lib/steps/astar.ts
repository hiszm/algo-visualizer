import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

function heuristic(a: GraphNode, b: GraphNode): number {
  // Use Manhattan distance if x/y are present, otherwise 0
  if (a.x !== undefined && a.y !== undefined && b.x !== undefined && b.y !== undefined) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }
  return 0
}

export function astarSteps(input: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  startId: string
  endId: string
}): Step[] {
  const { nodes, edges, startId, endId } = input
  const steps: Step[] = []
  const dist = new Map<string, number>()
  const fScore = new Map<string, number>()
  const openSet = new Set<string>()
  const closedSet = new Set<string>()
  const parent = new Map<string, string | null>()

  const endNode = nodes.find((n) => n.id === endId)

  nodes.forEach((n) => {
    dist.set(n.id, Infinity)
    fScore.set(n.id, Infinity)
    parent.set(n.id, null)
  })
  // Handle start or end not in graph
  if (!nodes.find((n) => n.id === startId) || !endNode) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: '起点或终点不在图中',
      data: { nodes, edges, dist: Object.fromEntries(dist), visited: [] },
    })
    return steps
  }

  const startNode = nodes.find((n) => n.id === startId)!
  dist.set(startId, 0)
  fScore.set(startId, heuristic(startNode, endNode))
  openSet.add(startId)

  while (openSet.size > 0) {
    let current: string | null = null
    openSet.forEach((id) => {
      if (current === null || fScore.get(id)! < fScore.get(current)!) {
        current = id
      }
    })

    if (current === null) break

    const currentId = current
    if (currentId === endId) {
      // Reconstruct path
      const path: string[] = []
      let node: string | null = endId
      while (node !== null) {
        path.unshift(node)
        node = parent.get(node)!
      }
      steps.push({
        type: 'visit',
        indices: [currentId],
        pseudocodeLine: 2,
        message: `到达目标节点 ${currentId}，路径已找到`,
        data: {
          nodes,
          edges,
          dist: Object.fromEntries(dist),
          visited: Array.from(closedSet),
          path,
        },
      })
      break
    }

    openSet.delete(currentId)
    closedSet.add(currentId)

    steps.push({
      type: 'visit',
      indices: [currentId],
      pseudocodeLine: 2,
      message: `扩展节点 ${currentId}，当前距离 ${dist.get(currentId)}`,
      data: {
        nodes,
        edges,
        dist: Object.fromEntries(dist),
        visited: Array.from(closedSet),
        openSet: Array.from(openSet),
      },
    })

    edges
      .filter((e) => e.from === currentId && !closedSet.has(e.to))
      .forEach((edge) => {
        const tentativeDist = dist.get(currentId)! + (edge.weight || 0)
        if (tentativeDist < dist.get(edge.to)!) {
          dist.set(edge.to, tentativeDist)
          parent.set(edge.to, currentId)
          const toNode = nodes.find((n) => n.id === edge.to)!
          fScore.set(edge.to, tentativeDist + heuristic(toNode, endNode))
          openSet.add(edge.to)
          steps.push({
            type: 'compare',
            indices: [currentId, edge.to],
            pseudocodeLine: 3,
            message: `更新 ${edge.to} 的估计总代价为 ${fScore.get(edge.to)}`,
            data: {
              nodes,
              edges,
              dist: Object.fromEntries(dist),
              visited: Array.from(closedSet),
              openSet: Array.from(openSet),
              activeEdgeIds: [`${edge.from}-${edge.to}`],
            },
          })
        }
      })
  }

  const visited = Array.from(closedSet)
  const path: string[] = []
  let node: string | null = endId
  while (node !== null && parent.has(node)) {
    path.unshift(node)
    node = parent.get(node)!
  }

  steps.push({
    type: 'final',
    indices: visited,
    pseudocodeLine: 4,
    message: path.length > 0 && path[0] === startId ? 'A* 搜索完成' : '未找到路径',
    data: {
      nodes,
      edges,
      dist: Object.fromEntries(dist),
      visited,
      path: path.length > 0 && path[0] === startId ? path : [],
    },
  })

  return steps
}
