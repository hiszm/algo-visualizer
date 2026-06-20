import styles from './NumberPair.module.css'

interface NumberPairProps {
  a: number
  b: number
  quotient?: number | null
  remainder?: number | null
  activeField?: string | null
  stepType?: string
}

export default function NumberPair({
  a,
  b,
  quotient,
  remainder,
  activeField,
  stepType = '',
}: NumberPairProps) {
  const fieldClass = (field: string) => {
    const isActive = activeField === field
    const isFinal = stepType === 'final'
    return `${styles.field} ${isActive ? styles.active : ''} ${isFinal && isActive ? styles.final : ''}`
  }

  const extraFieldClass = (field: string) => {
    return `${styles.extraField} ${activeField === field ? styles.active : ''}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.pair}>
        <div className={fieldClass('a')}>
          <span className={styles.label}>a</span>
          <span className={styles.value}>{a}</span>
        </div>
        <div className={styles.operator}>%</div>
        <div className={fieldClass('b')}>
          <span className={styles.label}>b</span>
          <span className={styles.value}>{b}</span>
        </div>
      </div>

      {(quotient !== undefined || remainder !== undefined) && (
        <div className={styles.extra}>
          {quotient !== undefined && quotient !== null && (
            <div className={extraFieldClass('quotient')}>
              <span className={styles.label}>商</span>
              <span className={styles.value}>{quotient}</span>
            </div>
          )}
          {remainder !== undefined && remainder !== null && (
            <div className={extraFieldClass('remainder')}>
              <span className={styles.label}>余数</span>
              <span className={styles.value}>{remainder}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
