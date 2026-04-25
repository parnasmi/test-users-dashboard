# Users Dashboard — Implementation Plan

## Context

This is a job-application test task: build a production-quality Users Dashboard against `dummyjson.com`. Quality, FSD architecture cleanliness, and modern React patterns matter as much as feature completeness. Plan is phased so each phase can be picked up by a fresh conversation if needed.

The plan reuses bootstrap, router, layout, and API-layer conventions from `./deps/` (Naiton Business Suite extracts) — but trims everything not needed: react-query (replaced by React 19 `use()`), MSW, token-refresh queue, multi-product `allowedProducts`, i18n, dual axios instances, ScrollContainer.

Key references found in `./deps/`:
- **Bootstrap**: `deps/main.tsx` + `deps/App.tsx` — `BrowserRouter > PublicProvider > AppRouter` composition.
- **Router**: `deps/app/providers/router/` — `AppRouter` renders config with `Suspense`; `RequireAuth` guard redirects unauthenticated users to login.
- **Layouts**: `deps/app/layouts/OuterLayout.tsx` + `InnerLayout.tsx` — shadcn `SidebarProvider` shell with topbar + sidebar + `Outlet`. CSS vars `--app-navbar-height` / `--app-sidebar-width` drive height math.
- **API**: `deps/shared/api/api.instance.ts` — axios instance, request interceptor attaches Bearer token, response interceptor handles 401. `deps/shared/api/auth/auth.helper.ts` — `saveTokens` / `removeTokens` over localStorage.
- **Constants**: `deps/shared/const/router.const.ts` (route enum + getter funcs), `endpoints.const.ts` (endpoint map), `localstorage.const.ts` (storage keys).
- **Path alias**: `@/` → `src/` throughout.

What is intentionally **not** reused: ScrollContainer, react-query setup, refresh-token queue, MSW, AuthProvider's product gating.

## Stack & key decisions

| Concern | Choice | Rationale |
|---|---|---|
| Build | Vite (latest) | Brief mandate. |
| Framework | React 19 (latest) | Brief mandate; enables `use()` hook. |
| Language | TypeScript strict, no `any` | Quality bar. |
| Styling | Tailwind v4 via `@tailwindcss/postcss` + `@import "tailwindcss"` + `@theme` in CSS | Brief mandate; **no `tailwind.config.js`**. |
| UI primitives | shadcn/ui (CLI install per component) | Brief mandate. |
| Router | `react-router` v7 (NOT `-dom`) | Brief mandate. |
| HTTP | axios | Brief mandate; matches `deps/`. |
| Table | `@tanstack/react-table` v8 | Brief mandate. |
| URL state | `nuqs` | Brief mandate (page, pageSize, q, sortBy, order). |
| Forms | `react-hook-form` + `zod` | Brief mandate. |
| Data fetching | React 19 `use()` + `<Suspense>` + `<ErrorBoundary>` (no `useEffect`+`useState`) | Brief mandate. |
| Search debounce | `useTransition` (mark URL-update + fetch as transition; surface `isPending`) | Brief mandate; avoids extra deps. |
| Toasts | shadcn `Sonner` | Brief mandate. |
| Architecture | Feature-Sliced Design — `app → pages → widgets → features → entities → shared`; each slice exports through `index.ts` | Brief mandate. |
| Token storage | `localStorage` behind a swappable `tokenStorage` interface in `shared/lib` | Brief mandate (abstracted). |

## API endpoints (dummyjson.com)

- `POST /auth/login` — body `{ username, password, expiresInMins? }` → returns `{ accessToken, refreshToken, id, username, email, firstName, lastName, gender, image }`. 400 on bad creds.
- `GET /auth/me` — Bearer token → current user.
- `GET /users?limit=&skip=&sortBy=&order=` — paginated list `{ users, total, skip, limit }`.
- `GET /users/search?q=&limit=&skip=` — search (also accepts `sortBy`/`order`).
- `GET /users/:id` — single user (full profile incl. address, company, bank, etc.).

Test creds (surfaced in login UI as a hint): `emilys / emilyspass`.

## Final folder layout (target)

