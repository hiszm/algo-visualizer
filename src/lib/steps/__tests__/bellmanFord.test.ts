import { describe, it, expect } from 'vitest'
import { bellmanFordSteps } from '../bellmanFord'

describe('bellmanFordSteps', () => {
  const nodes = [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ]

  const edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 1 },
  ]

  it('computes correct shortest distances from A', () => {
    const steps = bellmanFordSteps({ nodes, edges, startId: 'A' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.dist).toEqual({
      A: 0,
      B: 1,
      C: 3,
      D: 4,
    })
  })

  it('marks edges as active during relaxation', () => {
    const steps = bellmanFordSteps({ nodes, edges, startId: 'A' })
    const compareSteps = steps.filter((s) => s.type === 'compare')
    expect(compareSteps.length).toBeGreaterThan(0)
    compareSteps.forEach((step) => {
      expect(step.data.activeEdgeIds).toBeDefined()
      expect(step.data.activeEdgeIds.length).toBe(1)
    })
  })

  it('handles empty graph', () => {
    const steps = bellmanFordSteps({ nodes: [], edges: [], startId: 'A' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
  })

  it('handles isolated start node', () => {
    const isolated = [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }]
    const steps = bellmanFordSteps({ nodes: isolated, edges: [], startId: 'A' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
    expect(steps[0].data.dist).toEqual({ A: 0, B: Infinity })
  })

  it('detects negative weight cycle', () => {
    const negNodes = [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
    ]
    const negEdges = [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -2 },
      { from: 'C', to: 'A', weight: -1 },
    ]
    const steps = bellmanFordSteps({ nodes: negNodes, edges: negEdges, startId: 'A' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.data.hasNegativeCycle).toBe(true)
  })
})
