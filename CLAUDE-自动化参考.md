# Claude Code 自动化参考 — 万象数迹

本文件记录了项目中所有可用的 Claude Code 自动化能力，包括 **MCP 服务**、**Skills（技能）**、**Hooks（钩子）** 和 **Agents（子代理）**。

---

## 一、MCP 服务

MCP（Model Context Protocol）服务为 Claude 提供外部工具和实时数据。

### 1. chrome-devtools

```
配置文件：.mcp.json → mcpServers.chrome-devtools
状态：已启用
```

**功能**：在浏览器中操作页面，调试前端界面。
- 截图、获取页面可访问性快照（a11y tree）
- 填写表单、点击元素、键盘操作
- 查看 Console 消息、Network 请求
- 性能追踪（Performance trace）和 Lighthouse 审计
- 内存快照（Heap Snapshot）

**使用场景**：调试 UI 布局、检查网络请求、分析性能问题。

### 2. nuxt-ui

```
配置文件：.mcp.json → mcpServers.nuxt-ui
状态：已启用
```

**功能**：Nuxt UI 组件的官方文档查询服务。
- `search-components` / `get-component`：查阅组件 Props、Slots、API
- `get-component-metadata`：获取详细的类型定义
- `search-documentation`：搜索文档页面
- `get-example`：查看组件示例代码

**使用场景**：使用 `UButton`、`UTable`、`UPagination` 等 Nuxt UI 组件时查阅官方用法。

> **CLAUDE.md 已规定**：使用 Nuxt UI 组件前必须先通过此 MCP 查阅文档。

### 3. context7

```
配置文件：.mcp.json → mcpServers.context7
状态：已添加配置，需启用（见下方注意事项）
```

**功能**：实时查询第三方库文档（Vue、Chart.js、TanStack Table 等）。
- 获取库的最新 API 文档
- 查询类型定义和用法示例

**使用场景**：使用不熟悉的库 API 时，Claude 自动查询保证信息准确。

> ⚠️ **注意**：需要在 `.claude/settings.local.json` 的 `enabledMcpjsonServers` 数组中添加 `"context7"` 才能启用。当前值：
> ```json
> { "enabledMcpjsonServers": ["chrome-devtools", "nuxt-ui"] }
> ```
> 修改为：
> ```json
> { "enabledMcpjsonServers": ["chrome-devtools", "nuxt-ui", "context7"] }
> ```

---

## 二、Skills（技能）

Skills 是 Claude Code 的可扩展能力包。可直接在对话中通过 `/skill-name` 调用，或被自动触发。

### 项目自定义 Skills

#### chart-gen

```
类型：Claude 自动触发（无需手动调用）
位置：.claude/skills/chart-gen/SKILL.md
```

在需要新增或修改 Chart.js 图表时自动加载，提供 6 套模板：
- 折线图、柱状图、环形图、饼图、雷达图、跨年对比折线图
- 所有模板适配项目现有的 `ChartView.vue` 组件
- 内置暗色模式支持和金额格式化

### 可用 Skills 一览

