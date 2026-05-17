# Custom Icons addIcon Registration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `?raw` + `v-html` slot approach in DefaultLayout.vue with `@iconify/vue`'s `addIcon()` global registration, so WeChat and Alipay SVG icons work natively via `icon` prop.

**Architecture:** Two-file change — register icon bodies in `src/main.ts` via `addIcon()`, then update `DefaultLayout.vue` to remove the `#item-leading` slot and use `icon: 'i-custom:wechat'` / `icon: 'i-custom:alipay'` directly in `navItems`.

**Tech Stack:** Vue 3, `@iconify/vue` (already a transitive dependency of `@nuxt/ui`), Nuxt UI `UIcon`

---

### Task 1: Register custom SVG icons via addIcon in main.ts

**Files:**
- Modify: `src/main.ts`
- Source data: `src/assets/svg/wechat.svg`, `src/assets/svg/alipay.svg`

- [ ] **Step 1: Extract SVG bodies**

From `src/assets/svg/wechat.svg` — content inside `<svg>...</svg>` tags:
- viewBox: `0 0 1170 1024`
- Path: `<path d="M331.429 263.429...（完整 d 属性）" fill="#0e932e" />`
- Remove the `p-id` attribute (tool-generated, unused)

From `src/assets/svg/alipay.svg`:
- viewBox: `0 0 1024 1024`
- Path: `<path d="M1024.0512 701.0304...（完整 d 属性）" fill="#009FE8" />`
- Remove the `p-id` attribute

- [ ] **Step 2: Add addIcon calls in main.ts**

Add after the `app.use(ui)` line (line 21) in `src/main.ts`:

```ts
import { addIcon } from '@iconify/vue'

// Registration MUST happen before app.mount() but can be called any time
// (the @iconify/vue registry is a singleton — timing doesn't matter)
addIcon('custom:wechat', {
  body: '<path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#0e932e" />',
  width: 1170,
  height: 1024,
})
addIcon('custom:alipay', {
  body: '<path d="M1024.0512 701.0304V196.864A196.9664 196.9664 0 0 0 827.136 0H196.864A196.9664 196.9664 0 0 0 0 196.864v630.272A196.9152 196.9152 0 0 0 196.864 1024h630.272a197.12 197.12 0 0 0 193.8432-162.0992c-52.224-22.6304-278.528-120.32-396.4416-176.64-89.7024 108.6976-183.7056 173.9264-325.3248 173.9264s-236.1856-87.2448-224.8192-194.048c7.4752-70.0416 55.552-184.576 264.2944-164.9664 110.08 10.3424 160.4096 30.8736 250.1632 60.5184 23.1936-42.5984 42.496-89.4464 57.1392-139.264H248.064v-39.424h196.9152V311.1424H204.8V267.776h240.128V165.632s2.1504-15.9744 19.8144-15.9744h98.4576V267.776h256v43.4176h-256V381.952h208.8448a805.9904 805.9904 0 0 1-84.8384 212.6848c60.672 22.016 336.7936 106.3936 336.7936 106.3936zM283.5456 791.6032c-149.6576 0-173.312-94.464-165.376-133.9392 7.8336-39.3216 51.2-90.624 134.4-90.624 95.5904 0 181.248 24.4736 284.0576 74.5472-72.192 94.0032-160.9216 150.016-253.0816 150.016z" fill="#009FE8" />',
  width: 1024,
  height: 1024,
})
```

The full path names `custom:wechat` / `custom:alipay` are Iconify format: `prefix:name`. When used in templates as `i-custom:wechat`, UIcon strips the `i-` prefix → `custom:wechat` → resolved by `@iconify/vue`.

- [ ] **Step 3: Verify dev server still runs**

```bash
pnpm dev
# Expected: Server starts on localhost:5173, no console errors
# At this point icons are registered but not yet used anywhere, so no visual change
```

- [ ] **Step 4: Commit**

```bash
git add src/main.ts
git commit -m "feat: register WeChat and Alipay SVG icons via addIcon()
"
```

---

### Task 2: Refactor DefaultLayout.vue to use native icon prop

**Files:**
- Modify: `src/layouts/DefaultLayout.vue`

- [ ] **Step 1: Remove `?raw` imports**

From the `<script setup>` block, remove these two lines:

```ts
import alipaySvg from '@/assets/svg/alipay.svg?raw'
import wechatSvg from '@/assets/svg/wechat.svg?raw'
```

- [ ] **Step 2: Add `icon` to child nav items**

In the `navItems` array, add `icon` fields to the 微信 and 支付宝 children:

```ts
children: [
  { label: '微信', icon: 'i-custom:wechat', to: '/bill/wechat' },
  { label: '支付宝', icon: 'i-custom:alipay', to: '/bill/alipay' },
],
```

- [ ] **Step 3: Remove the `#item-leading` slot**

Replace:

```vue
<UNavigationMenu :items="navItems" orientation="vertical" :collapsed="!sidebarOpen"
  :ui="{ link: 'p-1.5 overflow-hidden' }">
  <template #item-leading="{ item }">
    <span v-if="item.label === '微信'" class="size-5 flex items-center justify-center [&>svg]:size-full"
      v-html="wechatSvg" />
    <span v-else-if="item.label === '支付宝'" class="size-5 flex items-center justify-center [&>svg]:size-full"
      v-html="alipaySvg" />
    <UIcon v-else-if="item.icon" :name="item.icon" class="size-5" />
  </template>
</UNavigationMenu>
```

With:

```vue
<UNavigationMenu :items="navItems" orientation="vertical" :collapsed="!sidebarOpen"
  :ui="{ link: 'p-1.5 overflow-hidden' }" />
```

- [ ] **Step 4: Verify the page renders correctly**

```bash
pnpm dev
```

Visit http://localhost:5173. Expected:
- 首页 shows lucide house icon
- 账单 (collapsible parent) shows lucide upload icon
- 微信 child shows WeChat green QR icon
- 支付宝 child shows Alipay blue icon
- Sidebar collapse to icon mode still works
- Popover on hover shows icons + labels correctly

- [ ] **Step 5: Type-check**

```bash
pnpm typecheck
# Expected: No type errors
```

- [ ] **Step 6: Commit**

```bash
git add src/layouts/DefaultLayout.vue
git commit -m "refactor: replace slot-based SVG icons with native addIcon registration

- Remove ?raw imports and #item-leading slot from DefaultLayout.vue
- Add icon prop to 微信/支付宝 nav items using i-custom:wechat/alipay
- UIcon resolves custom icons natively via @iconify/vue registry
"
```

---

## Verification

After both tasks complete:

1. Start dev server: `pnpm dev`
2. Open http://localhost:5173
3. Sidebar shows all icons correctly — lucide for 首页/账单, brand SVGs for 微信/支付宝
4. Collapse sidebar to icon mode — brand icons should scale to icon size
5. Hover over 账单 parent — popover shows 微信/支付宝 with icons
6. Run `pnpm typecheck` — zero type errors
