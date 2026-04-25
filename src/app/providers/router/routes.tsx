import { Navigate, Outlet } from 'react-router'
import type { ReactNode } from 'react'
import {
  getRouteLogin,
  getRouteDashboard,
  getRouteUsers,
  getRouteUserDetailPattern,
  getRouteProfile,
} from '@/shared/config'

export type RouteConfig = {
  path: string
  element: ReactNode
  authOnly?: boolean
  children?: RouteConfig[]
}

// Placeholder page components — will be replaced with real lazy imports in later phases
function LoginPagePlaceholder() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="rounded-lg bg-card px-6 py-4 text-card-foreground ring-1 ring-foreground/10">
        Login Page — Phase 3
      </div>
    </div>
  )
}

function DashboardLayoutPlaceholder() {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-60 border-r bg-card md:block">
        <div className="p-4 text-sm text-muted-foreground">Sidebar — Phase 4</div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4">
          <span className="text-sm text-muted-foreground">Topbar — Phase 4</span>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function UsersPagePlaceholder() {
  return <div className="text-muted-foreground">Users Page — Phase 5</div>
}

function UserDetailPagePlaceholder() {
  return <div className="text-muted-foreground">User Detail Page — Phase 6</div>
}

function ProfilePagePlaceholder() {
  return <div className="text-muted-foreground">Profile Page — Phase 7</div>
}

function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <a
        href={getRouteUsers()}
        className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Go to Dashboard
      </a>
    </div>
  )
}

export const routeTree: RouteConfig[] = [
  // Root → redirect to dashboard/users
  {
    path: '/',
    element: <Navigate to={getRouteUsers()} replace />,
  },
  // Public routes
  {
    path: getRouteLogin(),
    element: <LoginPagePlaceholder />,
  },
  // Protected routes (wrapped in RequireAuth via AppRouter)
  {
    path: getRouteDashboard(),
    element: <DashboardLayoutPlaceholder />,
    authOnly: true,
    children: [
      {
        path: getRouteDashboard(),
        element: <Navigate to={getRouteUsers()} replace />,
      },
      {
        path: getRouteUsers(),
        element: <UsersPagePlaceholder />,
      },
      {
        path: getRouteUserDetailPattern(),
        element: <UserDetailPagePlaceholder />,
      },
      {
        path: getRouteProfile(),
        element: <ProfilePagePlaceholder />,
      },
    ],
  },
  // Catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
