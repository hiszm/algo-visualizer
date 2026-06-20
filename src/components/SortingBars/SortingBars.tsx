import styles from './SortingBars.module.css'

interface SortingBarsProps {
  array: number[]
  activeIndices: number[]
  stepType: string
}

export default function SortingBars({ array, activeIndices, stepType }: SortingBarsProps) {
  const max = Math.max(...array, 1)

  return (
    <div className={styles.container}>
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index)
        const height = (value / max) * 100
        let barClass = styles.bar
        if (isActive) {
          if (stepType === 'swap') {
            barClass += ` ${styles.swap}`
          } else if (stepType === 'final') {
            barClass += ` ${styles.final}`
          } else {
            barClass += ` ${styles.compare}`
          }
        }

        return (
          <div key={index} className={styles.barWrapper}>
            <div
              className={barClass}
              style={{ height: `${height}%` }}
            />
            <span className={styles.label}>{value}</span>
          </div>
        )
      })}
    </div>
  )
}
