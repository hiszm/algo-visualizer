import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { getAlgorithmById } from '@/data/algorithms'
import { useAlgorithmPlayer } from '@/hooks/useAlgorithmPlayer'
import SortingBars from '@/components/SortingBars/SortingBars'
import SearchList from '@/components/SearchList/SearchList'
import ControlBar from '@/components/ControlBar/ControlBar'
import AnimationStage from '@/components/AnimationStage/AnimationStage'
import InfoPanel from '@/components/InfoPanel/InfoPanel'
import GraphCanvas from '@/components/GraphCanvas/GraphCanvas'
import type { GraphNode, GraphEdge } from '@/lib/graphLayout'
import type { Algorithm, Step } from '@/types/algorithm'
import styles from './AlgorithmDetail.module.css'

function renderVisualization(algorithm: Algorithm, step: Step | undefined) {
  if (algorithm.renderer === 'sorting') {
    return (
      <SortingBars
        array={step?.data.array || algorithm.defaultInput}
        activeIndices={(step?.indices as number[]) || []}
        stepType={step?.type || ''}
      />
    )
  }

  if (algorithm.renderer === 'searching') {
    const data = step?.data || algorithm.defaultInput
    return (
      <SearchList
        array={data.array}
        target={data.target}
        activeIndices={(step?.indices as number[]) || []}
        foundIndex={data.foundIndex}
      />
    )
  }

  if (algorithm.renderer === 'graph') {
    const data = step?.data || algorithm.defaultInput
    return (
      <GraphCanvas
        nodes={data.nodes as GraphNode[]}
        edges={data.edges as GraphEdge[]}
        activeNodeIds={(step?.indices as string[]) || []}
        activeEdgeIds={data.activeEdgeIds || []}
      />
    )
  }

  return null
}

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{algorithm.name}</h1>
      <p className={styles.description}>{algorithm.description}</p>

      <AnimationStage message={step?.message || '点击播放开始'}>
        {renderVisualization(algorithm, step)}
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
