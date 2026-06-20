import { describe, it, expect } from 'vitest'
import { dfsSteps } from '../dfs'

describe('dfsSteps', () => {
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

  it('visits all nodes from start in DFS order', () => {
    const steps = dfsSteps({ nodes, edges, startId: 'A' })
    const lastStep = steps[steps.length - 1]
    expect(lastStep.type).toBe('final')
    expect(lastStep.data.visited).toContain('A')
    expect(lastStep.data.visited).toContain('B')
    expect(lastStep.data.visited).toContain('C')
    expect(lastStep.data.visited).toContain('D')
  })

  it('starts with a visit step for the start node', () => {
    const steps = dfsSteps({ nodes, edges, startId: 'A' })
    expect(steps[0].type).toBe('visit')
    expect(steps[0].indices).toEqual(['A'])
    expect(steps[0].data.visited).toEqual(['A'])
  })

  it('marks edges as active during neighbor exploration', () => {
    const steps = dfsSteps({ nodes, edges, startId: 'A' })
    const compareSteps = steps.filter(s => s.type === 'compare')
    expect(compareSteps.length).toBeGreaterThan(0)
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
    const steps = dfsSteps({ nodes: isolated, edges: [], startId: 'A' })
    expect(steps.length).toBe(2)
    expect(steps[0].type).toBe('visit')
    expect(steps[1].type).toBe('final')
    expect(steps[1].data.visited).toEqual(['A'])
  })

  it('handles empty graph', () => {
    const steps = dfsSteps({ nodes: [], edges: [], startId: 'A' })
    expect(steps.length).toBe(1)
    expect(steps[0].type).toBe('final')
  })

  it('visits deeper nodes before siblings in DFS', () => {
    // A -> B -> D, A -> C
    // DFS from A should reach D before C (or C before D depending on adj order)
    // With our adjacency list (A: [B, C]), DFS should go A -> B -> D -> C
    const steps = dfsSteps({ nodes, edges, startId: 'A' })
    // We just verify D is visited before C in the visited set progression
    const finalVisited = steps[steps.length - 1].data.visited
    expect(finalVisited).toEqual(['A', 'B', 'D', 'C'])
  })
})
