import { useParams } from 'react-router-dom'

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>()
  return <div>Category Page: {categoryId}</div>
}
