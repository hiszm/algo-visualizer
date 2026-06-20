export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type StepType = 'compare' | 'swap' | 'visit' | 'highlight' | 'final'

export interface Step {
  type: StepType
  indices: number[] | string[]
  pseudocodeLine: number
  message: string
  data: any
}

export interface Algorithm {
  id: string
  name: string
  categoryId: string
  description: string
  difficulty: Difficulty
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  defaultInput: any
  generateSteps: (input: any) => Step[]
  renderer: 'sorting' | 'searching' | 'graph' | 'number-pair' | 'run-length' | 'huffman-tree' | 'list-search' | 'info'
  extendedDescription?: string[]
}

export interface Category {
  id: string
  name: string
  enabled: boolean
}