| 名称 | 说明 | 调用方式 |
|------|------|----------|
| **Superpowers 系列** |
| `brainstorming` | 功能需求分析和设计 | `/brainstorming` |
| `writing-plans` | 编写实现计划 | `/writing-plans` |
| `executing-plans` | 按计划执行实现 | 自动 |
| `test-driven-development` | TDD 流程 | `/test-driven-development` |
| `systematic-debugging` | 系统化调试 | `/systematic-debugging` |
| `frontend-ui-engineering` | 前端 UI 工程最佳实践 | 自动/调用 |
| `verification-before-completion` | 实现完成前验证 | 自动 |
| `finishing-a-development-branch` | 开发分支收尾（合并/PR） | 自动 |
| `requesting-code-review` | 请求代码审查 | 自动 |
| `receiving-code-review` | 接收并处理审查意见 | 自动 |
| `dispatching-parallel-agents` | 并行分发任务给多个 agent | 自动 |
| `subagent-driven-development` | 使用子代理驱动开发 | 自动 |
| `using-git-worktrees` | Git worktree 工作流 | `/using-git-worktrees` |
| **Agent Skills 系列** |
| `incremental-implementation` | 增量式实现 | 自动 |
| `spec-driven-development` | 规格驱动开发 | 自动 |
| `planning-and-task-breakdown` | 任务分解规划 | 自动 |
| `debugging-and-error-recovery` | 调试与错误恢复 | 自动 |
| `ci-cd-and-automation` | CI/CD 自动化 | 自动 |
| `api-and-interface-design` | API 接口设计 | 自动 |
| `code-review-and-quality` | 代码审查与质量 | 自动 |
| `security-and-hardening` | 安全加固 | 自动 |
| `browser-testing-with-devtools` | 浏览器测试（结合 chrome-devtools） | 自动 |
| `performance-optimization` | 性能优化 | 自动 |
| `documentation-and-adrs` | 文档和 ADR | 自动 |
| `code-simplification` | 代码简化 | 自动 |
| `context-engineering` | 上下文工程 | 自动 |
| `doubt-driven-development` | 疑点驱动开发 | 自动 |
| `source-driven-development` | 源码驱动开发 | `/source-driven-development` |
| `deprecation-and-migration` | 弃用与迁移 | 自动 |
| `idea-refine` | 想法精炼 | 自动 |
| `git-workflow-and-versioning` | Git 工作流与版本管理 | 自动 |
| `using-agent-skills` | Agent Skills 使用指南 | 自动 |
| `shipping-and-launch` | 发布上线 | 自动 |
| **其他** |
| `chart-gen` | 项目自定义 Chart.js 配置生成 | 自动 |
| `claude-automation-recommender` | 自动化推荐分析 | `/claude-code-setup:claude-automation-recommender` |
| `simplify` | 代码复用和质量审查 | `/simplify` |
| `claude-api` | 构建/调试 Claude API 应用 | 自动 |
| `review` | 审查 Pull Request | `/review` |
| `security-review` | 安全审查 | `/security-review` |
| `init` | 初始化 CLAUDE.md | `/init` |
| `fewer-permission-prompts` | 减少权限提示 | `/fewer-permission-prompts` |
| `update-config` | 配置 Claude Code 设置 | 自动 |
| `loop` | 定时重复执 | `/loop` |
| `claude-mem:*` | 记忆系统相关（mem-search、timeline-report 等） | `/mem-search` 等 |

> Skills 的完整列表会随对话的 `system-reminder` 自动更新。

---

## 三、当前配置总结

### 文件结构

```
项目根目录/
├── .mcp.json                          # MCP 服务配置（3个服务）
├── CLAUDE.md                          # 项目规则和架构说明
├── CLAUDE-自动化参考.md               # 本文件
└── .claude/
    ├── settings.local.json             # 本地设置（MCP 启用列表）
    ├── skills/
    │   └── chart-gen/
    │       └── SKILL.md               # 自定义 chart-gen skill
    └── memory/                        # Claude-mem 记忆文件
```

### 关键配置注意事项

1. **context7 启用**：需要在 `settings.local.json` 的 `enabledMcpjsonServers` 中添加 `"context7"`
2. **agents/** 目录尚未创建，可按需添加自定义子代理
3. **settings.json（全局）** 尚未创建，hooks（如自动格式化）未配置

---

## 四、常用工作流

### 开发新功能

```
1. /brainstorming           → 需求分析和设计
2. /writing-plans           → 制定实现计划
3. 自动执行或手动实现       → 按计划编码
4. /verification-before-completion → 验证完成状态
5. /finishing-a-development-branch  → 分支收尾
```

### 使用 Nuxt UI 组件

Claude 会自动通过 `nuxt-ui` MCP 查阅组件文档，无需手动操作。

### 调试 UI 问题

Claude 会自动通过 `chrome-devtools` MCP 在浏览器中操作和检查页面。

### 新增图表

直接描述需求，`chart-gen` skill 会自动加载合适的模板。

### 代码质量

```
/simplify           → 审查已修改的代码
/security-review    → 安全审查
/review             → 审查 PR
```
