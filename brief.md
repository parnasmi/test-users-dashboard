# Users Dashboard — Test Task

Build a production-quality Users Dashboard. This is a job application test task, so code quality, architecture cleanliness, and thoughtful decisions matter as much as feature completeness.

## Reference materials (read these first)

- `./deps/` — existing code from a previous project. **Use it as the source of truth** for App bootstrap and routing configuration patterns. Mirror the structure and conventions, but **do NOT copy the `ScrollContainer`** — it's not needed here.
- `./deps/shared/api/` — reference this when configuring the API layer.
- API: https://dummyjson.com/users
- Auth API: https://dummyjson.com/docs/auth
- Users API docs: https://dummyjson.com/docs/users

Before writing any code, explore `./deps/` thoroughly and summarize what patterns you'll reuse.

## Architecture

**Feature-Sliced Design (FSD)** — strict layer hierarchy: `app → pages → widgets → features → entities → shared`. Lower layers must not import from higher ones. Each slice has `ui/`, `model/`, `api/`, `lib/` segments as needed. Use the public API pattern (each slice exports through `index.ts`).

If a `frontend-design` skill or similar is available, read its `SKILL.md` first.

## Stack — all latest versions

- **Vite** (latest) + **React 19** (latest) + **TypeScript** (latest, strict mode)
- **Tailwind CSS v4** — use the new `@tailwindcss/postcss` plugin via `postcss.config.mjs`. **Do NOT create a `tailwind.config.js`** — configure tokens via CSS `@theme` directives in the main CSS file. This is mandatory.
- **shadcn/ui** (latest) — install components as needed via the CLI
- **react-router v7** — the package named `react-router` (NOT `react-router-dom`)
- **axios** (latest) + **@tanstack/react-table** (latest) + **nuqs** (latest) + **zod** (latest, for form validation)
- **react-hook-form** (latest) for the auth form

## Implementation requirements

### 1. API layer (`shared/api`)

