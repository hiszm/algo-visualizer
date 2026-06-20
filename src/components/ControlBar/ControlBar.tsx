import styles from './ControlBar.module.css'

interface ControlBarProps {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onNext: () => void
  onPrev: () => void
  onSpeedChange: (speed: number) => void
}

export default function ControlBar({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
  onSpeedChange,
}: ControlBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {isPlaying ? (
          <button onClick={onPause} className={styles.button}>暂停</button>
        ) : (
          <button onClick={onPlay} className={styles.button}>播放</button>
        )}
        <button onClick={onPrev} disabled={currentStep < 0} className={styles.button}>上一步</button>
        <button onClick={onNext} disabled={currentStep >= totalSteps - 1} className={styles.button}>下一步</button>
        <button onClick={onReset} className={styles.button}>重置</button>
      </div>
      <div className={styles.speed}>
        <span>间隔</span>
        <input
          type="range"
          min={100}
          max={1500}
          step={100}
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
        />
        <span>{speed}ms</span>
      </div>
      <div className={styles.progress}>
        步骤 {currentStep + 1} / {totalSteps}
      </div>
    </div>
  )
}
