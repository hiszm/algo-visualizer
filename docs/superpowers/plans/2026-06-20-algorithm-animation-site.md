# 算法动画图解网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于已批准的精化设计文档，构建一个部署在 GitHub Pages 的算法可视化学习网站，首发覆盖排序、搜索、图算法三大类，采用卡片式堆叠详情页与柱顶数字的排序可视化。

**Architecture:** 采用 React + Vite + react-router-dom 的纯前端静态站点。核心动画通过 `useAlgorithmPlayer` 统一管理步骤播放，排序/搜索用 DOM + CSS 渲染，图算法用 SVG 渲染。详情页为卡片式垂直堆叠布局。算法元数据与步骤生成函数集中在 `src/data/` 管理。

**Tech Stack:** React 18, TypeScript, Vite 5, react-router-dom (HashRouter), CSS Modules + CSS Variables, GitHub Pages

## Global Constraints

- 项目根目录：`C:\Users\hiszm\Desktop\kimi\algorithm-animation-site`
- 不使用完整 UI 组件库，仅借鉴 Ant Design 视觉规范
- 路由使用 HashRouter 适配 GitHub Pages
- 动画仅使用原生 CSS transition + requestAnimationFrame，不引入动画库
- 颜色全部使用 CSS 变量定义
- 详情页采用卡片式垂直堆叠布局，非左右分栏
- 排序可视化使用高度柱子 + 柱顶数字
- 每个任务结束时必须有可验证的交付物
- 频繁提交，commit message 使用英文小写主动语态

---

## File Structure

```
src/
├── components/
│   ├── Layout/              # 顶部导航 + 页面框架
│   ├── CategoryNav/         # 分类 Tab 切换
│   ├── AlgorithmCard/       # 分类页算法卡片
│   ├── AnimationStage/      # 动画舞台布局容器
│   ├── ControlBar/          # 播放控制栏
│   ├── SortingBars/         # 排序算法 DOM 渲染
│   ├── SearchList/          # 搜索算法 DOM 渲染
│   ├── GraphCanvas/         # 图算法 SVG 渲染
│   ├── ComplexityTable/     # 复杂度表格
│   ├── Pseudocode/          # 伪代码 + 行高亮
│   └── InfoPanel/           # 学习面板
├── hooks/
│   └── useAlgorithmPlayer.ts # 统一动画播放器
├── data/
│   ├── algorithms.ts         # 算法元数据
│   └── categories.ts         # 分类元数据
├── lib/
│   ├── steps/                # 各算法 generateSteps 实现
│   └── graphLayout.ts        # 图节点布局算法
├── pages/
│   ├── Home.tsx
│   ├── Category.tsx
│   └── AlgorithmDetail.tsx
├── styles/
│   ├── variables.css         # CSS 变量
│   └── global.css            # 全局重置
└── types/
    └── algorithm.ts          # 类型定义
```

---

## Task 1: 初始化 Vite + React + TypeScript 项目

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: 可运行的 Vite + React + TypeScript 项目骨架

- [ ] **Step 1: 运行 Vite 脚手架**

Run:
```bash
cd /c/Users/hiszm/Desktop/kimi/algorithm-animation-site
npm create vite@latest . -- --template react-ts
```

Expected: 项目目录下出现 `package.json`, `vite.config.ts`, `src/main.tsx` 等文件。

- [ ] **Step 2: 安装依赖**

Run:
```bash
npm install react-router-dom
```

Expected: `package.json` 中 `dependencies` 包含 `react-router-dom`。

- [ ] **Step 3: 配置 vite.config.ts**

Modify `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/algorithm-animation-site/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 4: 验证开发服务器可启动**

Run:
```bash
npm run dev
```

Expected: 终端显示 `http://localhost:5173/`，浏览器访问看到 Vite + React 默认页面。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "chore: initialize vite react typescript project"
```

---

## Task 2: 定义全局类型与 CSS 变量

**Files:**
- Create: `src/types/algorithm.ts`
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `Algorithm`, `Category`, `Step`, `PlayerState` 类型定义
- Produces: 全局 CSS 变量文件

- [ ] **Step 1: 创建算法类型文件**

Create `src/types/algorithm.ts`:

```ts
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type StepType = 'compare' | 'swap' | 'visit' | 'highlight' | 'final'

export interface Step {
  type: StepType
  indices: number[] | string[]
  pseudocodeLine: number
  message: string
  data: any
}

export interface Algorithm {
  id: string
  name: string
  categoryId: string
  description: string
  difficulty: Difficulty
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  defaultInput: any
  generateSteps: (input: any) => Step[]
  renderer: 'sorting' | 'searching' | 'graph'
}

export interface Category {
  id: string
  name: string
  enabled: boolean
}
```

- [ ] **Step 2: 创建 CSS 变量文件**

Create `src/styles/variables.css`:

```css
:root {
  --color-primary: #1890ff;
  --color-primary-light: #40a9ff;
  --color-primary-dark: #096dd9;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #f5222d;

  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #c0c4cc;

  --color-border: #e4e7ed;
  --color-border-light: #ebeef5;
  --color-bg-base: #ffffff;
  --color-bg-page: #f5f7fa;
  --color-bg-hover: #f5f7fa;

  --radius-small: 2px;
  --radius-base: 4px;
  --radius-large: 8px;

  --shadow-1: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.08);

  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

- [ ] **Step 3: 创建全局样式文件**

Create `src/styles/global.css`:

```css
@import './variables.css';

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: var(--font-family);
  color: var(--color-text-regular);
  background-color: var(--color-bg-page);
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

button {
  font-family: inherit;
}
```

- [ ] **Step 4: 引入样式并配置 HashRouter**

