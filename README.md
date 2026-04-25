# Users Dashboard

A production-quality Users Dashboard built with React 19, Vite, and Tailwind CSS v4. This project demonstrates modern React patterns, Feature-Sliced Design (FSD) architecture, and seamless server-side state synchronization.

Yes, I developed this app with ai coding agent. And I think, the AI era didn't change how we build software. It just made the loop faster.
The fundamental cycle is still the same:
Write code → verify it works → write code → verify it works.
Test. Lint. Make sure it runs. Add more tests. Lint again. Ship.
Piecemeal. One step at a time. Hands on the wheel.
What changed is the speed. With tools like Cursor and Claude Code, I can move through that loop 2-3x faster than before. But skipping the loop? That's where things break.

## Launch Instructions

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run in development mode**:

   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Stack & Versions

| Concern       | Choice          | Version |
| ------------- | --------------- | ------- |
| Build Tool    | Vite            | ^6.0.0  |
| Framework     | React           | ^19.0.0 |
| Language      | TypeScript      | ^5.7.0  |
| Styling       | Tailwind CSS    | ^4.0.0  |
| UI Components | shadcn/ui       | Latest  |
| Routing       | React Router    | ^7.0.0  |
| HTTP Client   | Axios           | ^1.7.0  |
| Table         | TanStack Table  | ^8.20.0 |
| URL State     | nuqs            | ^2.0.0  |
| Form          | React Hook Form | ^7.54.0 |
| Validation    | Zod             | ^3.24.0 |

## Architecture Decisions

### 1. Feature-Sliced Design (FSD)

The project follows FSD methodology to ensure a clean separation of concerns and a scalable codebase. Layers are strictly organized: `app → pages → widgets → features → entities → shared`.

### 2. React 19 `use()` Hook

Instead of traditional `useEffect` + `useState` or heavy libraries like TanStack Query, we utilize the new React 19 `use()` hook combined with `<Suspense>` and `<ErrorBoundary>`. This simplifies data fetching and provides a native way to handle async resources.

### 3. `useTransition` for Search Debounce

Search input updates are wrapped in `startTransition`. This allows React to prioritize typing interactions while the URL update and subsequent data fetch happen in the background. It provides a smoother experience without the need for traditional `setTimeout`-based debounce.

### 4. `nuqs` for URL State

Table state (page, page size, search query, sorting) is synchronized with the URL using `nuqs`. This makes the application state fully shareable and ensures the "Back" button works as expected.

## Trade-offs & Future Improvements

- **Testing**: In a real-world scenario, I would add Unit tests (Vitest) for business logic and E2E tests (Playwright) for critical user flows.
- **Virtualization**: For extremely large lists, TanStack Virtual would be integrated to maintain 60fps scrolling.
- **Optimistic Updates**: For data-modifying actions, optimistic UI updates would enhance perceived performance.
- **Retry Logic**: Implementing a more robust retry strategy for failed requests.

## Test Credentials

Use the following credentials from `dummyjson.com` to log in:

- **Username**: `emilys`
- **Password**: `emilyspass`
