# 算法动画图解网站设计文档（精化版）

> 基于 2026-06-19 版设计文档精化，补充更具体的视觉规范、组件职责与动画渲染细节。

## 1. 项目概述

基于「算法动画图解」App 截图，打造一个部署在 GitHub Pages 上的算法可视化学习网站。整体采用大厂级企业设计语言（Ant Design / Arco Design 风格），通过可交互的动画帮助用户理解算法执行过程。

## 2. 目标与范围

### 2.1 目标
- 提供排序、搜索、图算法三大类核心算法的可视化演示。
- 每个算法包含：动画演示、原理说明、复杂度分析、伪代码。
- 支持自由控制：播放 / 暂停 / 重置 / 上一步 / 下一步 / 调速。
- 部署在 GitHub Pages，零后端依赖。

### 2.2 首发范围（MVP）
- **排序算法**：冒泡排序、选择排序、插入排序、堆排序、归并排序、快速排序
- **搜索算法**：线性搜索、二分搜索
- **图算法**：广度优先搜索（BFS）、深度优先搜索（DFS）、Dijkstra、Bellman-Ford、A*

### 2.3 后续预留
- 数学、数据压缩、安全、数据结构、网络、递归等分类在数据结构和路由层面预留，首发版本不展示入口、不实现具体动画。

## 3. 技术栈

- **框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite 5
- **路由**：react-router-dom（HashRouter 适配 GitHub Pages）
- **样式**：CSS Modules + CSS 变量
- **动画**：原生 CSS transition + requestAnimationFrame
- **测试**：Vitest + @testing-library/react + jsdom
- **依赖策略**：不引入完整 UI 组件库，只借鉴 Ant Design 视觉规范，保持轻量

## 4. 信息架构

```
/
├── /category/:categoryId    # 分类页（排序 / 搜索 / 图算法）
└── /algorithm/:algorithmId  # 算法详情页
```

### 4.1 首页（Home）
- Hero 区域：站点标题 + 一句话定位 + 进入学习按钮
- 三大分类入口卡片（排序 / 搜索 / 图算法）
- 每个入口展示该分类下包含的算法简述

### 4.2 分类页（Category）
- 顶部分类导航 Tab（排序 / 搜索 / 图算法）
- 当前分类下的算法卡片网格列表
- 每张卡片包含：算法名、一句话描述、难度标签

### 4.3 算法详情页（AlgorithmDetail）
- 面包屑导航：首页 > 分类 > 算法名
- 上方：算法标题 + 一句话描述
- 主体区域（桌面端双栏，移动端单栏堆叠）：
  - 左侧/上方：动画舞台 + 控制栏 + 当前步骤提示
  - 右侧/下方：学习面板（原理说明、复杂度表格、伪代码）

## 5. 视觉规范

### 5.1 颜色系统

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-primary` | `#1890ff` | 主按钮、链接、激活态 |
| `--color-primary-light` | `#40a9ff` | hover 态 |
| `--color-primary-dark` | `#096dd9` | active 态 |
| `--color-success` | `#52c41a` | 完成态、命中态 |
| `--color-warning` | `#faad14` | 比较态、访问态 |
| `--color-error` | `#f5222d` | 交换态、错误态 |
| `--color-text-primary` | `#303133` | 标题、重要文字 |
| `--color-text-regular` | `#606266` | 正文 |
| `--color-text-secondary` | `#909399` | 辅助说明 |
| `--color-text-placeholder` | `#c0c4cc` | 禁用、占位 |
| `--color-border` | `#e4e7ed` | 边框、分割线 |
| `--color-border-light` | `#ebeef5` | 浅边框 |
| `--color-bg-base` | `#ffffff` | 卡片、浮层背景 |
| `--color-bg-page` | `#f5f7fa` | 页面底色 |
| `--color-bg-hover` | `#f5f7fa` | hover 背景 |

### 5.2 字体与排版

- **字体族**：`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **等宽字体**（伪代码）：`'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace`
- **标题尺寸**：页面标题 24px，区域标题 16px，卡片标题 16px
- **正文尺寸**：14px；辅助文案 13px；标签 12px

### 5.3 间距与圆角

- 圆角：卡片/按钮 4px，大卡片/hero 8px，小标签 2px
- 阴影：仅用于 hover 和浮层，极轻微 `0 2px 4px rgba(0,0,0,0.06)` / `0 4px 12px rgba(0,0,0,0.08)`
- 间距阶梯：`xs=4px, sm=8px, md=16px, lg=24px, xl=32px`

### 5.4 响应式策略

- **桌面端**（≥768px）：详情页左右双栏，左侧舞台占 60%，右侧面板占 40%
- **平板/手机**（<768px）：详情页上下堆叠，导航可折叠为汉堡菜单
- 动画舞台宽度自适应容器，最小高度 240px

## 6. 组件架构

