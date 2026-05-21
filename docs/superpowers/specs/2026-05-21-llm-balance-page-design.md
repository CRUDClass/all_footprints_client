# LLM 余额查询页面设计

## 概述

在侧边导航新增 "LLM 余额" 菜单项，点击进入余额查询页面，展示 DeepSeek 和 Kimi 两个 AI 服务的账户余额快照。

## 功能需求

- 侧边栏新增顶层菜单项 "LLM 余额"（位于"账单"组下方）
- 点击进入 `/llm-balance` 页面
- 页面加载时请求 API 获取各 AI 的余额数据
- 使用 Nuxt UI `UPageCard` 组件展示每个 AI 的完整余额信息
- 字段标签全部使用中文
- 支持加载态、正常展示、错误三种状态

## 数据结构

### 接口

```
GET /api/balance/latest
```

代理：`vite.config.ts` 新增 `/api` 代理到 `http://127.0.0.1:8080`。

### 响应格式

```json
{
  "code": 200,
  "data": {
    "DEEPSEEK": {
      "available": true,
      "totalBalance": "101.9100",
      "availableBalance": "101.9100",
      "grantedBalance": "0.0000",
      "toppedUpBalance": "101.9100",
      "currency": "CNY",
      "queryTime": "2026-05-21 16:15:03"
    },
    "KIMI": {
      "available": true,
      "totalBalance": "2.6499",
      "availableBalance": "2.6499",
      "voucherBalance": "0.0000",
      "cashBalance": "2.6499",
      "currency": "CNY",
      "queryTime": "2026-05-21 16:15:03"
    }
  }
}
```

### TypeScript 类型

```typescript
interface AiBalance {
  available: boolean
  totalBalance: string
  availableBalance: string
  currency: string
  queryTime: string
  // DeepSeek 特有
  grantedBalance?: string
  toppedUpBalance?: string
  // Kimi 特有
  voucherBalance?: string
  cashBalance?: string
}

interface BalanceData {
  DEEPSEEK: AiBalance
  KIMI: AiBalance
}
```

## 页面布局

- 页面标题：LLM 余额
- 面包屑：首页 > LLM 余额
- 两个 `UPageCard` 在 `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">` 中并排显示
- 每张卡片展示一个 AI 的全部字段

### 卡片结构

- **头部（leading slot）**：AI 名称 + 可用状态标签（Available 显示绿色，不可用显示红色）
- **主体（body slot）**：2 列网格展示所有余额字段，每个字段显示标签中文名和值
- **底部**：查询时间

### 字段中文映射

| 英文字段 | 中文标签 |
|----------|----------|
| totalBalance | 总额 |
| availableBalance | 可用余额 |
| grantedBalance | 赠送余额 |
| toppedUpBalance | 充值余额 |
| voucherBalance | 优惠券余额 |
| cashBalance | 现金余额 |
| currency | 货币 |
| queryTime | 查询时间 |

## 文件变更

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/data/types/ai.ts` | AiBalance, BalanceData 类型定义 |
| `src/data/api/ai.ts` | fetchBalance() API 函数 |
| `src/features/llm-balance/pages/LlmBalancePage.vue` | 页面入口，加载 + useLoading |
| `src/features/llm-balance/composables/useAiBalance.ts` | 数据获取 composable |
| `src/features/llm-balance/components/AiBalanceCard.vue` | 单个 AI 余额卡片 |

### 修改文件

| 文件 | 变更 |
|------|------|
| `vite.config.ts` | 添加 `/api` 代理规则 |
| `src/router/index.ts` | 添加 `/llm-balance` 路由 |
| `src/layouts/DefaultLayout.vue` | 导航新增 "LLM 余额" 菜单项 |

## 数据流

1. 页面 mounted → `useAiBalance().load()`
2. 内部调用 `useLoading(fetchBalance, { minDuration: 1000 })`
3. 返回 `BalanceData` → 传递给两个 `AiBalanceCard` 组件
4. 加载中 → 显示两个 `<USkeleton>` 占位卡片
5. 失败（响应 code !== 200 或网络错误）→ 显示错误提示

## 状态

| 状态 | 展现 |
|------|------|
| 加载中 | 两个 USkeleton 占位卡片，按实际卡片尺寸占位 |
| 成功 | 两个 UPageCard 并排展示，每张内含所有字段 |
| 失败 | 页面居中显示 "获取余额失败，请稍后重试" |

## 边界情况

- 后端返回非 200 code → 视为失败，显示错误提示
- API 只返回部分 AI → 只显示返回的 AI
- `available: false` → 标签显示红色 "不可用"