```
src/
├── app/
│   ├── providers/        # AppProviders, ThemeProvider, RouterProvider, ErrorBoundary
│   │   └── router/       # AppRouter, RequireAuth, routes config
│   └── styles/           # index.css (Tailwind v4 + @theme tokens)
├── pages/
│   ├── login/
│   ├── dashboard-layout/
│   ├── users/
│   ├── user-detail/
│   ├── profile/
│   └── not-found/
├── widgets/
│   ├── sidebar/
│   ├── topbar/
│   └── users-table/
├── features/
│   ├── auth-by-credentials/
│   ├── logout/
│   ├── theme-toggle/
│   ├── users-search/
│   ├── users-pagination/
│   └── users-sort/
├── entities/
│   └── user/             # types, UserAvatar, UserRow primitives
├── shared/
│   ├── api/              # axios instance + interceptors + per-resource endpoints
│   ├── config/           # routes const, env
│   ├── lib/              # tokenStorage, suspense-resource helper, cn util
│   └── ui/               # shadcn-generated components
├── App.tsx
└── main.tsx
```

---

# Phases

Each phase is self-contained — a fresh conversation can resume from any phase by reading `PLAN.md`, the prior phase's commit, and the brief.

## Phase 0 — Project init & Tailwind v4 verified compile

- [x] Scaffold Vite + React 19 + TS template (`npm create vite@latest . -- --template react-ts`).
- [x] Pin React 19 + TS strict in `tsconfig.json` (`strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`).
- [x] Add path alias `@/* → src/*` to `tsconfig.json` AND `vite.config.ts` (via `vite-tsconfig-paths` or manual `resolve.alias`).
- [x] Install Tailwind v4: `npm i -D tailwindcss @tailwindcss/postcss postcss autoprefixer`. Create `postcss.config.mjs` with `@tailwindcss/postcss`. **Do NOT create `tailwind.config.js`.**
- [x] Create `src/app/styles/index.css` with `@import "tailwindcss";` + `@theme { ... }` block defining color tokens (background, foreground, primary, muted, border, ring, radius, font) and dark-mode variant.
- [x] Drop a `bg-primary text-primary-foreground` div in `App.tsx` and run `npm run dev` to verify Tailwind v4 actually compiles before any other UI work. Hard gate.
- [x] Init shadcn CLI (`npx shadcn@latest init`) targeting `src/shared/ui` and configuring `@/` alias. Generate `button` as smoke test.

### Files changed

- `PLAN.md` — Marks Phase 0 complete and records the Phase 0 file inventory.
- `package.json` — Adds Vite scripts, React 19 dependencies, Tailwind v4, and shadcn component dependencies.
- `package-lock.json` — Locks the installed npm dependency graph.
- `index.html` — Adds the Vite HTML shell that mounts the React root.
- `vite.config.ts` — Enables the React plugin and maps `@` to `src`.
- `tsconfig.json` — Adds strict project settings and the `@/*` path alias.
- `tsconfig.app.json` — Applies strict app TypeScript settings and the `@/*` path alias.
- `tsconfig.node.json` — Applies strict Node/Vite TypeScript settings and the `@/*` path alias.
- `eslint.config.js` — Adds Vite ESLint defaults plus a scoped override for generated shadcn UI exports.
- `postcss.config.mjs` — Wires Tailwind v4 through `@tailwindcss/postcss` with autoprefixer.
- `components.json` — Configures shadcn for Vite, Radix, Tailwind v4, and `src/shared/ui`.
- `README.md` — Adds the default Vite scaffold README placeholder.
- `public/favicon.svg` — Adds the Vite scaffold favicon.
- `public/icons.svg` — Adds the Vite scaffold icon sprite.
- `src/main.tsx` — Bootstraps React 19 and imports `src/app/styles/index.css`.
- `src/App.tsx` — Adds the Tailwind compile smoke UI using `bg-primary text-primary-foreground`.
- `src/App.css` — Adds Vite scaffold component CSS, currently unused by the smoke app.
- `src/index.css` — Adds Vite scaffold global CSS, superseded by `src/app/styles/index.css`.
- `src/app/styles/index.css` — Defines Tailwind v4 imports, theme tokens, dark variant, and shadcn CSS variables.
- `src/assets/hero.png` — Adds a Vite scaffold image asset.
- `src/assets/react.svg` — Adds the Vite scaffold React logo asset.
- `src/assets/vite.svg` — Adds the Vite scaffold Vite logo asset.
- `src/shared/lib/utils.ts` — Adds the shadcn `cn` helper required by generated components.
- `src/shared/ui/button.tsx` — Adds the shadcn Button component as the Phase 0 smoke test.

## Phase 1 — FSD scaffolding & shared layer