```
src/
├── components/
│   ├── Layout/              # 顶部导航 + 页面框架
│   ├── CategoryNav/         # 分类 Tab 切换
│   ├── AlgorithmCard/       # 分类页算法卡片
│   ├── AnimationStage/      # 动画舞台容器（可选封装）
│   ├── ControlBar/          # 播放控制栏
│   ├── SortingBars/         # 排序算法 DOM 渲染
│   ├── SearchList/          # 搜索算法 DOM 渲染
│   ├── GraphCanvas/         # 图算法 SVG 渲染
│   ├── ComplexityTable/     # 复杂度表格
│   ├── Pseudocode/          # 伪代码 + 行高亮
│   └── InfoPanel/           # 右侧学习面板
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

## 7. 动画引擎

### 7.1 核心抽象

```ts
interface Step {
  type: 'compare' | 'swap' | 'visit' | 'highlight' | 'final'
  indices: number[] | string[]
  pseudocodeLine: number
  message: string
  data: any
}
```

- `compare`：比较两个元素，用黄色高亮
- `swap`：交换两个元素，用红色高亮
- `visit`：访问某个元素/节点，用黄色高亮
- `highlight`：通用高亮
- `final`：最终完成态，用绿色高亮

### 7.2 执行流程

1. 算法初始化时调用 `generateSteps(input)` 预计算全部步骤。
2. `useAlgorithmPlayer` 维护 `currentStep` 和播放状态。
3. 渲染组件订阅 `currentStep`，根据 `data` 和 `indices` 绘制当前帧。
4. 自动播放通过 `setTimeout` 控制，间隔由 `speed` 决定；播放到最后一步自动停止。

### 7.3 渲染策略

- **排序算法**：DOM div 柱子，CSS transition 控制高度变化；柱顶显示数字标签；active 状态切换背景色。
- **搜索算法**：DOM 列表项，CSS 控制背景色高亮；命中项使用成功绿。
- **图算法**：SVG 节点和边，React 控制属性变化；active 节点/边加粗并变色。

### 7.4 颜色语义映射

| 步骤类型 | 排序渲染 | 搜索渲染 | 图渲染 |
|----------|----------|----------|--------|
| compare | 柱子变黄 | 当前项变黄 | 考察边/节点变黄 |
| swap | 柱子变红并交换位置 | — | — |
| visit | — | 当前项变黄 | 节点变蓝 |
| final | 全部变绿 | 命中项变绿 | 已确定节点变绿 |

## 8. 数据结构

### 8.1 算法元数据

```ts
interface Algorithm {
  id: string
  name: string
  categoryId: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  defaultInput: any
  generateSteps: (input: any) => Step[]
  renderer: 'sorting' | 'searching' | 'graph'
}
```

### 8.2 分类数据

```ts
interface Category {
  id: string
  name: string
  enabled: boolean
}
```

首发启用 `sorting`、`searching`、`graph`，其余分类 `enabled: false`。

## 9. 路由与部署

### 9.1 路由

- 使用 `HashRouter` 避免 GitHub Pages 刷新 404 问题。
- `/`：首页
- `/category/:categoryId`：分类页
- `/algorithm/:algorithmId`：详情页

### 9.2 部署

- `vite.config.ts` 配置 `base: '/algorithm-animation-site/'`
- 使用 GitHub Actions 在 push 到 main 分支时自动构建并部署到 `gh-pages` 分支
- 构建产物为纯静态文件，无服务器依赖

## 10. 扩展性设计

### 10.1 新增算法

新增算法只需：
1. 在 `algorithms.ts` 注册元数据
2. 实现 `generateSteps` 函数
3. 如需要新渲染方式，新增渲染组件并在 `rendererMap` 注册

### 10.2 新增分类

1. 在 `categories` 数组添加分类
2. 将该分类下算法 `categoryId` 指向新分类
3. 如分类需要新的渲染器，扩展 `rendererMap`

### 10.3 主题扩展

CSS 颜色全部使用 CSS 变量定义，未来支持暗色模式只需切换变量主题类。

## 11. 错误处理

- 非法 `algorithmId`：详情页 `Navigate` 到首页
- 非法或未启用 `categoryId`：分类页 `Navigate` 到首页
- 播放器边界保护：`next` 不越界到 `steps.length`，`prev` 不小于 -1
- 图布局兜底：节点数过少或边为空时仍渲染空舞台，不报错

## 12. 测试策略

- `useAlgorithmPlayer` 单元测试：初始状态、next/prev、自动播放、边界停止
- 每个 `generateSteps` 函数测试：最终数据正确、步骤类型齐全
- 不追求完整 UI/E2E 测试，以核心逻辑测试为主

## 13. 非目标（YAGNI）

首发版本明确不做以下功能：
- 用户登录 / 收藏 / 进度保存
- 后端服务 / 数据库
- 完整的单元测试（只做核心算法步骤生成函数和播放器 hook 测试）
- 暗色模式
- 多语言
- 在线代码编辑与运行
- 完整的「测试」题库（仅展示伪代码和学习内容）
- 用户自定义输入（首发使用 defaultInput）

## 14. 验收标准

- [ ] 首页正常展示三大分类入口
- [ ] 分类页可切换并展示对应算法卡片
- [ ] 详情页动画可播放、暂停、重置、上一步、下一步、调速
- [ ] 排序算法动画正确反映比较和交换过程，柱顶数字清晰可见
- [ ] 搜索算法动画正确反映查找区间和命中过程
- [ ] 图算法 SVG 正确展示节点访问和边松弛过程
- [ ] 伪代码随动画步骤高亮对应行
- [ ] 站点可成功构建并部署到 GitHub Pages
- [ ] 移动端布局正常，无严重错位

## 15. 风险与假设

- **风险**：图算法步骤生成较复杂，尤其是 Dijkstra 和 A* 的动画步骤需要精心设计
- **假设**：目标用户使用现代浏览器，支持 CSS 变量、ES2020、SVG
- **假设**：GitHub Pages 域名和仓库名在构建前确定
