export const AppRoutes = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  PROFILE: 'profile',
  NOT_FOUND: 'not-found',
} as const

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes]

export const getRouteRoot = () => '/'
export const getRouteLogin = () => '/login'
export const getRouteDashboard = () => '/dashboard'
export const getRouteUsers = () => '/dashboard/users'
export const getRouteUserDetail = (id: string | number) => `/dashboard/users/${id}`
export const getRouteUserDetailPattern = () => '/dashboard/users/:id'
export const getRouteProfile = () => '/dashboard/profile'