- [x] Create empty FSD folders per "Final folder layout" above with `index.ts` placeholders where slices will export.
- [x] `shared/config/routes.ts`: enum + getter functions for `/login`, `/dashboard`, `/dashboard/users`, `/dashboard/users/:id`, `/dashboard/profile` (mirror `deps/shared/const/router.const.ts` style).
- [x] `shared/config/env.ts`: typed export of `VITE_API_BASE_URL` (default `https://dummyjson.com`).
- [x] `shared/lib/tokenStorage.ts`: interface `TokenStorage` with `get/set/clear`; default localStorage impl behind it (swappable). Keys live in one constants file.
- [x] `shared/lib/createSuspenseResource.ts` (or per-page promise helpers): tiny helper that creates a promise to be passed into a `use()`-consuming child. Plus a `cache` helper keyed on URL params to avoid refetch loops on rerender.
- [x] `shared/lib/cn.ts`: shadcn `cn` util (clsx + tailwind-merge). _Kept as `shared/lib/utils.ts` (shadcn config alias points there); re-exported from `shared/lib/index.ts` so feature code can `import { cn } from '@/shared/lib'`._
- [x] `shared/api/api.ts`: single axios instance, `baseURL` from env. **Request interceptor** attaches `Authorization: Bearer ${token}` from `tokenStorage`. **Response interceptor**: on 401 → `tokenStorage.clear()` + `window.location.assign('/login')` (router-agnostic redirect since interceptor lives outside React tree).
- [x] `shared/api/endpoints.ts`: endpoint constants (`/auth/login`, `/auth/me`, `/users`, `/users/search`, `/users/:id`).
- [x] `shared/api/index.ts`: barrel.
- [x] Generate shadcn primitives that we know we'll need: `button`, `input`, `label`, `form`, `card`, `dropdown-menu`, `avatar`, `skeleton`, `sonner`, `sheet`, `tooltip`, `table`, `select`. _All except `form` were generated in Phase 0; `form` added now from `new-york-v4` style (radix-nova registry has no form entry)._

### Files changed

- `PLAN.md` — Marks Phase 1 complete and records the Phase 1 file inventory.
- `package.json` — Adds `react-hook-form`, `@hookform/resolvers`, and `zod` (pulled in by the shadcn `form` component).
- `package-lock.json` — Locks the new dependency graph.
- `src/shared/ui/form.tsx` — Adds the shadcn Form primitive (RHF + Radix Slot/Label wrappers).
- `src/shared/config/routes.ts` — Defines the `AppRoutes` enum and `getRouteLogin/Dashboard/Users/UserDetail/Profile` getters.
- `src/shared/config/env.ts` — Exports the typed `env.API_BASE_URL` (defaults to `https://dummyjson.com`).
- `src/shared/config/storage-keys.ts` — Centralizes localStorage key constants used by token storage and theme.
- `src/shared/config/index.ts` — Barrels the config module exports.
- `src/shared/lib/tokenStorage.ts` — Defines the swappable `TokenStorage` interface with a localStorage-backed default impl.
- `src/shared/lib/createSuspenseResource.ts` — Adds `createPromiseCache` and `stableKey` helpers for `use()`-friendly request memoization.
- `src/shared/lib/index.ts` — Barrels the lib module and re-exports `cn` from `utils.ts`.
- `src/shared/api/api.ts` — Configures the axios instance with the Bearer request interceptor and the 401 redirect response interceptor.
- `src/shared/api/endpoints.ts` — Lists dummyjson endpoint constants for auth and users.
- `src/shared/api/index.ts` — Barrels the api module exports.
- `src/pages/login/index.ts` — Slice barrel placeholder for the login page.
- `src/pages/dashboard-layout/index.ts` — Slice barrel placeholder for the dashboard layout page.
- `src/pages/users/index.ts` — Slice barrel placeholder for the users page.
- `src/pages/user-detail/index.ts` — Slice barrel placeholder for the user detail page.
- `src/pages/profile/index.ts` — Slice barrel placeholder for the profile page.
- `src/pages/not-found/index.ts` — Slice barrel placeholder for the not-found page.
- `src/widgets/sidebar/index.ts` — Slice barrel placeholder for the sidebar widget.
- `src/widgets/topbar/index.ts` — Slice barrel placeholder for the topbar widget.
- `src/widgets/users-table/index.ts` — Slice barrel placeholder for the users table widget.
- `src/features/auth-by-credentials/index.ts` — Slice barrel placeholder for the credentials auth feature.
- `src/features/logout/index.ts` — Slice barrel placeholder for the logout feature.
- `src/features/theme-toggle/index.ts` — Slice barrel placeholder for the theme toggle feature.
- `src/features/users-search/index.ts` — Slice barrel placeholder for the users search feature.
- `src/features/users-pagination/index.ts` — Slice barrel placeholder for the users pagination feature.
- `src/features/users-sort/index.ts` — Slice barrel placeholder for the users sort feature.
- `src/entities/user/index.ts` — Slice barrel placeholder for the user entity.

