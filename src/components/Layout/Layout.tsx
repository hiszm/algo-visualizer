import { Link, Outlet } from 'react-router-dom'
import { categories } from '@/data/categories'
import styles from './Layout.module.css'

export default function Layout() {
  const enabledCategories = categories.filter(c => c.enabled)

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          算法动画图解
        </Link>
        <nav className={styles.nav}>
          {enabledCategories.map(category => (
            <Link key={category.id} to={`/category/${category.id}`}>{category.name}</Link>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
