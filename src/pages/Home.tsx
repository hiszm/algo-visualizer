import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'
import styles from './Home.module.css'

export default function Home() {
  const enabledCategories = categories.filter(c => c.enabled)

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>用动画理解每一个算法</h1>
        <p className={styles.heroSubtitle}>
          可视化、可控制、可学习。从排序到图算法，一步步看懂计算机科学的底层逻辑。
        </p>
        <Link to="/category/sorting" className={styles.cta}>
          开始学习
        </Link>
      </section>

      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>核心分类</h2>
        <div className={styles.grid}>
          {enabledCategories.map(category => (
            <Link key={category.id} to={`/category/${category.id}`} className={styles.card}>
              <h3 className={styles.cardTitle}>{category.name}</h3>
              <p className={styles.cardDesc}>
                {category.id === 'sorting' && '冒泡、选择、插入、堆、归并、快速排序'}
                {category.id === 'searching' && '线性搜索与二分搜索'}
                {category.id === 'graph' && 'BFS、DFS、Dijkstra、Bellman-Ford、A*'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
