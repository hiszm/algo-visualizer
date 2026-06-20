import { useParams } from 'react-router-dom'

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  return <div>Algorithm Detail: {algorithmId}</div>
}
