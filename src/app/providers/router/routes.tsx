import { Navigate } from 'react-router'
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

import { lazy } from 'react'

const LoginPage = lazy(() => import('@/pages/login'))
import { DashboardLayout } from '@/pages/dashboard-layout'

import { UsersPage } from '@/pages/users'

const UserDetailPage = lazy(() => import('@/pages/user-detail'))
const ProfilePage = lazy(() => import('@/pages/profile'))

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
    element: <LoginPage />,
  },
  // Protected routes (wrapped in RequireAuth via AppRouter)
  {
    path: getRouteDashboard(),
    element: <DashboardLayout />,
    authOnly: true,
    children: [
      {
        path: getRouteDashboard(),
        element: <Navigate to={getRouteUsers()} replace />,
      },
      {
        path: getRouteUsers(),
        element: <UsersPage />,
      },
      {
        path: getRouteUserDetailPattern(),
        element: <UserDetailPage />,
      },
      {
        path: getRouteProfile(),
        element: <ProfilePage />,
      },
    ],
  },
  // Catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