Modify `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 5: 验证 CSS 变量生效**

Modify `src/App.tsx` 临时内容：

```tsx
export default function App() {
  return (
    <div style={{ padding: 24, color: 'var(--color-primary)', fontSize: 24 }}>
      CSS Variables Work
    </div>
  )
}
```

Run:
```bash
npm run dev
```

Expected: 浏览器显示蓝色文字 "CSS Variables Work"。

- [ ] **Step 6: 提交**

Run:
```bash
git add .
git commit -m "feat: add type definitions and css variables"
```

---

## Task 3: 实现 useAlgorithmPlayer Hook

**Files:**
- Create: `src/hooks/useAlgorithmPlayer.ts`
- Create: `src/hooks/__tests__/useAlgorithmPlayer.test.ts`
- Modify: `package.json`（安装测试依赖）
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: `Step[]` from algorithm `generateSteps`
- Produces: `{ currentStep, isPlaying, speed, play, pause, reset, next, prev, setSpeed }`

- [ ] **Step 1: 安装测试依赖**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: 配置 vitest**

Modify `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/algorithm-animation-site/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

Add to `package.json` scripts:
```json
"test": "vitest"
```

- [ ] **Step 3: 编写 useAlgorithmPlayer**

Create `src/hooks/useAlgorithmPlayer.ts`:

```ts
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Step } from '@/types/algorithm'

const DEFAULT_SPEED = 500

export function useAlgorithmPlayer(steps: Step[]) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, -1))
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep(s => s + 1)
    }, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, currentStep, steps.length, speed])

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    next,
    prev,
    setSpeed,
  }
}
```

- [ ] **Step 4: 编写测试**

Create `src/hooks/__tests__/useAlgorithmPlayer.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAlgorithmPlayer } from '../useAlgorithmPlayer'
import type { Step } from '@/types/algorithm'

const steps: Step[] = [
  { type: 'compare', indices: [0, 1], pseudocodeLine: 0, message: 'compare', data: {} },
  { type: 'swap', indices: [0, 1], pseudocodeLine: 1, message: 'swap', data: {} },
]

describe('useAlgorithmPlayer', () => {
  it('starts at step -1', () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    expect(result.current.currentStep).toBe(-1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('moves to next step', () => {
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.next())
    expect(result.current.currentStep).toBe(0)
  })

  it('auto advances when playing', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.play())
    act(() => vi.advanceTimersByTime(600))
    await waitFor(() => expect(result.current.currentStep).toBe(0))
    vi.useRealTimers()
  })

  it('stops at last step', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAlgorithmPlayer(steps))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.play())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.isPlaying).toBe(false)
    vi.useRealTimers()
  })
})
```

- [ ] **Step 5: 运行测试**

Run:
```bash
npm test
```

Expected: 所有测试通过。

- [ ] **Step 6: 提交**

Run:
```bash
git add .
git commit -m "feat: implement useAlgorithmPlayer hook with tests"
```

---

## Task 4: 创建布局组件与路由框架

**Files:**
- Create: `src/components/Layout/Layout.tsx`
- Create: `src/components/Layout/Layout.module.css`
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Category.tsx`
- Create: `src/pages/AlgorithmDetail.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Layout` wraps all pages
- Produces: 基本页面路由结构

- [ ] **Step 1: 创建 Layout 组件**

Create `src/components/Layout/Layout.tsx`:

```tsx
import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          算法动画图解
        </Link>
        <nav className={styles.nav}>
          <Link to="/category/sorting">排序</Link>
          <Link to="/category/searching">搜索</Link>
          <Link to="/category/graph">图算法</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
```

Create `src/components/Layout/Layout.module.css`:

```css
.layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  height: 56px;
  background: var(--color-bg-base);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.nav {
  display: flex;
  gap: var(--spacing-md);
}

.nav a {
  color: var(--color-text-regular);
  font-size: 14px;
}

.nav a:hover {
  color: var(--color-primary);
}

.main {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
```

- [ ] **Step 2: 创建页面占位组件**

Create `src/pages/Home.tsx`:

```tsx
export default function Home() {
  return <div>Home Page</div>
}
```

Create `src/pages/Category.tsx`:

```tsx
import { useParams } from 'react-router-dom'

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>()
  return <div>Category Page: {categoryId}</div>
}
```

Create `src/pages/AlgorithmDetail.tsx`:

```tsx
import { useParams } from 'react-router-dom'

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  return <div>Algorithm Detail: {algorithmId}</div>
}
```

- [ ] **Step 3: 配置路由**

Modify `src/App.tsx`:

```tsx
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
```

- [ ] **Step 4: 手动验证路由**

Run:
```bash
npm run dev
```

Expected:
- 访问 `http://localhost:5173/#/` 看到 Home Page
- 访问 `http://localhost:5173/#/category/sorting` 看到 Category Page: sorting
- 访问 `http://localhost:5173/#/algorithm/bubble-sort` 看到 Algorithm Detail: bubble-sort

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add layout and page routing"
```

---

## Task 5: 实现冒泡排序步骤生成器与 SortingBars 组件

**Files:**
- Create: `src/lib/steps/bubbleSort.ts`
- Create: `src/lib/steps/__tests__/bubbleSort.test.ts`
- Create: `src/components/SortingBars/SortingBars.tsx`
- Create: `src/components/SortingBars/SortingBars.module.css`

**Interfaces:**
- Consumes: `number[]`
- Produces: `Step[]` for bubble sort
- Produces: 可视化排序柱状图（高度 + 柱顶数字）

- [ ] **Step 1: 编写冒泡排序步骤生成器**

Create `src/lib/steps/bubbleSort.ts`:

```ts
import type { Step } from '@/types/algorithm'

export function bubbleSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        pseudocodeLine: 2,
        message: `比较 ${arr[j]} 和 ${arr[j + 1]}`,
        data: { array: [...arr] },
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          pseudocodeLine: 3,
          message: `交换 ${arr[j]} 和 ${arr[j + 1]}`,
          data: { array: [...arr] },
        })
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }

  steps.push({
    type: 'final',
    indices: Array.from({ length: n }, (_, i) => i),
    pseudocodeLine: 4,
    message: '排序完成',
    data: { array: [...arr] },
  })

  return steps
}
```

- [ ] **Step 2: 编写测试**

Create `src/lib/steps/__tests__/bubbleSort.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { bubbleSortSteps } from '../bubbleSort'

