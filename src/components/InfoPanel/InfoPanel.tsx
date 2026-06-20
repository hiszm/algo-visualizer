import type { Algorithm } from '@/types/algorithm'
import Pseudocode from '@/components/Pseudocode/Pseudocode'
import styles from './InfoPanel.module.css'

interface InfoPanelProps {
  algorithm: Algorithm
  activeLine: number
}

export default function InfoPanel({ algorithm, activeLine }: InfoPanelProps) {
  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3>原理</h3>
        <p>{algorithm.description}</p>
      </section>

      <section className={styles.section}>
        <h3>复杂度</h3>
        <div className={styles.complexity}>
          <div>
            <div className={styles.label}>时间复杂度</div>
            <div>{algorithm.timeComplexity}</div>
          </div>
          <div>
            <div className={styles.label}>空间复杂度</div>
            <div>{algorithm.spaceComplexity}</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>伪代码</h3>
        <Pseudocode code={algorithm.pseudocode} activeLine={activeLine} />
      </section>
    </div>
  )
}
