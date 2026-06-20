import { describe, it, expect } from 'vitest'
import { bfsSteps } from '../bfs'

describe('bfsSteps', () => {
  const nodes = [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ]

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
  ]

  it('visits all nodes from start in BFS order', () => {
    const steps = bfsSteps({ nodes, edges, startId: 'A' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.visited).toContain('A')
    expect(lastStep.data.visited).toContain('B')
    expect(lastStep.data.visited).toContain('C')
    expect(lastStep.data.visited).toContain('D')
  })

  it('starts with a visit step for the start node', () => {
    const steps = bfsSteps({ nodes, edges, startId: 'A' })
    expect(steps[0].type).toBe('visit')
    expect(steps[0].indices).toEqual(['A'])
    expect(steps[0].data.visited).toEqual(['A'])
  })

  it('marks edges as active during neighbor exploration', () => {
    const steps = bfsSteps({ nodes, edges, startId: 'A' })
    const compareSteps = steps.filter(s => s.type === 'compare')
    expect(compareSteps.length).toBeGreaterThan(0)
    // Each compare step should have an active edge
    compareSteps.forEach(step => {
      expect(step.data.activeEdgeIds).toBeDefined()
      expect(step.data.activeEdgeIds.length).toBe(1)
    })
  })

  it('handles isolated start node', () => {
    const isolated = [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
    ]
    const steps = bfsSteps({ nodes: isolated, edges: [], startId: 'A' })
    expect(steps.length).toBe(2)
    expect(steps[0].type).toBe('visit')
    expect(steps[1].type).toBe('final')
    expect(steps[1].data.visited).toEqual(['A'])
  })

  it('handles empty graph', () => {
    const steps = bfsSteps({ nodes: [], edges: [], startId: 'A' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
  })
})