## Phase 2 — App bootstrap, router, error & theme providers

- [x] `src/main.tsx`: createRoot + StrictMode + `<App />`. Import `app/styles/index.css`.
- [x] `src/App.tsx`: compose providers — `<ThemeProvider><Toaster /><BrowserRouter><AppRouter /></BrowserRouter></ThemeProvider>` wrapped in a global `<ErrorBoundary>`.
- [x] `app/providers/ErrorBoundary.tsx`: class component with shadcn-styled fallback (card + retry button).
- [x] `app/providers/ThemeProvider.tsx`: class-based dark mode (`document.documentElement.classList.add('dark')`); persist in localStorage; expose `useTheme()`.
- [x] `app/providers/router/AppRouter.tsx`: `<Routes>` mapping route config; wrap each route element in per-route `<Suspense fallback={<RouteSkeleton />}>`.
- [x] `app/providers/router/RequireAuth.tsx`: read `tokenStorage`; `<Navigate to="/login" replace />` if no token; otherwise `<Outlet />`.
- [x] `app/providers/router/routes.tsx`: route tree — `/login` (public), `/dashboard` (protected, layout) → `users`, `users/:id`, `profile`; `/` redirects to `/dashboard/users`; `*` → NotFound.
- [x] Wire `nuqs` `<NuqsAdapter>` (react-router adapter) high in the tree.

### Files changed

- `package.json` — Adds `react-router` and `nuqs` dependencies; removes unused `next-themes`.
- `package-lock.json` — Locks the updated dependency graph.
- `src/App.tsx` — Composes the full provider tree: ErrorBoundary → BrowserRouter → ThemeProvider → NuqsAdapter → AppRouter + Toaster.
- `src/app/providers/ThemeProvider.tsx` — Class-based dark mode provider with localStorage persistence and `useTheme()` hook; replaces `next-themes`.
- `src/app/providers/ErrorBoundary.tsx` — React class-component error boundary with a shadcn-styled fallback card and retry button.
- `src/app/providers/router/AppRouter.tsx` — Renders the route tree with per-route Suspense fallbacks and RequireAuth wrapping for protected routes.
- `src/app/providers/router/RequireAuth.tsx` — Route guard that checks tokenStorage and redirects to /login if no access token is present.
- `src/app/providers/router/RouteSkeleton.tsx` — Generic skeleton fallback rendered inside each route's Suspense boundary.
- `src/app/providers/router/routes.tsx` — Declarative route tree with placeholder page components; defines public, protected, and catch-all routes.
- `src/app/providers/router/index.ts` — Barrel export for the router provider module.
- `src/shared/ui/sonner.tsx` — Replaced `next-themes` useTheme import with the custom ThemeProvider's useTheme.

## Phase 3 — Auth: login page, RHF + zod, end-to-end verified

- [x] `entities/user/model/types.ts`: `User`, `AuthResponse` types (infer where possible).
- [x] `features/auth-by-credentials/model/schema.ts`: zod schema (`username` min 1, `password` min 1); export `LoginInput = z.infer<...>`.
- [x] `features/auth-by-credentials/api/login.ts`: `loginRequest(input): Promise<AuthResponse>` calling `POST /auth/login`.
- [x] `features/auth-by-credentials/ui/LoginForm.tsx`: shadcn `Form` + RHF + `zodResolver`; on submit → `loginRequest` → `tokenStorage.set` → store user (lightweight `currentUser` in lib or a slim context) → `navigate('/dashboard/users')`. Inline errors per-field; top-level error banner on 400; toast on network errors.
- [x] `pages/login/ui/LoginPage.tsx`: centered card; title; `LoginForm`; muted hint card showing `emilys / emilyspass`.
- [x] Verify end-to-end in dev server: bad creds show 400 banner; good creds redirect to `/dashboard/users` (placeholder route OK at this stage).