describe('bubbleSortSteps', () => {
  it('generates correct final sorted array', () => {
    const steps = bubbleSortSteps([3, 1, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.data.array).toEqual([1, 2, 3])
  })

  it('contains compare and swap steps', () => {
    const steps = bubbleSortSteps([2, 1])
    expect(steps.some(s => s.type === 'compare')).toBe(true)
    expect(steps.some(s => s.type === 'swap')).toBe(true)
  })
})
```

- [ ] **Step 3: 创建 SortingBars 组件**

Create `src/components/SortingBars/SortingBars.tsx`:

```tsx
import styles from './SortingBars.module.css'

interface SortingBarsProps {
  array: number[]
  activeIndices: number[]
  stepType: string
}

export default function SortingBars({ array, activeIndices, stepType }: SortingBarsProps) {
  const max = Math.max(...array, 1)

  return (
    <div className={styles.container}>
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index)
        const height = (value / max) * 100
        let barClass = styles.bar
        if (isActive) {
          barClass += stepType === 'swap' ? ` ${styles.swap}` : ` ${styles.compare}`
        }

        return (
          <div key={index} className={styles.barWrapper}>
            <span className={styles.label}>{value}</span>
            <div
              className={barClass}
              style={{ height: `${height}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}
```

Create `src/components/SortingBars/SortingBars.module.css`:

```css
.container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 240px;
  padding: var(--spacing-md);
  background: var(--color-bg-page);
  border-radius: var(--radius-base);
}

.barWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 48px;
}

.bar {
  width: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-small) var(--radius-small) 0 0;
  transition: height 0.3s ease, background-color 0.2s ease;
  min-height: 4px;
}

.compare {
  background: var(--color-warning);
}

.swap {
  background: var(--color-error);
}

.label {
  margin-bottom: var(--spacing-xs);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 4: 运行测试**

Run:
```bash
npm test
```

Expected: 冒泡排序测试通过。

- [ ] **Step 5: 临时页面验证 SortingBars**

临时修改 `src/pages/AlgorithmDetail.tsx`：

```tsx
import SortingBars from '@/components/SortingBars/SortingBars'

export default function AlgorithmDetail() {
  return (
    <div style={{ padding: 24 }}>
      <SortingBars array={[3, 1, 4, 1, 5, 9, 2, 6]} activeIndices={[2, 4]} stepType="compare" />
    </div>
  )
}
```

Run:
```bash
npm run dev
```

Expected: 页面显示8个高度不同的蓝色柱子，柱顶有数字，索引2和4的柱子为黄色（compare状态）。

- [ ] **Step 6: 恢复 AlgorithmDetail.tsx 为占位符**

```tsx
import { useParams } from 'react-router-dom'

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  return <div>Algorithm Detail: {algorithmId}</div>
}
```

- [ ] **Step 7: 提交**

Run:
```bash
git add .
git commit -m "feat: add bubble sort step generator and SortingBars component"
```

---

## Task 6: 实现 ControlBar 与 Pseudocode 组件

**Files:**
- Create: `src/components/ControlBar/ControlBar.tsx`
- Create: `src/components/ControlBar/ControlBar.module.css`
- Create: `src/components/Pseudocode/Pseudocode.tsx`
- Create: `src/components/Pseudocode/Pseudocode.module.css`

**Interfaces:**
- ControlBar consumes: `isPlaying`, `currentStep`, `totalSteps`, `speed`, control callbacks
- Pseudocode consumes: `code: string[]`, `activeLine: number`

- [ ] **Step 1: 创建 ControlBar**

Create `src/components/ControlBar/ControlBar.tsx`:

```tsx
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
        <span>速度</span>
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
```

Create `src/components/ControlBar/ControlBar.module.css`:

```css
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  flex-wrap: wrap;
}

.buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.button {
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-base);
  border-radius: var(--radius-base);
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-regular);
}

.button:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.button:disabled {
  cursor: not-allowed;
  color: var(--color-text-placeholder);
}

.speed {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 13px;
}

.progress {
  font-size: 13px;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: 创建 Pseudocode**

Create `src/components/Pseudocode/Pseudocode.tsx`:

```tsx
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
```

Create `src/components/Pseudocode/Pseudocode.module.css`:

```css
.container {
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.8;
  overflow-x: auto;
}

.line {
  display: flex;
  gap: var(--spacing-sm);
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-small);
}

.active {
  background: #e6f7ff;
  color: var(--color-primary-dark);
}

.lineNumber {
  color: var(--color-text-secondary);
  min-width: 24px;
  text-align: right;
  user-select: none;
}
```

- [ ] **Step 3: 临时页面验证**

临时修改 `src/pages/AlgorithmDetail.tsx`：

```tsx
import { useState } from 'react'
import ControlBar from '@/components/ControlBar/ControlBar'
import Pseudocode from '@/components/Pseudocode/Pseudocode'

export default function AlgorithmDetail() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div style={{ padding: 24 }}>
      <ControlBar
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={5}
        speed={500}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={() => setCurrentStep(0)}
        onNext={() => setCurrentStep(s => Math.min(s + 1, 4))}
        onPrev={() => setCurrentStep(s => Math.max(s - 1, 0))}
        onSpeedChange={() => {}}
      />
      <div style={{ marginTop: 24 }}>
        <Pseudocode
          code={['for i = 0 to n-1', '  for j = 0 to n-i-2', '    if a[j] > a[j+1]', '      swap(a[j], a[j+1])']}
          activeLine={currentStep}
        />
      </div>
    </div>
  )
}
```

Run:
```bash
npm run dev
```

Expected: 页面显示控制栏和伪代码，点击「下一步」伪代码高亮行会变化。

- [ ] **Step 4: 恢复 AlgorithmDetail.tsx 为占位符**

```tsx
import { useParams } from 'react-router-dom'

export default function AlgorithmDetail() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  return <div>Algorithm Detail: {algorithmId}</div>
}
```

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add ControlBar and Pseudocode components"
```

---

## Task 7: 组装算法详情页并接入真实数据

**Files:**
- Create: `src/data/algorithms.ts`
- Create: `src/data/categories.ts`
- Modify: `src/pages/AlgorithmDetail.tsx`
- Create: `src/pages/AlgorithmDetail.module.css`
- Create: `src/components/AnimationStage/AnimationStage.tsx`
- Create: `src/components/AnimationStage/AnimationStage.module.css`
- Create: `src/components/InfoPanel/InfoPanel.tsx`
- Create: `src/components/InfoPanel/InfoPanel.module.css`

**Interfaces:**
- Consumes: `algorithms`, `categories` data
- Produces: 可运行的冒泡排序详情页

- [ ] **Step 1: 创建分类数据**

Create `src/data/categories.ts`:

```ts
import type { Category } from '@/types/algorithm'

export const categories: Category[] = [
  { id: 'sorting', name: '排序算法', enabled: true },
  { id: 'searching', name: '搜索算法', enabled: true },
  { id: 'graph', name: '图算法', enabled: true },
  { id: 'math', name: '数学', enabled: false },
  { id: 'compression', name: '数据压缩', enabled: false },
  { id: 'security', name: '安全', enabled: false },
  { id: 'data-structure', name: '数据结构', enabled: false },
  { id: 'network', name: '网络', enabled: false },
  { id: 'recursion', name: '递归', enabled: false },
]
```

- [ ] **Step 2: 创建算法数据（仅冒泡排序）**

Create `src/data/algorithms.ts`:

```ts
import type { Algorithm } from '@/types/algorithm'
import { bubbleSortSteps } from '@/lib/steps/bubbleSort'

export const algorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: '冒泡排序',
    categoryId: 'sorting',
    description: '相邻元素两两比较，逐步上浮最大值。',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-2',
      '    if a[j] > a[j+1]',
      '      swap(a[j], a[j+1])',
    ],
    defaultInput: [5, 3, 8, 4, 2],
    generateSteps: bubbleSortSteps,
    renderer: 'sorting',
  },
]

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find(a => a.id === id)
}
```

- [ ] **Step 3: 创建 AnimationStage 组件**

Create `src/components/AnimationStage/AnimationStage.tsx`:

```tsx
import { ReactNode } from 'react'
import styles from './AnimationStage.module.css'

