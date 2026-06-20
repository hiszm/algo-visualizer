import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'
import CategoryNav from '@/components/CategoryNav/CategoryNav'
import AlgorithmCard from '@/components/AlgorithmCard/AlgorithmCard'
import styles from './Category.module.css'

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
    <div>
      <CategoryNav />
      <h1 className={styles.title}>{category.name}</h1>
      <div className={styles.grid}>
        {categoryAlgorithms.map(algorithm => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>
    </div>
  )
}
