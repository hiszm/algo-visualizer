import { Link } from 'react-router-dom'
import type { Algorithm } from '@/types/algorithm'
import styles from './AlgorithmCard.module.css'

interface AlgorithmCardProps {
  algorithm: Algorithm
}

export default function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const difficultyMap = {
    beginner: { text: '入门', class: styles.beginner },
    intermediate: { text: '进阶', class: styles.intermediate },
    advanced: { text: '高级', class: styles.advanced },
  }
  const difficulty = difficultyMap[algorithm.difficulty] || { text: algorithm.difficulty, class: '' }

  return (
    <Link to={`/algorithm/${algorithm.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{algorithm.name}</h3>
        <span className={`${styles.tag} ${difficulty.class}`}>{difficulty.text}</span>
      </div>
      <p className={styles.description}>{algorithm.description}</p>
    </Link>
  )
}
