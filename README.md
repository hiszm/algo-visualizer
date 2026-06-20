# Algo Visualizer · 算法动画图解

一个基于 React + TypeScript + Vite 的交互式算法可视化学习站点，支持排序、搜索、图论、数学、数据压缩、数据结构与安全七大类经典算法的逐步动画演示。

[![Live Demo](https://img.shields.io/badge/在线演示-hiszm.github.io%2Falgo--visualizer-1677ff?style=flat-square)](https://hiszm.github.io/algo-visualizer/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

## 在线体验

直接访问：https://hiszm.github.io/algo-visualizer/

无需安装，打开浏览器即可播放算法动画，支持播放/暂停、单步前进/后退、速度调节。

## 功能特性

- **排序算法**：冒泡排序、选择排序、插入排序、归并排序、快速排序、堆排序
- **搜索算法**：线性搜索、二分搜索
- **图论算法**：BFS、DFS、Dijkstra 最短路径、Bellman-Ford 最短路径、A* 搜索
- **数学算法**：辗转相除法、素性测试
- **数据压缩**：游程编码、霍夫曼编码
- **数据结构**：列表查找
- **安全基础**：安全基础知识、加密基础知识、哈希函数、对称/公开/混合加密、迪菲-赫尔曼密钥交换、讯息鉴别码、数字签名、数字证书
- **交互式播放**：播放 / 暂停 / 重置 / 上一步 / 下一步 / 调速
- **伪代码高亮**：当前执行步骤对应的伪代码行高亮显示
- **响应式布局**：适配桌面端与移动端
- **现代化 UI**：渐变 Hero、阴影卡片、分类色条，整体风格统一

## 技术栈

- **框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite 5
- **路由**：React Router v7（HashRouter，兼容 GitHub Pages）
- **样式**：CSS Modules + CSS 变量
- **测试**：Vitest + React Testing Library
- **部署**：GitHub Actions + GitHub Pages

## 本地运行

```bash
# 克隆项目
git clone https://github.com/hiszm/algo-visualizer.git
cd algo-visualizer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 http://localhost:5173/

## 项目结构

```text
algo-visualizer/
├── public/                  # 静态资源
│   └── favicon.svg          # 站点图标
├── src/
│   ├── components/          # React 组件
│   │   ├── AlgorithmCard/   # 算法卡片
│   │   ├── AnimationStage/  # 动画舞台
│   │   ├── CategoryNav/     # 分类导航
│   │   ├── ControlBar/      # 播放控制栏
│   │   ├── GraphCanvas/     # 图论画布（SVG）
│   │   ├── HuffmanTree/     # 霍夫曼树可视化
│   │   ├── InfoPanel/       # 算法信息面板
│   │   ├── NumberPair/      # 双数字可视化（GCD / 素性测试）
│   │   ├── Pseudocode/      # 伪代码高亮
│   │   ├── RunLengthEncoder/ # 游程编码可视化
│   │   ├── SearchList/      # 搜索列表可视化
│   │   └── SortingBars/     # 排序柱状图可视化
│   ├── data/                # 算法与分类数据
│   ├── hooks/               # 自定义 Hooks
│   │   └── useAlgorithmPlayer.ts
│   ├── lib/                 # 算法步骤生成与工具函数
│   │   ├── graphLayout.ts   # 图布局算法
│   │   └── steps/           # 各算法 Step[] 生成器
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页
│   │   ├── Category.tsx     # 分类页
│   │   └── AlgorithmDetail.tsx  # 算法详情页
│   ├── types/               # TypeScript 类型定义
│   └── styles/              # 全局样式与变量
├── .github/workflows/       # GitHub Actions 部署配置
├── vite.config.ts
├── package.json
└── README.md
```

## 核心设计

### 动画引擎

每个算法都实现为 `generateSteps(input): Step[]`，返回算法执行过程中的每一步状态。`useAlgorithmPlayer` Hook 负责按时间顺序驱动步骤切换：

```typescript
interface Step {
  type: 'compare' | 'swap' | 'visit' | 'highlight' | 'final'
  data: any
  indices?: number[] | string[]
  message: string
  pseudocodeLine?: number
}
```

### 可视化渲染器

根据算法 `renderer` 字段自动选择对应组件：

- `sorting` → `SortingBars`
- `searching` / `list-search` → `SearchList`
- `graph` → `GraphCanvas`
- `number-pair` → `NumberPair`（辗转相除法、素性测试）
- `run-length` → `RunLengthEncoder`
- `huffman-tree` → `HuffmanTree`
- `info` → 信息展示面板（安全主题）

## 可用脚本

| 命令 | 说明 |
|-----|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm test` | 运行单元测试 |
| `npm run lint` | 运行 ESLint 检查 |

## 自动化部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。每次推送代码到 `main` 分支时，工作流会自动构建并发布最新版本。

部署配置见：`.github/workflows/deploy.yml`

## 浏览器支持

- Chrome / Edge / Firefox / Safari 最新版
- 支持移动端浏览器

## 许可证

MIT
