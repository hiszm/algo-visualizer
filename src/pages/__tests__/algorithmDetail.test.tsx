import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AlgorithmDetail from '@/pages/AlgorithmDetail'
import { algorithms } from '@/data/algorithms'

describe('AlgorithmDetail renders without crashing', () => {
  const newAlgorithmIds = [
    'euclidean-gcd',
    'primality-test',
    'run-length-encoding',
    'huffman-coding',
    'list-search',
    'security-basics',
    'encryption-basics',
    'hash-function',
    'symmetric-key',
    'public-key',
    'hybrid-encryption',
    'diffie-hellman',
    'mac',
    'digital-signature',
    'digital-certificate',
  ]

  newAlgorithmIds.forEach(id => {
    it(`renders ${id}`, () => {
      const algorithm = algorithms.find(a => a.id === id)
      expect(algorithm).toBeDefined()

      render(
        <MemoryRouter initialEntries={[`/algorithm/${id}`]}>
          <Routes>
            <Route path="/algorithm/:algorithmId" element={<AlgorithmDetail />} />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByRole('heading', { name: algorithm!.name })).toBeTruthy()
    })
  })
})
