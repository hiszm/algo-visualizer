import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Category from './pages/Category'
import AlgorithmDetail from './pages/AlgorithmDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category/:categoryId" element={<Category />} />
        <Route path="algorithm/:algorithmId" element={<AlgorithmDetail />} />
      </Route>
    </Routes>
  )
}
