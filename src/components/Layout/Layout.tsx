import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          算法动画图解
        </Link>
        <nav className={styles.nav}>
          <Link to="/category/sorting">排序</Link>
          <Link to="/category/searching">搜索</Link>
          <Link to="/category/graph">图算法</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