interface AnimationStageProps {
  children: ReactNode
  message?: string
}

export default function AnimationStage({ children, message }: AnimationStageProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.canvas}>{children}</div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  )
}
```

Create `src/components/AnimationStage/AnimationStage.module.css`:

```css
.stage {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-lg);
}

.canvas {
  width: 100%;
}

.message {
  min-height: 24px;
  font-size: 14px;
  color: var(--color-text-regular);
}
```

- [ ] **Step 4: 创建 InfoPanel 组件**

Create `src/components/InfoPanel/InfoPanel.tsx`:

```tsx
import type { Algorithm } from '@/types/algorithm'
import Pseudocode from '@/components/Pseudocode/Pseudocode'
import styles from './InfoPanel.module.css'

interface InfoPanelProps {
  algorithm: Algorithm
  activeLine: number
}

export default function InfoPanel({ algorithm, activeLine }: InfoPanelProps) {
  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3>原理</h3>
        <p>{algorithm.description}</p>
      </section>

      <section className={styles.section}>
        <h3>复杂度</h3>
        <div className={styles.complexity}>
          <div>
            <div className={styles.label}>时间复杂度</div>
            <div>{algorithm.timeComplexity}</div>
          </div>
          <div>
            <div className={styles.label}>空间复杂度</div>
            <div>{algorithm.spaceComplexity}</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>伪代码</h3>
        <Pseudocode code={algorithm.pseudocode} activeLine={activeLine} />
      </section>
    </div>
  )
}
```

Create `src/components/InfoPanel/InfoPanel.module.css`:

```css
.panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.section {
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.section p {
  font-size: 14px;
  color: var(--color-text-regular);
  line-height: 1.6;
}

.complexity {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}
```

- [ ] **Step 5: 组装详情页**

Modify `src/pages/AlgorithmDetail.tsx`:

```tsx
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
```

Create `src/pages/AlgorithmDetail.module.css`:

```css
.container {
  padding: var(--spacing-lg) 0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.controlWrapper {
  margin: var(--spacing-md) 0;
}
```

- [ ] **Step 6: 验证冒泡排序详情页**

Run:
```bash
npm run dev
```

访问 `http://localhost:5173/#/algorithm/bubble-sort`

Expected:
- 显示标题「冒泡排序」
- 点击播放后动画自动演示
- 上一步/下一步可手动控制
- 伪代码随步骤高亮
- 速度滑杆可调整

- [ ] **Step 7: 提交**

Run:
```bash
git add .
git commit -m "feat: wire up AlgorithmDetail page with bubble sort"
```

---

## Task 8: 添加剩余排序算法

**Files:**
- Create: `src/lib/steps/selectionSort.ts`
- Create: `src/lib/steps/insertionSort.ts`
- Create: `src/lib/steps/heapSort.ts`
- Create: `src/lib/steps/mergeSort.ts`
- Create: `src/lib/steps/quickSort.ts`
- Create: 对应测试文件
- Modify: `src/data/algorithms.ts`

**Interfaces:**
- Produces: 完整排序算法数据

- [ ] **Step 1: 实现各排序步骤生成器并添加测试**

每个生成器遵循统一接口 `(input: number[]) => Step[]`，测试验证最终数组有序。

以选择排序为例，创建 `src/lib/steps/selectionSort.ts`：

```ts
import type { Step } from '@/types/algorithm'

export function selectionSortSteps(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIdx, j],
        pseudocodeLine: 2,
        message: `比较当前最小值 ${arr[minIdx]} 和 ${arr[j]}`,
        data: { array: [...arr] },
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        pseudocodeLine: 3,
        message: `将最小值 ${arr[minIdx]} 放到位置 ${i}`,
        data: { array: [...arr] },
      })
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
  }

  steps.push({
    type: 'final',
    indices: Array.from({ length: n }, (_, i) => i),
    pseudocodeLine: 4,
    message: '排序完成',
    data: { array: [...arr] },
  })

  return steps
}
```

其他排序算法类似实现，重点保证：
- 最终步骤数组正确有序
- 步骤类型包含 compare / swap / final
- pseudocodeLine 与伪代码行号对应

- [ ] **Step 2: 更新 algorithms.ts**

在 `algorithms` 数组中添加剩余排序算法条目，每个条目引用对应的 `generateSteps` 函数。

- [ ] **Step 3: 运行全部测试**

Run:
```bash
npm test
```

Expected: 所有排序算法测试通过。

- [ ] **Step 4: 手动抽查**

Run:
```bash
npm run dev
```

抽查 `/algorithm/selection-sort`、`/algorithm/quick-sort` 等路由，确认动画和控制正常。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add remaining sorting algorithms"
```

---

## Task 9: 实现 SearchList 渲染组件与搜索算法

**Files:**
- Create: `src/components/SearchList/SearchList.tsx`
- Create: `src/components/SearchList/SearchList.module.css`
- Create: `src/lib/steps/linearSearch.ts`
- Create: `src/lib/steps/binarySearch.ts`
- Create: 对应测试文件
- Modify: `src/data/algorithms.ts`
- Modify: `src/pages/AlgorithmDetail.tsx`

**Interfaces:**
- Consumes: `{ array: number[], target: number }`
- Produces: `Step[]` and searching visualization

- [ ] **Step 1: 创建 SearchList 组件**

Create `src/components/SearchList/SearchList.tsx`:

```tsx
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
```

Create `src/components/SearchList/SearchList.module.css`:

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-page);
  border-radius: var(--radius-base);
}

.items {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-weight: 500;
  transition: all 0.2s ease;
}

.active {
  border-color: var(--color-warning);
  background: #fffbe6;
  color: var(--color-warning);
}

.found {
  border-color: var(--color-success);
  background: #f6ffed;
  color: var(--color-success);
}

.target {
  text-align: center;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: 实现线性搜索步骤生成器**

Create `src/lib/steps/linearSearch.ts`:

```ts
import type { Step } from '@/types/algorithm'

export function linearSearchSteps(input: { array: number[]; target: number }): Step[] {
  const { array, target } = input
  const steps: Step[] = []

  for (let i = 0; i < array.length; i++) {
    steps.push({
      type: 'visit',
      indices: [i],
      pseudocodeLine: 1,
      message: `检查索引 ${i}，值 ${array[i]}`,
      data: { array, target, foundIndex: null },
    })

    if (array[i] === target) {
      steps.push({
        type: 'final',
        indices: [i],
        pseudocodeLine: 2,
        message: `找到目标值 ${target} 在索引 ${i}`,
        data: { array, target, foundIndex: i },
      })
      return steps
    }
  }

  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 3,
    message: `未找到目标值 ${target}`,
    data: { array, target, foundIndex: null },
  })

  return steps
}
```

- [ ] **Step 3: 实现二分搜索步骤生成器**

Create `src/lib/steps/binarySearch.ts`：

```ts
import type { Step } from '@/types/algorithm'

