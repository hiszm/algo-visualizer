import styles from './SearchList.module.css'

interface SearchListProps {
  array: number[]
  target: number
  activeIndices: number[]
  foundIndex: number | null
}

export default function SearchList({ array, target, activeIndices, foundIndex }: SearchListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.items}>
        {array.map((value, index) => {
          let itemClass = styles.item
          if (foundIndex === index) itemClass += ` ${styles.found}`
          else if (activeIndices.includes(index)) itemClass += ` ${styles.active}`

          return (
            <div key={index} className={itemClass}>
              {value}
            </div>
          )
        })}
      </div>
      <div className={styles.target}>目标值: {target}</div>
    </div>
  )
}
