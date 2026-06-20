import type { Category } from '@/types/algorithm'

export const categories: Category[] = [
  { id: 'sorting', name: '排序算法', enabled: true },
  { id: 'searching', name: '搜索算法', enabled: true },
  { id: 'graph', name: '图算法', enabled: true },
  { id: 'math', name: '数学', enabled: false },
  { id: 'compression', name: '数据压缩', enabled: false },
  { id: 'security', name: '安全', enabled: false },
  { id: 'data-structure', name: '数据结构', enabled: false },
  { id: 'network', name: '网络', enabled: false },
  { id: 'recursion', name: '递归', enabled: false },
]