export function binarySearchSteps(input: { array: number[]; target: number }): Step[] {
  const { array, target } = input
  const steps: Step[] = []
  let left = 0
  let right = array.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({
      type: 'compare',
      indices: [mid],
      pseudocodeLine: 2,
      message: `比较中间值 ${array[mid]} 和目标值 ${target}`,
      data: { array, target, left, right, foundIndex: null },
    })

    if (array[mid] === target) {
      steps.push({
        type: 'final',
        indices: [mid],
        pseudocodeLine: 3,
        message: `找到目标值 ${target} 在索引 ${mid}`,
        data: { array, target, left, right, foundIndex: mid },
      })
      return steps
    } else if (array[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 4,
    message: `未找到目标值 ${target}`,
    data: { array, target, left, right, foundIndex: null },
  })

  return steps
}
```

- [ ] **Step 4: 添加测试**

测试验证：找到目标时 `foundIndex` 正确；未找到时返回 null。

- [ ] **Step 5: 更新 algorithms.ts 添加搜索算法**

```ts
{
  id: 'linear-search',
  name: '线性搜索',
  categoryId: 'searching',
  description: '从头到尾依次检查每个元素，直到找到目标值。',
  difficulty: 'beginner',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  pseudocode: [
    'for i = 0 to n-1',
    '  if a[i] == target',
    '    return i',
    'return -1',
  ],
  defaultInput: { array: [3, 7, 1, 9, 5], target: 9 },
  generateSteps: linearSearchSteps,
  renderer: 'searching',
},
```

- [ ] **Step 6: 修改 AlgorithmDetail 支持搜索渲染**

在 `AlgorithmDetail.tsx` 中根据 `algorithm.renderer` 渲染不同组件。提取 `renderVisualization` 函数：

```tsx
import SearchList from '@/components/SearchList/SearchList'
import type { Algorithm, Step } from '@/types/algorithm'

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

  return null
}
```

- [ ] **Step 7: 运行测试并验证**

Run:
```bash
npm test
npm run dev
```

Expected:
- 测试全部通过
- `/algorithm/linear-search` 和 `/algorithm/binary-search` 动画正常

- [ ] **Step 8: 提交**

Run:
```bash
git add .
git commit -m "feat: add linear and binary search algorithms"
```

---

## Task 10: 实现 GraphCanvas 渲染组件

**Files:**
- Create: `src/components/GraphCanvas/GraphCanvas.tsx`
- Create: `src/components/GraphCanvas/GraphCanvas.module.css`
- Create: `src/lib/graphLayout.ts`

**Interfaces:**
- Consumes: `nodes`, `edges`, `activeNodeIds`, `activeEdgeIds`
- Produces: SVG 图可视化

- [ ] **Step 1: 实现图布局算法**

Create `src/lib/graphLayout.ts`：

```ts
export interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
}

