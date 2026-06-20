import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { getAlgorithmById } from '@/data/algorithms'
import { useAlgorithmPlayer } from '@/hooks/useAlgorithmPlayer'
import SortingBars from '@/components/SortingBars/SortingBars'
import ControlBar from '@/components/ControlBar/ControlBar'
import AnimationStage from '@/components/AnimationStage/AnimationStage'
import InfoPanel from '@/components/InfoPanel/InfoPanel'
import styles from './AlgorithmDetail.module.css'

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = useMemo(() => getAlgorithmById(algorithmId || ''), [algorithmId])

  if (!algorithm) {
    return <Navigate to="/" replace />
  }

  const steps = useMemo(() => algorithm.generateSteps(algorithm.defaultInput), [algorithm])
  const {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    next,
    prev,
    setSpeed,
  } = useAlgorithmPlayer(steps)

  const step = steps[currentStep]
  const data = step?.data ?? { array: algorithm.defaultInput }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{algorithm.name}</h1>
      <p className={styles.description}>{algorithm.description}</p>

      <AnimationStage message={step?.message || '点击播放开始'}>
        <SortingBars
          array={data.array}
          activeIndices={(step?.indices as number[]) || []}
          stepType={step?.type || ''}
        />
      </AnimationStage>

      <div className={styles.controlWrapper}>
        <ControlBar
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={steps.length}
          speed={speed}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onNext={next}
          onPrev={prev}
          onSpeedChange={setSpeed}
        />
      </div>

      <InfoPanel algorithm={algorithm} activeLine={step?.pseudocodeLine ?? -1} />
    </div>
  )
}