### Files changed

- `src/entities/user/model/types.ts` — Defined User and AuthResponse types.
- `src/entities/user/index.ts` — Exported user types.
- `src/features/auth-by-credentials/model/schema.ts` — Defined login validation schema.
- `src/features/auth-by-credentials/api/login.ts` — Implemented login API request.
- `src/features/auth-by-credentials/ui/LoginForm.tsx` — Built the login form with validation and auth logic.
- `src/features/auth-by-credentials/index.ts` — Exported login feature components.
- `src/pages/login/ui/LoginPage.tsx` — Built the login page UI.
- `src/pages/login/index.ts` — Added default export for lazy loading.
- `src/app/providers/router/routes.tsx` — Integrated real LoginPage with lazy loading.

## Phase 4 — Protected dashboard layout (sidebar + topbar)

- [ ] `widgets/sidebar/ui/Sidebar.tsx`: vertical nav; logo/app-name top; nav list (currently one item: "Users", `Users` lucide icon, link to `/dashboard/users`); active styling via `NavLink` `isActive`. Mirrors `deps/app/layouts/app-sidebar` composition (label + icon column).
- [ ] Mobile: replace `Sidebar` with a `Sheet` triggered by hamburger button in topbar at `<md` breakpoint.
- [ ] `widgets/topbar/ui/Topbar.tsx`: right-aligned cluster — `ThemeToggle` + profile `DropdownMenu` (avatar trigger; items: "Profile" → `/dashboard/profile`, "Logout" → `useLogout()`).
- [ ] `features/logout/model/useLogout.ts`: `tokenStorage.clear()` → toast "Signed out" → `navigate('/login')`.
- [ ] `features/theme-toggle/ui/ThemeToggle.tsx`: shadcn icon button toggling `useTheme()`.
- [ ] `pages/dashboard-layout/ui/DashboardLayout.tsx`: CSS-grid shell — sidebar (left, hidden on mobile) + main column (topbar + `<Outlet />`). Use CSS vars `--topbar-height` / `--sidebar-width` per `deps` convention.
- [ ] Wire `RequireAuth` → `DashboardLayout` in routes config.
- [ ] Verify: post-login lands in shell; logout clears token + redirects; dropdown is keyboard-navigable.

## Phase 5 — Users page (TanStack Table, nuqs, use() + Suspense)

- [ ] `entities/user/ui/UserAvatar.tsx`: shadcn `Avatar` with image + initials fallback.
- [ ] `shared/api/users.ts`: `getUsers({ limit, skip, sortBy, order })`, `searchUsers({ q, limit, skip, sortBy, order })`. Both return `{ users, total, skip, limit }`. Include a small in-memory cache keyed by serialized params so re-renders don't refetch identical promises (required for `use()` to be stable).
- [ ] `features/users-search/ui/UsersSearch.tsx`: shadcn `Input`; `useTransition`; on change, `startTransition(() => setQ(value))` where `setQ` writes to nuqs URL state. Surface `isPending` as a subtle spinner inside the input.
- [ ] `features/users-pagination/ui/UsersPagination.tsx`: page controls + page-size `Select` (10/25/50). State via nuqs `useQueryStates({ page: parseAsInteger.withDefault(1), pageSize: parseAsInteger.withDefault(10) })`.
- [ ] `features/users-sort/lib/useSortQuery.ts`: nuqs `sortBy` + `order` (`asc` | `desc`). Helper to toggle on header click.
- [ ] `widgets/users-table/ui/UsersTable.tsx`: TanStack Table; columns — avatar+name, email, phone, age, company.name, role; tooltips on truncated cells; clickable header buttons (real `<button>`s) calling sort helper; row click `navigate(/dashboard/users/:id)`.
- [ ] `widgets/users-table/ui/TableSkeleton.tsx`: rows of shadcn `Skeleton` matching final layout.
- [ ] `pages/users/ui/UsersPage.tsx`: read URL state via nuqs → build params → `const promise = useMemo(() => fetchUsers(params), [params])` → render `<Suspense fallback={<TableSkeleton/>}><UsersTableData promise={promise} /></Suspense>` wrapped in `<ErrorBoundary>`. Search input lives outside Suspense.
- [ ] `pages/users/ui/UsersTableData.tsx`: calls `use(promise)` and renders `UsersTable`.
- [ ] Empty state when search returns 0 rows.
- [ ] Verify in browser: pagination, search debounced via transition (URL updates without input lag), column sort toggles, deep-link `?q=foo&page=2&sortBy=email&order=asc` loads the correct view, row click navigates.

