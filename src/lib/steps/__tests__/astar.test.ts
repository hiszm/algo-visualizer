import { describe, it, expect } from 'vitest'
import { astarSteps } from '../astar'

describe('astarSteps', () => {
  const nodes = [
    { id: 'A', label: 'A', x: 0, y: 0 },
    { id: 'B', label: 'B', x: 1, y: 0 },
    { id: 'C', label: 'C', x: 2, y: 0 },
    { id: 'D', label: 'D', x: 1, y: 1 },
  ]

  const edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'D', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'D', to: 'C', weight: 2 },
  ]

  it('finds shortest path from A to C', () => {
    const steps = astarSteps({ nodes, edges, startId: 'A', endId: 'C' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.path).toEqual(['A', 'B', 'C'])
  })

  it('marks edges as active during neighbor expansion', () => {
    const steps = astarSteps({ nodes, edges, startId: 'A', endId: 'C' })
    const compareSteps = steps.filter((s) => s.type === 'compare')
    expect(compareSteps.length).toBeGreaterThan(0)
    compareSteps.forEach((step) => {
      expect(step.data.activeEdgeIds).toBeDefined()
      expect(step.data.activeEdgeIds.length).toBe(1)
    })
  })

  it('handles empty graph', () => {
    const steps = astarSteps({ nodes: [], edges: [], startId: 'A', endId: 'C' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
  })

  it('handles missing start or end node', () => {
    const steps = astarSteps({ nodes, edges: [], startId: 'X', endId: 'C' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
    expect(steps[0].message).toContain('起点或终点')
  })

  it('handles unreachable target', () => {
    const disconnected = [
      { id: 'A', label: 'A', x: 0, y: 0 },
      { id: 'B', label: 'B', x: 1, y: 0 },
      { id: 'C', label: 'C', x: 2, y: 0 },
    ]
    const steps = astarSteps({ nodes: disconnected, edges: [], startId: 'A', endId: 'C' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.data.path).toEqual([])
  })
})
