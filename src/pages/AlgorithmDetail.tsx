import { useParams, Navigate, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getAlgorithmById } from '@/data/algorithms'
import { useAlgorithmPlayer } from '@/hooks/useAlgorithmPlayer'
import SortingBars from '@/components/SortingBars/SortingBars'
import SearchList from '@/components/SearchList/SearchList'
import ControlBar from '@/components/ControlBar/ControlBar'
import AnimationStage from '@/components/AnimationStage/AnimationStage'
import InfoPanel from '@/components/InfoPanel/InfoPanel'
import GraphCanvas from '@/components/GraphCanvas/GraphCanvas'
import NumberPair from '@/components/NumberPair/NumberPair'
import RunLengthEncoder from '@/components/RunLengthEncoder/RunLengthEncoder'
import HuffmanTree from '@/components/HuffmanTree/HuffmanTree'
import type { GraphNode, GraphEdge } from '@/lib/graphLayout'
import type { Algorithm, Step } from '@/types/algorithm'
import styles from './AlgorithmDetail.module.css'

const categoryNames: Record<string, string> = {
  sorting: '排序',
  searching: '搜索',
  graph: '图论',
  math: '数学',
  compression: '数据压缩',
  security: '安全',
  'data-structure': '数据结构',
}

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

  if (algorithm.renderer === 'number-pair') {
    const data = step?.data || algorithm.defaultInput
    return (
      <NumberPair
        a={data.a ?? data.n}
        b={data.b ?? data.divisor}
        quotient={data.quotient}
        remainder={data.remainder}
        activeField={(step?.indices as string[] | undefined)?.[0] || null}
        stepType={step?.type || ''}
      />
    )
  }

  if (algorithm.renderer === 'run-length') {
    const data = step?.data || algorithm.defaultInput
    return (
      <RunLengthEncoder
        original={data.original}
        encoded={data.encoded}
        activeIndex={(step?.indices as number[] | undefined)?.[0] ?? -1}
        currentChar={data.currentChar}
        count={data.count}
      />
    )
  }

  if (algorithm.renderer === 'huffman-tree') {
    const data = step?.data || algorithm.defaultInput
    return (
      <HuffmanTree
        nodes={data.nodes || []}
        activeNodeIds={(step?.indices as string[]) || []}
        codes={data.codes || {}}
      />
    )
  }

  if (algorithm.renderer === 'list-search') {
    const data = step?.data || algorithm.defaultInput
    return (
      <SearchList
        array={data.list}
        target={data.target}
        activeIndices={(step?.indices as number[]) || []}
        foundIndex={data.foundIndex}
      />
    )
  }

  if (algorithm.renderer === 'info') {
    return null
  }

  return null
}

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = useMemo(() => getAlgorithmById(algorithmId || ''), [algorithmId])
  const steps = useMemo(() => algorithm?.generateSteps(algorithm.defaultInput) || [], [algorithm])
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

  if (!algorithm) {
    return <Navigate to="/" replace />
  }

  const step = steps[currentStep]
  const isInfoOnly = algorithm.renderer === 'info'

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.breadcrumbs}>
          <Link to="/">首页</Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <Link to={`/category/${algorithm.categoryId}`}>{categoryNames[algorithm.categoryId] || algorithm.categoryId}</Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span>{algorithm.name}</span>
        </div>
        <h1 className={styles.title}>{algorithm.name}</h1>
        <p className={styles.description}>{algorithm.description}</p>
      </section>

      <div className={styles.content}>
        <div className={styles.stageColumn}>
          {!isInfoOnly && (
            <>
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
            </>
          )}

          {isInfoOnly && (
            <div className={styles.infoOnlyStage}>
              <p className={styles.infoOnlyMessage}>{algorithm.description}</p>
              {algorithm.extendedDescription && (
                <div className={styles.infoOnlyContent}>
                  {algorithm.extendedDescription.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.infoColumn}>
          <InfoPanel algorithm={algorithm} activeLine={step?.pseudocodeLine ?? -1} />
        </div>
      </div>
    </div>
  )
}