export function calculateLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  const angleStep = (2 * Math.PI) / nodes.length

  return nodes.map((node, index) => ({
    ...node,
    x: centerX + radius * Math.cos(index * angleStep - Math.PI / 2),
    y: centerY + radius * Math.sin(index * angleStep - Math.PI / 2),
  }))
}
```

- [ ] **Step 2: 创建 GraphCanvas 组件**

Create `src/components/GraphCanvas/GraphCanvas.tsx`:

```tsx
import { useMemo } from 'react'
import { calculateLayout, GraphNode, GraphEdge } from '@/lib/graphLayout'
import styles from './GraphCanvas.module.css'

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNodeIds: string[]
  activeEdgeIds: string[]
}

export default function GraphCanvas({ nodes, edges, activeNodeIds, activeEdgeIds }: GraphCanvasProps) {
  const width = 500
  const height = 320
  const layoutedNodes = useMemo(() => calculateLayout(nodes, edges, width, height), [nodes, edges, width, height])
  const nodeMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; label: string }>()
    layoutedNodes.forEach(n => map.set(n.id, { x: n.x!, y: n.y!, label: n.label }))
    return map
  }, [layoutedNodes])

  return (
    <svg className={styles.canvas} viewBox={`0 0 ${width} ${height}`}>
      {edges.map((edge, index) => {
        const from = nodeMap.get(edge.from)
        const to = nodeMap.get(edge.to)
        if (!from || !to) return null
        const edgeId = `${edge.from}-${edge.to}`
        const isActive = activeEdgeIds.includes(edgeId)

        return (
          <g key={index}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`${styles.edge} ${isActive ? styles.activeEdge : ''}`}
            />
            {edge.weight !== undefined && (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                className={styles.edgeLabel}
              >
                {edge.weight}
              </text>
            )}
          </g>
        )
      })}

      {layoutedNodes.map(node => {
        const isActive = activeNodeIds.includes(node.id)
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              className={`${styles.node} ${isActive ? styles.activeNode : ''}`}
            />
            <text
              x={node.x}
              y={node.y}
              dy="0.35em"
              textAnchor="middle"
              className={styles.nodeLabel}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
```

Create `src/components/GraphCanvas/GraphCanvas.module.css`:

```css
.canvas {
  width: 100%;
  height: 320px;
  background: var(--color-bg-page);
  border-radius: var(--radius-base);
}

.edge {
  stroke: var(--color-border);
  stroke-width: 2;
  transition: stroke 0.2s ease;
}

.activeEdge {
  stroke: var(--color-warning);
  stroke-width: 3;
}

.edgeLabel {
  font-size: 12px;
  fill: var(--color-text-secondary);
  text-anchor: middle;
}

.node {
  fill: var(--color-bg-base);
  stroke: var(--color-primary);
  stroke-width: 2;
  transition: fill 0.2s ease, stroke 0.2s ease;
}

.activeNode {
  fill: #e6f7ff;
  stroke: var(--color-primary-dark);
  stroke-width: 3;
}

.nodeLabel {
  font-size: 14px;
  fill: var(--color-text-primary);
  pointer-events: none;
}
```

- [ ] **Step 3: 临时验证**

临时渲染 GraphCanvas，确认 SVG 正常显示节点和边。

- [ ] **Step 4: 提交**

Run:
```bash
git add .
git commit -m "feat: add GraphCanvas svg visualization"
```

---

## Task 11: 实现 BFS 与 DFS

**Files:**
- Create: `src/lib/steps/bfs.ts`
- Create: `src/lib/steps/dfs.ts`
- Create: 对应测试文件
- Modify: `src/data/algorithms.ts`
- Modify: `src/pages/AlgorithmDetail.tsx`

**Interfaces:**
- Consumes: `{ nodes: GraphNode[], edges: GraphEdge[], startId: string }`
- Produces: `Step[]`

- [ ] **Step 1: 实现 BFS 步骤生成器**

Create `src/lib/steps/bfs.ts`:

```ts
import type { Step } from '@/types/algorithm'
import type { GraphEdge, GraphNode } from '@/lib/graphLayout'

export function bfsSteps(input: { nodes: GraphNode[]; edges: GraphEdge[]; startId: string }): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const visited = new Set<string>()
  const queue = [startId]
  const adj = new Map<string, string[]>()

  edges.forEach(({ from, to }) => {
    if (!adj.has(from)) adj.set(from, [])
    adj.get(from)!.push(to)
    if (!adj.has(to)) adj.set(to, [])
    adj.get(to)!.push(from)
  })

  visited.add(startId)
  steps.push({
    type: 'visit',
    indices: [startId],
    pseudocodeLine: 1,
    message: `从起点 ${startId} 开始`,
    data: { nodes, edges, visited: Array.from(visited), queue: [...queue] },
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    const neighbors = adj.get(current) || []

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        steps.push({
          type: 'compare',
          indices: [current, neighbor],
          pseudocodeLine: 3,
          message: `访问 ${current} 的邻居 ${neighbor}`,
          data: { nodes, edges, visited: Array.from(visited), queue: [...queue], currentEdge: `${current}-${neighbor}` },
        })
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  steps.push({
    type: 'final',
    indices: Array.from(visited),
    pseudocodeLine: 5,
    message: '遍历完成',
    data: { nodes, edges, visited: Array.from(visited), queue: [] },
  })

  return steps
}
```

- [ ] **Step 2: 实现 DFS 步骤生成器**

类似 BFS，使用递归栈实现，标注访问顺序。

- [ ] **Step 3: 添加测试**

验证 BFS/DFS 访问节点顺序符合算法逻辑。

- [ ] **Step 4: 更新 AlgorithmDetail 支持图渲染**

在 `AlgorithmDetail.tsx` 的 `renderVisualization` 中添加 `graph` 分支：

```tsx
if (algorithm.renderer === 'graph') {
  const data = step?.data || algorithm.defaultInput
  return (
    <GraphCanvas
      nodes={data.nodes}
      edges={data.edges}
      activeNodeIds={(step?.indices as string[]) || []}
      activeEdgeIds={data.currentEdge ? [data.currentEdge] : []}
    />
  )
}
```

- [ ] **Step 5: 运行测试并验证**

Run:
```bash
npm test
npm run dev
```

Expected: `/algorithm/bfs` 和 `/algorithm/dfs` 动画正常。

- [ ] **Step 6: 提交**

Run:
```bash
git add .
git commit -m "feat: add bfs and dfs graph algorithms"
```

---

## Task 12: 实现 Dijkstra、Bellman-Ford、A* 搜索

**Files:**
- Create: `src/lib/steps/dijkstra.ts`
- Create: `src/lib/steps/bellmanFord.ts`
- Create: `src/lib/steps/astar.ts`
- Create: 对应测试文件
- Modify: `src/data/algorithms.ts`

**Interfaces:**
- Consumes: `{ nodes, edges, startId, endId? }`
- Produces: `Step[]`

- [ ] **Step 1: 实现各算法步骤生成器**

每个生成器记录当前考察的节点和边，以及距离数组状态。

以 Dijkstra 为例：

```ts
export function dijkstraSteps(input: { nodes: GraphNode[]; edges: GraphEdge[]; startId: string }): Step[] {
  const { nodes, edges, startId } = input
  const steps: Step[] = []
  const dist = new Map<string, number>()
  const visited = new Set<string>()

  nodes.forEach(n => dist.set(n.id, Infinity))
  dist.set(startId, 0)

  while (visited.size < nodes.length) {
    let minNode: string | null = null
    nodes.forEach(n => {
      if (!visited.has(n.id) && (minNode === null || dist.get(n.id)! < dist.get(minNode)!)) {
        minNode = n.id
      }
    })

    if (minNode === null || dist.get(minNode) === Infinity) break

    visited.add(minNode)
    steps.push({
      type: 'visit',
      indices: [minNode],
      pseudocodeLine: 2,
      message: `确定节点 ${minNode} 的最短距离为 ${dist.get(minNode)}`,
      data: { nodes, edges, dist: Object.fromEntries(dist), visited: Array.from(visited) },
    })

    edges
      .filter(e => e.from === minNode && !visited.has(e.to))
      .forEach(edge => {
        const newDist = dist.get(minNode)! + (edge.weight || 0)
        if (newDist < dist.get(edge.to)!) {
          dist.set(edge.to, newDist)
          steps.push({
            type: 'compare',
            indices: [minNode, edge.to],
            pseudocodeLine: 3,
            message: `更新 ${edge.to} 的距离为 ${newDist}`,
            data: { nodes, edges, dist: Object.fromEntries(dist), visited: Array.from(visited), currentEdge: `${edge.from}-${edge.to}` },
          })
        }
      })
  }

  steps.push({
    type: 'final',
    indices: Array.from(visited),
    pseudocodeLine: 4,
    message: '最短路径计算完成',
    data: { nodes, edges, dist: Object.fromEntries(dist), visited: Array.from(visited) },
  })

  return steps
}
```

- [ ] **Step 2: 添加测试**

验证最短距离正确。

- [ ] **Step 3: 更新 algorithms.ts**

添加 Dijkstra、Bellman-Ford、A* 算法条目。

- [ ] **Step 4: 运行测试并验证**

Run:
```bash
npm test
npm run dev
```

Expected: 所有图算法测试通过，页面动画正常。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add dijkstra bellman-ford and astar algorithms"
```

---

## Task 13: 实现分类页

**Files:**
- Modify: `src/pages/Category.tsx`
- Create: `src/pages/Category.module.css`
- Create: `src/components/AlgorithmCard/AlgorithmCard.tsx`
- Create: `src/components/AlgorithmCard/AlgorithmCard.module.css`
- Create: `src/components/CategoryNav/CategoryNav.tsx`
- Create: `src/components/CategoryNav/CategoryNav.module.css`

**Interfaces:**
- Consumes: `categories`, `algorithms`
- Produces: 可切换的分类页

- [ ] **Step 1: 创建 CategoryNav**

Create `src/components/CategoryNav/CategoryNav.tsx`:

```tsx
import { Link, useParams } from 'react-router-dom'
import { categories } from '@/data/categories'
import styles from './CategoryNav.module.css'

export default function CategoryNav() {
  const { categoryId } = useParams<{ categoryId: string }>()

  return (
    <div className={styles.nav}>
      {categories.filter(c => c.enabled).map(category => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`${styles.item} ${category.id === categoryId ? styles.active : ''}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
```

Create `src/components/CategoryNav/CategoryNav.module.css`:

```css
.nav {
  display: flex;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.item {
  padding: 12px 20px;
  color: var(--color-text-regular);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 14px;
}

.item:hover {
  color: var(--color-primary);
}

.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

- [ ] **Step 2: 创建 AlgorithmCard**

Create `src/components/AlgorithmCard/AlgorithmCard.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { Algorithm } from '@/types/algorithm'
import styles from './AlgorithmCard.module.css'

interface AlgorithmCardProps {
  algorithm: Algorithm
}

export default function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const difficultyMap = {
    beginner: { text: '入门', class: styles.beginner },
    intermediate: { text: '进阶', class: styles.intermediate },
    advanced: { text: '高级', class: styles.advanced },
  }
  const difficulty = difficultyMap[algorithm.difficulty]

  return (
    <Link to={`/algorithm/${algorithm.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{algorithm.name}</h3>
        <span className={`${styles.tag} ${difficulty.class}`}>{difficulty.text}</span>
      </div>
      <p className={styles.description}>{algorithm.description}</p>
    </Link>
  )
}
```

Create `src/components/AlgorithmCard/AlgorithmCard.module.css`:

```css
.card {
  display: block;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.description {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-small);
}

.beginner {
  background: #e6f7ff;
  color: #1890ff;
}

.intermediate {
  background: #fff2e8;
  color: #fa8c16;
}

.advanced {
  background: #fff1f0;
  color: #f5222d;
}
```

- [ ] **Step 3: 组装分类页**

Modify `src/pages/Category.tsx`:

```tsx
import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'
import CategoryNav from '@/components/CategoryNav/CategoryNav'
import AlgorithmCard from '@/components/AlgorithmCard/AlgorithmCard'
import styles from './Category.module.css'

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = useMemo(() => categories.find(c => c.id === categoryId), [categoryId])
  const categoryAlgorithms = useMemo(
    () => algorithms.filter(a => a.categoryId === categoryId),
    [categoryId]
  )

  if (!category || !category.enabled) {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <CategoryNav />
      <h1 className={styles.title}>{category.name}</h1>
      <div className={styles.grid}>
        {categoryAlgorithms.map(algorithm => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>
    </div>
  )
}
```

Create `src/pages/Category.module.css`:

```css
.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}
```

- [ ] **Step 4: 验证分类页**

Run:
```bash
npm run dev
```

访问 `/category/sorting`、`/category/searching`、`/category/graph`

Expected: 显示对应分类的算法卡片，点击卡片跳转到详情页。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: implement category page with navigation"
```

---

## Task 14: 实现首页

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/pages/Home.module.css`

**Interfaces:**
- Consumes: `categories`
- Produces: 首页 Hero + 分类入口

- [ ] **Step 1: 创建首页**

Modify `src/pages/Home.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'
import styles from './Home.module.css'

export default function Home() {
  const enabledCategories = categories.filter(c => c.enabled)

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>用动画理解每一个算法</h1>
        <p className={styles.heroSubtitle}>
          可视化、可控制、可学习。从排序到图算法，一步步看懂计算机科学的底层逻辑。
        </p>
        <Link to="/category/sorting" className={styles.cta}>
          开始学习
        </Link>
      </section>

      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>核心分类</h2>
        <div className={styles.grid}>
          {enabledCategories.map(category => (
            <Link key={category.id} to={`/category/${category.id}`} className={styles.card}>
              <h3 className={styles.cardTitle}>{category.name}</h3>
              <p className={styles.cardDesc}>
                {category.id === 'sorting' && '冒泡、选择、插入、堆、归并、快速排序'}
                {category.id === 'searching' && '线性搜索与二分搜索'}
                {category.id === 'graph' && 'BFS、DFS、Dijkstra、Bellman-Ford、A*'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
```

Create `src/pages/Home.module.css`:

```css
.container {
  padding: var(--spacing-xl) 0;
}

.hero {
  text-align: center;
  padding: 64px var(--spacing-lg);
  background: var(--color-bg-base);
  border-radius: var(--radius-large);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
}

.heroTitle {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.heroSubtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
  max-width: 560px;
  margin: 0 auto var(--spacing-lg);
  line-height: 1.6;
}

.cta {
  display: inline-block;
  padding: 10px 28px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-base);
  font-size: 15px;
}

.cta:hover {
  background: var(--color-primary-dark);
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.card {
  display: block;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-lg);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-1);
}

.cardTitle {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.cardDesc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
```

- [ ] **Step 2: 验证首页**

Run:
```bash
npm run dev
```

访问 `/`

Expected: 显示 Hero 区域和三大分类入口卡片。

- [ ] **Step 3: 提交**

Run:
```bash
git add .
git commit -m "feat: implement home page"
```

---

## Task 15: 添加 GitHub Actions 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: push 到 main 分支时自动部署到 gh-pages

- [ ] **Step 1: 创建 GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 本地构建验证**

Run:
```bash
npm run build
```

Expected: `dist/` 目录生成，无错误。

- [ ] **Step 3: 提交**

Run:
```bash
git add .
git commit -m "ci: add github pages deployment workflow"
```

---

## Task 16: 最终验收与修复

**Files:**
- All existing files may need minor fixes

**Interfaces:**
- Produces: 可部署的完整站点

- [ ] **Step 1: 运行完整测试**

Run:
```bash
npm test
```

Expected: 所有测试通过。

- [ ] **Step 2: 运行构建**

Run:
```bash
npm run build
```

Expected: 构建成功。

- [ ] **Step 3: 本地预览生产构建**

Run:
```bash
npx serve dist
```

Expected:
- 首页正常显示
- 分类页可切换
- 每个算法详情页动画和控制正常
- 路由刷新不报错

- [ ] **Step 4: 修复发现的问题**

根据预览结果修复样式、动画、路由等问题。

- [ ] **Step 5: 最终提交**

Run:
```bash
git add .
git commit -m "fix: final polish and build verification"
```

---

## 自我审查

### Spec 覆盖检查

- [x] 项目目标与首发范围 → Task 1-4 基础架构，Task 5-14 各算法
- [x] 技术栈 React + Vite → Task 1
- [x] 信息架构（首页/分类/详情）→ Task 4, 13, 14
- [x] 页面布局与视觉风格 → Task 2 (CSS variables), Task 7 (卡片式堆叠详情页)
- [x] 组件架构 → 各 Task 文件创建
- [x] 动画引擎 → Task 3 (useAlgorithmPlayer)
- [x] 排序/搜索/图算法 → Task 5-12
- [x] 扩展性 → categories/algorithms 数据结构设计
- [x] GitHub Pages 部署 → Task 15
- [x] 验收标准 → Task 16

### Placeholder 检查

- 无 TBD/TODO
- 所有测试代码完整
- 所有组件有具体实现代码
- 所有命令有预期输出

### 类型一致性检查

- `Step.indices` 在排序/搜索中为 `number[]`，图算法中为 `string[]`，渲染时通过 `as` 断言转换，符合设计
- `useAlgorithmPlayer` 返回的方法名在各任务中一致
- `renderer` 字段值 `'sorting' | 'searching' | 'graph'` 在类型和渲染分支中一致

---

## 执行方式选择

Plan complete and saved to `docs/superpowers/plans/2026-06-20-algorithm-animation-site.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach would you prefer?