- Single `axios` instance in `api.ts` with `baseURL: https://dummyjson.com`.
- **Request interceptor**: attach `Authorization: Bearer <token>` from token storage when present.
- **Response interceptor**: on 401, clear token and redirect to `/login`.
- Token storage helper in `shared/lib` (localStorage-based, but abstracted so it's swappable).

### 2. Auth (`/login`)

- Form with `username` + `password`, validated with `zod` + `react-hook-form`.
- Hits `POST https://dummyjson.com/auth/login`. On success, store the `accessToken` and the returned user, redirect to `/dashboard/users`.
- Show inline form errors and a top-level error for failed auth (wrong creds → API returns 400).
- Helpful UX detail: show example credentials from dummyjson (e.g., `emilys / emilyspass`) as a hint under the form — recruiters will appreciate not having to hunt for them.

### 3. Protected layout (`/dashboard/*`)

- Route guard: redirect to `/login` if no token.
- Layout = persistent **sidebar** (left) + **topbar** (right column).
- Sidebar: app logo/name + nav list. Currently one item: "Users" (with icon). Active route gets active styling — and since "Users" is the only/default route, it's active by default.
- Topbar: right-aligned **profile dropdown** (shadcn `DropdownMenu`) triggered by an avatar/icon button. Items:
  1. "Profile" → links to `/dashboard/profile`
  2. "Logout" → clears token, redirects to `/login`

### 4. Users page (`/dashboard/users`) — the core feature

- **TanStack Table v8** rendering users from `GET /users?limit=&skip=&q=`.
- **Columns**: avatar + name, email, phone, age, company name, role. Pick sensible widths; truncate overflow with tooltips where helpful.
- **Pagination**: server-side. Page state lives in URL via **nuqs** (`?page=2&pageSize=10`). Pagination controls at the bottom of the table. Page size selector (10 / 25 / 50).
- **Search**: input above the table, syncs to URL as `?q=...`. Debounce with **`useTransition`** (mark the URL update + fetch as a transition; show a subtle "loading" indicator via `isPending`). Hits `/users/search?q=` when `q` is non-empty.
- **Sorting**: click column headers to sort. Sort state in URL (`?sortBy=email&order=asc`). Maps to dummyjson's `sortBy` + `order` params.
- **Data fetching**: use the React 19 **`use()` hook** pattern — create a promise in the parent, pass it to a child component that calls `use()`, wrap that child in `<Suspense fallback={<TableSkeleton />}>` and `<ErrorBoundary>`. Do NOT use `useEffect` + `useState` for fetching. Use **shadcn `Skeleton`** component for the skeleton rows.
- Row click → navigates to `/dashboard/users/:id` (a detail/profile-style page rendering that user's full data).

### 5. Profile page (`/dashboard/profile`)

- Displays the currently logged-in user's data (from the auth response / `/auth/me` with the token). Same `use()` + Suspense + Skeleton pattern.
- Clean, scannable layout: avatar, key info grid, address, company, etc.

### 6. Error & loading states

- Global `<ErrorBoundary>` with a clean fallback UI (shadcn-styled).
- Per-route Suspense with skeletons matching the final layout — never a generic spinner.
- Toast on logout / auth errors (shadcn `Sonner` or `Toaster`).

## FSD layout sketch

```
src/
├── app/              # providers, router, global styles
├── pages/            # login, dashboard-layout, users, user-detail, profile
├── widgets/          # sidebar, topbar, users-table
├── features/         # auth-by-credentials, logout, users-search, users-pagination
├── entities/         # user (model + ui card/row primitives)
└── shared/
    ├── api/          # axios instance, interceptors, endpoints
    ├── config/       # env, routes constants
    ├── lib/          # token storage, debounce-via-transition helper, etc.
    └── ui/           # shadcn components live here (or in shared/ui/shadcn)
```

## Quality bar — implement these "small extras" (no overengineering)

- TypeScript strict mode + no `any`. Infer types from zod schemas where relevant.
- Path aliases (`@/...`) configured in `vite.config.ts` + `tsconfig.json`.
- `pnpm` or `npm` lockfile committed.
- Empty state for the table (no results for a search query).
- Keyboard accessible: focus rings, dropdown nav, table header buttons are real `<button>`s.
- Responsive: sidebar collapses to a sheet on mobile (shadcn `Sheet`).
- Minimal but real dark mode toggle in the topbar (shadcn theme — adds polish for ~15 min of work).

**Do NOT add**: state management libraries (Zustand/Redux), form libraries beyond RHF, testing setup (the brief doesn't ask), i18n, complex caching layers. Keep it focused.

## README

Write a thorough README covering:

1. **Launch instructions** (install + dev + build).
2. **Stack & versions** — short table.
3. **Architecture decisions** — why FSD, why `use()` over TanStack Query here (smaller surface, brief asked for `use` hook explicitly), why `useTransition` for debounce vs lodash/use-debounce, why nuqs.
4. **Trade-offs** — what you'd add with more time (tests, virtualization for very large lists, optimistic updates).
5. **Screenshots** — placeholders in `docs/screenshots/`; I'll capture them after.
6. **Test credentials** from dummyjson.

## Working agreement

- Plan first: before coding, output a short plan covering (a) what you found in `./deps/`, (b) the file tree you'll create, (c) the order of implementation. Wait for me to confirm before scaffolding.
- Commit in logical chunks with clean messages (`feat:`, `chore:`, `refactor:`).
- After scaffolding, run the dev server and verify the login flow works end-to-end before moving to the Users page.
- If you hit a real ambiguity, ask. Don't invent requirements.
- Tailwind v4 setup is the most common place to slip — verify the `@tailwindcss/postcss` + `@import "tailwindcss"` + `@theme` setup actually compiles before building UI on top of it.

Begin by reading `./deps/` and producing the plan.
