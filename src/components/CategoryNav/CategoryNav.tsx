import { Link, useParams } from 'react-router-dom'
import { categories } from '@/data/categories'
import styles from './CategoryNav.module.css'

export default function CategoryNav() {
  const { categoryId } = useParams<{ categoryId: string }>()

  return (
    <div className={styles.nav}>
      {categories.filter(c => c.enabled).map(category => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`${styles.item} ${category.id === categoryId ? styles.active : ''}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
