import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'
import CategoryNav from '@/components/CategoryNav/CategoryNav'
import AlgorithmCard from '@/components/AlgorithmCard/AlgorithmCard'
import styles from './Category.module.css'

const categoryDescriptions: Record<string, string> = {
  sorting: '掌握常用排序算法的执行过程与复杂度分析，从冒泡到快速排序一网打尽。',
  searching: '在有序与无序数据中查找目标值，理解线性搜索与二分搜索的核心差异。',
  graph: '遍历图结构并求解最短路径，直观感受 BFS、DFS、Dijkstra 等经典算法。',
}

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = useMemo(() => categories.find(c => c.id === categoryId), [categoryId])
  const categoryAlgorithms = useMemo(
    () => algorithms.filter(a => a.categoryId === categoryId),
    [categoryId]
  )

  if (!category || !category.enabled) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.container}>
      <CategoryNav />

      <section className={styles.hero}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.description}>{categoryDescriptions[category.id]}</p>
      </section>

      <h2 className={styles.sectionTitle}>算法列表</h2>
      <div className={styles.grid}>
        {categoryAlgorithms.map(algorithm => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>
    </div>
  )
}
