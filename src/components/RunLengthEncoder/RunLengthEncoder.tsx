import styles from './RunLengthEncoder.module.css'

interface RunLengthEncoderProps {
  original: string
  encoded: string
  activeIndex: number
  currentChar: string
  count: number
}

export default function RunLengthEncoder({
  original,
  encoded,
  activeIndex,
  currentChar,
  count,
}: RunLengthEncoderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.label}>原始字符串</div>
        <div className={styles.chars}>
          {original.split('').map((char, index) => (
            <div
              key={`${char}-${index}`}
              className={`${styles.char} ${index === activeIndex ? styles.active : ''}`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>当前连续段：{currentChar} × {count}</div>
        <div className={styles.encoded}>{encoded || '...'}</div>
      </div>
    </div>
  )
}
