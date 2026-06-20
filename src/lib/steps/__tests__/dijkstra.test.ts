import { describe, it, expect } from 'vitest'
import { dijkstraSteps } from '../dijkstra'

describe('dijkstraSteps', () => {
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
    const steps = dijkstraSteps({ nodes, edges, startId: 'A' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.dist).toEqual({
      A: 0,
      B: 1,
      C: 3,
      D: 4,
    })
  })

  it('visits nodes in order of increasing distance', () => {
    const steps = dijkstraSteps({ nodes, edges, startId: 'A' })
    const visitSteps = steps.filter((s) => s.type === 'visit')
    expect(visitSteps[0].indices).toEqual(['A'])
    expect(visitSteps[1].indices).toEqual(['B'])
    expect(visitSteps[2].indices).toEqual(['C'])
    expect(visitSteps[3].indices).toEqual(['D'])
  })

  it('marks edges as active during relaxation', () => {
    const steps = dijkstraSteps({ nodes, edges, startId: 'A' })
    const compareSteps = steps.filter((s) => s.type === 'compare')
    expect(compareSteps.length).toBeGreaterThan(0)
    compareSteps.forEach((step) => {
      expect(step.data.activeEdgeIds).toBeDefined()
      expect(step.data.activeEdgeIds.length).toBe(1)
    })
  })

  it('handles empty graph', () => {
    const steps = dijkstraSteps({ nodes: [], edges: [], startId: 'A' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
  })

  it('handles isolated start node', () => {
    const isolated = [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }]
    const steps = dijkstraSteps({ nodes: isolated, edges: [], startId: 'A' })
    expect(steps.length).toBe(2)
    expect(steps[0].type).toBe('visit')
    expect(steps[1].type).toBe('final')
    expect(steps[1].data.dist).toEqual({ A: 0, B: Infinity })
  })
})
