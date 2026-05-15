# 账单导入模块：微信 / 支付宝子页面设计

## Summary

将侧边栏"账单导入"改为"账单"，其下新增"微信"和"支付宝"两个子页面。每个页面包含一个导入按钮和一个可分页数据表格，通过调用后端 API 完成数据导入和查询。

## 导航与路由

### 侧边栏导航结构

```
首页
账单 (展开→)
  ⏷ 微信   → /bill/wechat
  ⏷ 支付宝 → /bill/alipay
```

### 路由定义

| 路径 | 组件 | 说明 |
|---|---|---|
| `/bill/wechat` | `WeChatPage.vue` | 微信账单页 |
| `/bill/alipay` | `AlipayPage.vue` | 支付宝账单页 |

路由配置使用 lazy-load：`() => import('@/features/data-import/pages/WeChatPage.vue')`

## 页面构成

每个页面结构相同：

```
┌─────────────────────────────────┐
│  [ 导入 ]                       │  ← UButton
├─────────────────────────────────┤
│                                 │
│  交易时间 | 收入/支出 | 金额 | ... │  ← UTable
│  ....     | ...     | ...  |    │
│                                 │
│              < 1 2 3 ... >      │  ← UPagination
└─────────────────────────────────┘
```

- **导入按钮**：`UButton`，点击触发隐藏的 `<input type="file">` 选择文件
- **数据表格**：`UTable` 展示数据
- **分页**：`UPagination`，数据由服务端分页返回

## 表格列定义

### 微信列（按显示顺序）

| 列名 | key | 说明 |
|---|---|---|
| 交易时间 | tradeTime | |
| 收入/支出 | incomeExpense | INCOME / EXPENSE |
| 金额 | amount | |
| 交易单号 | tradeNo | |
| 交易对方 | counterparty | 微信特有 |
| 商品 | product | 微信特有 |
| 交易类型 | wxType | 微信特有 |
| 支付方式 | paymentMethod | 微信特有 |
| 状态 | status | 微信特有 |
| 商户单号 | merchantNo | 微信特有 |
| 备注 | remark | 放最后 |

隐藏字段：id, source, createTime, createUser, deleted

### 支付宝列（按显示顺序）

| 列名 | key | 说明 |
|---|---|---|
| 交易时间 | tradeTime | |
| 收入/支出 | incomeExpense | INCOME / EXPENSE |
| 金额 | amount | |
| 交易单号 | tradeNo | |
| 分类 | category | 支付宝特有 |
| 账户 | zfbAccount | 支付宝特有 |
| 来源 | alipaySource | 支付宝特有 |
| 标签 | alipayTags | 支付宝特有 |
| 备注 | remark | 放最后 |

隐藏字段：id, source, createTime, createUser, deleted

## 类型定义

### 账单单条记录（BillRecord）

```ts
interface BillRecord {
  id: number
  source: 'WX' | 'ZFB'
  tradeTime: string         // 交易时间
  incomeExpense: 'INCOME' | 'EXPENSE'
  amount: number
  remark: string
  tradeNo: string           // 交易单号
  // 微信特有
  counterparty?: string     // 交易对方
  product?: string          // 商品
  wxType?: string           // 交易类型
  paymentMethod?: string    // 支付方式
  status?: string           // 当前状态
  merchantNo?: string       // 商户单号
  // 支付宝特有
  category?: string         // 分类
  zfbAccount?: string       // 账户
  alipaySource?: string     // 来源
  alipayTags?: string       // 标签
  createTime?: string
  createUser?: number
  deleted?: number
}
```

### 分页响应

```ts
interface PaginatedResponse<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
}
```

### 分页请求参数

```ts
interface BillQueryParams {
  page: number
  pageSize: number
  source: 'WX' | 'ZFB'  // 由页面决定，微信页传 WX，支付宝页传 ZFB
}
```

## API 接口定义

### POST /api/bills/import — 上传文件导入

```ts
// 请求: multipart/form-data，字段名 file
// 响应:
interface ApiResponse<null> {
  code: number
  message: string
  data: null
}
```

### GET /api/bills — 分页查询

```ts
// 请求参数: BillQueryParams
// 响应:
interface ApiResponse<PaginatedResponse<BillRecord>> {
  code: number
  message: string
  data: PaginatedResponse<BillRecord>
}
```

## 文件变更清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `src/router/index.ts` | 修改 | 新增 `/bill/wechat` 和 `/bill/alipay` 路由 |
| `src/layouts/DefaultLayout.vue` | 修改 | 侧边栏导航改为嵌套菜单（账单 → ⏷ 微信 / 支付宝）；面包屑兼容新路由 |
| `src/data/types/index.ts` | 修改 | 新增 BillRecord、PaginatedResponse、BillQueryParams 类型 |
| `src/data/api/bill.ts` | 新建 | 账单 API 接口定义（upload / list），目前返回 mock 数据 |
| `src/features/data-import/pages/WeChatPage.vue` | 新建 | 微信账单页 |
| `src/features/data-import/pages/AlipayPage.vue` | 新建 | 支付宝账单页 |
| `src/features/data-import/pages/DataImportPage.vue` | 删除 | 旧页面不再需要 |
| `src/features/data-import/composables/useBillData.ts` | 新建 | 封装 API 调用逻辑 |
| `src/features/data-import/composables/useFileUpload.ts` | 新建 | 封装文件上传逻辑 |

## 约束

- 所有 UI 组件使用 Nuxt UI（UButton, UTable, UPagination, UNavigationMenu），不自定义组件
- 暗色/亮色模式沿用现有 `useDark()`/`useToggle()` 机制
- 路由路径使用 kebab-case（`/bill/wechat`）
- 分页为服务端分页，前端只传 page/pageSize/source
- 当前阶段所有 API 返回 mock 数据
