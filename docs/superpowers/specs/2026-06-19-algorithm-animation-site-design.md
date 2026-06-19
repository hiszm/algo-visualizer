# 算法动画图解网站设计文档

## 1. 项目概述

基于「算法动画图解」App 截图，打造一个部署在 GitHub Pages 上的算法可视化学习网站。整体采用大厂级企业设计语言（Ant Design / Arco Design 风格），通过可交互的动画帮助用户理解算法执行过程。

## 2. 目标与范围

### 2.1 目标
- 提供排序、搜索、图算法三大类核心算法的可视化演示
- 每个算法包含：动画演示、原理说明、复杂度分析、伪代码
- 支持自由控制：播放 / 暂停 / 重置 / 上一步 / 下一步 / 调速
- 部署在 GitHub Pages，零后端依赖

### 2.2 首发范围（MVP）
- **排序算法**：冒泡排序、选择排序、插入排序、堆排序、归并排序、快速排序
- **搜索算法**：线性搜索、二分搜索
- **图算法**：广度优先搜索（BFS）、深度优先搜索（DFS）、Dijkstra、Bellman-Ford、A*

### 2.3 后续预留
- 数学、数据压缩、安全、数据结构、网络、递归等分类在数据结构层面预留，首发版本不实现具体动画

## 3. 技术栈

- **框架**：React 18
- **构建工具**：Vite 5
- **路由**：react-router-dom（HashRouter 适配 GitHub Pages）
- **样式**：CSS Modules + CSS 变量
- **动画**：原生 CSS transition + requestAnimationFrame
- **依赖策略**：不引入完整 UI 组件库，只借鉴 Ant Design 视觉规范，保持轻量

## 4. 信息架构

```
/
├── /category/:categoryId    # 分类页（排序 / 搜索 / 图算法）
└── /algorithm/:algorithmId  # 算法详情页
```

### 4.1 首页（Home）
- Hero 区域：站点标题 + 一句话定位 + 进入学习按钮
- 三大分类入口卡片
- 特性说明区域

### 4.2 分类页（Category）
- 顶部分类导航 Tab
- 当前分类下的算法卡片网格列表
- 每张卡片包含：算法名、一句话描述、难度标签

### 4.3 算法详情页（AlgorithmDetail）
- 面包屑导航
- 左侧 60%：动画舞台 + 控制栏
- 右侧 40%：学习面板（原理说明、复杂度表格、伪代码）
- 移动端：上下堆叠布局

## 5. 页面布局

### 5.1 视觉风格
- 主色调：Ant Design 蓝 `#1890ff` / `#409eff`
- 背景色：灰白 `#f5f7fa` + 纯白 `#ffffff`
- 边框色：浅灰 `#e4e7ed`
- 文字层级：标题 `#303133`、正文 `#606266`、辅助 `#909399`
- 圆角：卡片 4px、按钮 4px（符合企业级克制风格）
- 阴影：极轻微，仅用于 hover 和浮层

### 5.2 响应式策略
- 桌面端：详情页左右分栏
- 平板/手机：详情页上下堆叠，导航可折叠
- 动画舞台尺寸自适应容器

## 6. 组件架构

```
src/
├── components/
│   ├── Layout/              # 顶部导航 + 页面框架
│   ├── CategoryNav/         # 分类 Tab 切换
│   ├── AlgorithmCard/       # 分类页算法卡片
│   ├── AnimationStage/      # 动画舞台容器
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
│   └── algorithms.ts         # 算法元数据
├── lib/
│   └── steps/                # 各算法 generateSteps 实现
├── pages/
│   ├── Home.tsx
│   ├── Category.tsx
│   └── AlgorithmDetail.tsx
└── types/
    └── algorithm.ts          # 类型定义
```

## 7. 动画引擎

### 7.1 核心抽象

```ts
interface Step {
  type: 'compare' | 'swap' | 'visit' | 'highlight' | 'final';
  indices: number[] | string[];
  pseudocodeLine: number;
  message: string;
  data: any;
}
```

### 7.2 执行流程
1. 算法初始化时调用 `generateSteps(input)` 预计算全部步骤
2. `useAlgorithmPlayer` 维护 `currentStep` 和播放状态
3. 渲染组件订阅 `currentStep`，根据 `data` 和 `indices` 绘制当前帧
4. 自动播放通过 `setTimeout` 控制，间隔由 `speed` 决定

### 7.3 渲染策略
- **排序算法**：DOM div 柱子，CSS transition 控制高度和位置变化
- **搜索算法**：DOM 列表项，CSS 控制背景色高亮
- **图算法**：SVG 节点和边，React 控制属性变化

## 8. 数据结构

### 8.1 算法元数据

```ts
interface Algorithm {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
  defaultInput: any;
  generateSteps: (input: any) => Step[];
  renderer: 'sorting' | 'searching' | 'graph';
}
```

### 8.2 分类数据

```ts
interface Category {
  id: string;
  name: string;
  enabled: boolean;
}
```

首发启用 `sorting`、`searching`、`graph`，其余分类 `enabled: false`。

## 9. 路由与部署

### 9.1 路由
- 使用 `HashRouter` 避免 GitHub Pages 刷新 404 问题
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

## 11. 非目标（YAGNI）

首发版本明确不做以下功能，避免范围蔓延：
- 用户登录 / 收藏 / 进度保存
- 后端服务 / 数据库
- 完整的单元测试（只做核心算法步骤生成函数的关键用例测试）
- 暗色模式
- 多语言
- 在线代码编辑与运行
- 完整的「测试」题库（仅展示伪代码和学习内容）

## 12. 验收标准

- [ ] 首页正常展示三大分类入口
- [ ] 分类页可切换并展示对应算法卡片
- [ ] 详情页动画可播放、暂停、重置、上一步、下一步、调速
- [ ] 排序算法动画正确反映比较和交换过程
- [ ] 搜索算法动画正确反映查找区间和命中过程
- [ ] 图算法 SVG 正确展示节点访问和边松弛过程
- [ ] 伪代码随动画步骤高亮对应行
- [ ] 站点可成功构建并部署到 GitHub Pages
- [ ] 移动端布局正常，无严重错位

## 13. 风险与假设

- **风险**：图算法步骤生成较复杂，尤其是 Dijkstra 和 A* 的动画步骤需要精心设计
- **假设**：目标用户使用现代浏览器，支持 CSS 变量、ES2020、SVG
- **假设**：GitHub Pages 域名和仓库名在构建前确定
