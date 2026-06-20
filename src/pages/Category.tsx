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
  math: '通过动画理解数学算法的基本思想，包括最大公约数与素性测试。',
  compression: '探索数据压缩的核心方法，观察游程编码与霍夫曼编码如何减少数据体积。',
  security: '了解现代密码学与安全通信的基础概念，从加密到数字签名逐步展开。',
  'data-structure': '学习基础数据结构的存储与查找方式，从列表的线性查找开始。',
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
