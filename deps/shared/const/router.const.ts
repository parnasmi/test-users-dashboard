export const AppRoutes = {
	// Main pages (Default views)
	DASHBOARD: 'dashboard',

	// Module roots
	DASHBOARD_ROOT: 'dashboard_root',

	// Specialized pages
	DASHBOARD_REVENUE: 'dashboard_revenue',

	// Other
	USER_PROFILE: 'user-profile',
	LOGOUT: 'logout'
} as const

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes]

export const AuthRoutes = {
	LOGIN: 'login',
	REGISTER: 'register'
} as const

export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes]

// Base Routes
export const getAppsRoute = () => '/app'
export const getRouteAuth = () => '/auth'
export const getRouteForbidden = () => '/forbidden'

// Auth
export const getRouteAuthLogin = () => '/auth/login'
export const getRouteAuthRegister = () => '/auth/register'
export const getPathLogin = () => 'login'
export const getPathRegister = () => 'register'

// Dashboard
export const getRouteDashboardOverview = () => `${getAppsRoute()}/dashboard/overview`
export const getRouteDashboardRevenue = () => `${getAppsRoute()}/dashboard/revenue`

// Shared / Other
export const getRouteUserProfile = () => `${getAppsRoute()}/user-profile`
export const getRouteLogout = () => `${getAppsRoute()}/logout`
