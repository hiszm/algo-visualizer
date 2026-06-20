import type { ReactNode } from 'react'
import styles from './AnimationStage.module.css'

interface AnimationStageProps {
  children: ReactNode
  message?: string
}

export default function AnimationStage({ children, message }: AnimationStageProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.canvas}>{children}</div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  )
}