## Phase 6 — User detail page

- [ ] `pages/user-detail/ui/UserDetailPage.tsx`: param `:id` via `useParams` → `const promise = useMemo(() => getUserById(id), [id])` → `<Suspense fallback={<UserDetailSkeleton/>}><UserDetailContent promise={promise}/></Suspense>`.
- [ ] `pages/user-detail/ui/UserDetailContent.tsx`: `use(promise)`, render avatar header + info grid (email/phone/age/role/birth date) + address card + company card + bank/crypto details.
- [ ] Back link to `/dashboard/users` (preserve query state if cheap — nuqs handles).

## Phase 7 — Profile page

- [ ] `pages/profile/ui/ProfilePage.tsx`: same `use()` pattern fetching `GET /auth/me`. Reuse `UserDetailContent` layout primitives where they fit.

## Phase 8 — Polish, accessibility, responsiveness

- [ ] Empty states everywhere there's a list.
- [ ] Audit focus rings (Tailwind `focus-visible:ring-*` on all interactive elements).
- [ ] Verify keyboard nav for dropdown, sort headers, pagination, table rows.
- [ ] Verify mobile breakpoints: sidebar collapses to `Sheet`, table scrolls horizontally if cramped.
- [ ] Verify dark mode flips entire app (no hardcoded light-mode colors).
- [ ] Confirm 401 from any endpoint redirects to `/login` with a toast.

## Phase 9 — README & docs

- [ ] `README.md` covering: launch (`npm i` / `npm run dev` / `npm run build`); stack & versions table; architecture decisions (FSD; `use()` over TanStack Query — smaller surface, brief asked for `use`; `useTransition` debounce — no extra dep, native React 19 idiom; nuqs — URL-as-state for shareable views); trade-offs left for later (tests, virtualization for large lists, optimistic updates, error retry strategies); test creds (`emilys / emilyspass`); link to dummyjson docs.
- [ ] `docs/screenshots/` placeholder folder + `.gitkeep`; reference paths from README.

---

## Verification (end-to-end)

Each phase ends with a runnable dev server. The full acceptance check after Phase 9:

1. `npm run dev` — app boots; `/` redirects to `/login`.
2. Submit `emilys` + wrong password → 400 banner inline.
3. Submit `emilys / emilyspass` → redirect to `/dashboard/users`; URL shows `?page=1&pageSize=10` (or sensible default).
4. Type "john" in search → URL updates to `?q=john`, table shows skeleton then results, input shows pending spinner mid-transition.
5. Click "Email" header → URL gains `sortBy=email&order=asc`; second click flips to `desc`.
6. Change page size to 25 → URL + table update.
7. Click a row → navigate to `/dashboard/users/:id`, full profile renders via Suspense fallback.
8. Open profile dropdown → keyboard-navigable; "Profile" link works; "Logout" clears token, toasts, redirects to `/login`.
9. Manually delete the access token from devtools while on `/dashboard/users` and trigger a fetch → 401 interceptor redirects to `/login`.
10. Toggle dark mode → entire app flips cleanly; preference persists across reload.
11. Resize to mobile width → sidebar becomes `Sheet`; topbar gains hamburger.
12. `npm run build` → typechecks (strict, no `any`) and bundles successfully.

## Critical files to create/modify (quick index)

- `vite.config.ts`, `tsconfig.json`, `postcss.config.mjs` — Tailwind v4 + alias config.
- `src/app/styles/index.css` — `@import "tailwindcss"` + `@theme` tokens.
- `src/main.tsx`, `src/App.tsx` — bootstrap.
- `src/app/providers/router/{AppRouter,RequireAuth,routes}.tsx` — routing.
- `src/shared/api/{api,endpoints,users}.ts` — API layer.
- `src/shared/lib/{tokenStorage,createSuspenseResource,cn}.ts` — utilities.
- `src/shared/config/{routes,env}.ts` — constants.
- `src/features/auth-by-credentials/{model/schema,api/login,ui/LoginForm}.ts(x)` — auth.
- `src/widgets/{sidebar,topbar,users-table}/ui/*.tsx` — composite UI.
- `src/pages/{login,dashboard-layout,users,user-detail,profile}/ui/*.tsx` — routes.
- `README.md` — docs.
