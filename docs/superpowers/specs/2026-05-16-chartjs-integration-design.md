# Chart.js 4.5.1 集成设计

## 背景

仪表盘首页 `DashboardPage.vue` 当前引用了不存在的 `ECharts.vue` 组件（echarts 未安装），页面功能失效。需要改用 Chart.js 4.5.1 实现数据可视化，替换原有的 ECharts 方案。

## 需求

1. 集成 Chart.js 4.5.1（纯库，不附加 vue-chartjs）
2. 移除现有的三个 ECharts 图表（柱状图、环形图、折线图）
3. 新增一个全年按周统计的双折线图（支付宝蓝色、微信绿色，X 轴标注"第N周"）
4. Y 轴展示每周支出金额
5. 先使用示例数据，后续再对接真实 API
6. 自动适配深色/浅色模式

## 方案

### 依赖

- `chart.js@^4.5.1`

### ChartView.vue 通用组件

**路径：** `src/shared/components/ChartView.vue`

**设计：**
- Props:
  - `type: ChartType` — 图表类型（'line', 'bar', 'doughnut' 等）
  - `data: ChartData` — Chart.js 标准数据集格式
  - `options?: ChartOptions` — 可选的自定义配置
  - `height?: string` — 高度，默认 `300px`
- 生命周期管理：
  - `onMounted` — 创建 Chart 实例
  - `watch([data, options])` — 数据/配置变化时调用 `chart.update()`
  - `onUnmounted` — 调用 `chart.destroy()` 清理
- 深色模式适配：使用 `useDark()` 监听，动态切换网格线、坐标轴文字、图例的颜色
- 响应式：Chart.js 内置 `responsive: true`，`maintainAspectRatio: false`

### DashboardPage.vue 改造

**路径：** `src/features/dashboard/pages/DashboardPage.vue`

**变更：**
- 删除 `import ECharts from '@/shared/components/ECharts.vue'`
- 删除 `barOption`、`pieOption`、`lineOption` 三个 computed 配置
- 新增一个折线图数据：
  - X 轴：第1周 ~ 第52周（字符串数组）
  - Dataset 1: 支付宝支出（蓝色 `#3b82f6`），52 个周数据点
  - Dataset 2: 微信支出（绿色 `#22c55e`），52 个周数据点
  - Y 轴：支出金额（元），Chart.js 自动缩放
- 示例数据：模拟真实消费模式（月初/节假日偏高，日常偏低，年底相对较高）
- 布局：单图表全宽展示

### 深色模式

ChartView.vue 内部使用 `useDark()` 切换：
- 文字颜色：`--ui-text-muted` 对应色值
- 网格线颜色：`--ui-border` 对应色值
- 在 `watch` 中检测 `isDark` 变化，调用 `chart.update()`

## 修改文件清单

| 文件 | 变更类型 |
|------|----------|
| `package.json` | 新增 `chart.js@^4.5.1` 依赖 |
| `src/shared/components/ChartView.vue` | **新建** |
| `src/features/dashboard/pages/DashboardPage.vue` | **修改**（删除旧图表，新增折线图） |
| `pnpm-lock.yaml` | 自动更新 |

## 验证方式

1. `pnpm install` 安装 chart.js 依赖
2. `pnpm dev` 启动开发服务器
3. 访问仪表盘首页，确认折线图正常渲染
4. 切换深色/浅色模式，确认图表颜色跟随主题变化
5. `pnpm typecheck` 通过类型检查
6. `pnpm build` 通过生产构建
