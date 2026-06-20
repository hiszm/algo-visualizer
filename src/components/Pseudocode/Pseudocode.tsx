import styles from './Pseudocode.module.css'

interface PseudocodeProps {
  code: string[]
  activeLine: number
}

export default function Pseudocode({ code, activeLine }: PseudocodeProps) {
  return (
    <pre className={styles.container}>
      {code.map((line, index) => (
        <div
          key={index}
          className={`${styles.line} ${index === activeLine ? styles.active : ''}`}
        >
          <span className={styles.lineNumber}>{index + 1}</span>
          <span>{line}</span>
        </div>
      ))}
    </pre>
  )
}
