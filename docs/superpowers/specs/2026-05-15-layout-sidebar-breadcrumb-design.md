# Layout Redesign: USidebar + UBreadcrumb

## Summary

Replace the current top `UNavigation` layout with a `USidebar`-based layout featuring a collapsible sidebar (offcanvas mode, default closed) and a centered `UBreadcrumb` in the top bar alongside the sidebar toggle button.

## Motivation

- The app "万象数迹" (All Footprints) needs a more flexible navigation structure
- Current single top nav bar limits scalability as features grow
- Offcanvas sidebar provides more screen space for content while keeping navigation accessible
- Breadcrumb improves orientation within the app

## Layout Structure

```
┌──────────────┬─────────────────────────────────────┐
│              │ [≡ toggle]     Breadcrumb (centered) │
│   USidebar   │─────────────────────────────────────│
│  (offcanvas, │                                     │
│   default    │         Content area                 │
│   closed)    │         (<RouterView />)             │
│              │                                     │
│              │                                     │
├──────────────┴─────────────────────────────────────┤
│                    Footer                           │
└────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. DefaultLayout.vue (modified)

**Remove:** `<UNavigation>` component and its template block.

**Add:**
- Outer container: flex row with `USidebar` + content area
- `<USidebar>` with these props:
  - `v-model:open="sidebarOpen"` — reactive boolean, default `false`
  - `collapsible="offcanvas"` — sidebar slides off-screen when closed
  - `variant="sidebar"` — default visual style
  - `side="left"` — appears on the left (default)
- Toggle button inside sidebar's `#header` slot OR in the top bar, using hamburger icon (`i-heroicons-bars-3` or equivalent)
- Top bar row: flex container with toggle button (left) + `<UBreadcrumb>` (centered)
- Content area: `<RouterView />` wrapped in padding

**Navigation items in sidebar:**
```ts
const navItems = [
  { label: '首页', icon: 'i-heroicons-home', to: '/' },
  { label: '账单导入', icon: 'i-heroicons-arrow-up-tray', to: '/data-import' },
]
```

### 2. Breadcrumb Implementation

- `<UBreadcrumb>` component from Nuxt UI, used as a static array driven by current route
- Breadcrumb items derived from route name mapping:
  ```ts
  const breadcrumbItems = computed(() => {
    const route = useRoute()
    if (route.path === '/') return [{ label: '首页', to: '/' }]
    if (route.path === '/data-import') return [
      { label: '首页', to: '/' },
      { label: '账单导入', to: '/data-import' },
    ]
    return [{ label: '首页', to: '/' }]
  })
  ```
- Styling: horizontal centering within the top bar using flex utilities (`justify-center` on the breadcrumb wrapper)

### 3. Sidebar Toggle

- A `UButton` with `icon="i-heroicons-bars-3"`, `variant="ghost"`
- Click toggles `sidebarOpen` ref
- Positioned in the top bar, left-aligned

## States

| State | Behavior |
|---|---|
| **Default (closed)** | Sidebar hidden offscreen. Top bar shows toggle + breadcrumb. Content fills full width. |
| **Open** | Sidebar slides in overlaying content (offcanvas mode). Toggle + breadcrumb remain visible. |
| **Mobile** | USidebar auto-transitions to Slideover/Modal overlay at lg breakpoint. |

## Navigation Updates

- Menu item "数据导入" → "账单导入" (label change only)
- Route path remains `/data-import`
- Page component remains at `features/data-import/pages/DataImportPage.vue`

## Files Changed

| File | Change |
|---|---|
| `src/layouts/DefaultLayout.vue` | Replace UNavigation with USidebar + Breadcrumb layout |
| `src/router/index.ts` | No changes needed (navigation items are local to layout, not router) |
| `src/features/data-import/pages/DataImportPage.vue` | Update page title from "数据导入" to "账单导入" (optional consistency) |

## Constraints

- `useColorMode()` from Nuxt is NOT available — use `useDark()`/`useToggle()` from `@vueuse/core` (already in place)
- All components (USidebar, UBreadcrumb, UButton, UNavigationMenu) are auto-imported with `U` prefix via Nuxt UI plugin
- Path alias `@/` maps to `./src/`
