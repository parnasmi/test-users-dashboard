export const AppRoutes = {
	// Main pages (Default views)
	DASHBOARD: 'dashboard',
	SALES: 'sales',
	CRM: 'crm',
	WMS: 'wms',
	PROCUREMENT: 'procurement',
	PRODUCTION: 'production',
	ACCOUNTING: 'accounting',
	HRM: 'hrm',
	FMS: 'fms',

	// Module roots
	DASHBOARD_ROOT: 'dashboard_root',
	SALES_ROOT: 'sales_root',
	CRM_ROOT: 'crm_root',
	WMS_ROOT: 'wms_root',
	PROCUREMENT_ROOT: 'procurement_root',
	PRODUCTION_ROOT: 'production_root',
	ACCOUNTING_ROOT: 'accounting_root',
	HRM_ROOT: 'hrm_root',
	FMS_ROOT: 'fms_root',

	// Specialized pages
	DASHBOARD_REVENUE: 'dashboard_revenue',
	SALES_OFFERS: 'sales_offers',
	CRM_TASKS: 'crm_tasks',
	WMS_ZONES: 'wms_zones',
	PROCUREMENT_SUPPLIERS: 'procurement_suppliers',
	PRODUCTION_ORDERS: 'production_orders',
	ACCOUNTING_LOGISTICS: 'accounting_logistics',
	HRM_RECRUITMENT: 'hrm_recruitment',
	FMS_DASHBOARD: 'fms_dashboard',

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

// Sales
export const getRouteSalesOrders = () => `${getAppsRoute()}/sales/orders`
export const getRouteSalesOffers = () => `${getAppsRoute()}/sales/offers`

// CRM
export const getRouteCrmCompany = () => `${getAppsRoute()}/crm/company`
export const getRouteCrmTasks = () => `${getAppsRoute()}/crm/tasks`

// WMS
export const getRouteWmsInventory = () => `${getAppsRoute()}/wms/inventory`
export const getRouteWmsZones = () => `${getAppsRoute()}/wms/zones`

// Procurement
export const getRouteProcurementRequests = () => `${getAppsRoute()}/procurement/requests`
export const getRouteProcurementSuppliers = () => `${getAppsRoute()}/procurement/suppliers`

// Production
export const getRouteProductionLines = () => `${getAppsRoute()}/production/lines`
export const getRouteProductionOrders = () => `${getAppsRoute()}/production/orders`

// Accounting
export const getRouteAccountingOverview = () => `${getAppsRoute()}/accounting/overview`
export const getRouteAccountingLogistics = () => `${getAppsRoute()}/accounting/logistics`

// HRM
export const getRouteHrmHeadcount = () => `${getAppsRoute()}/hrm/headcount`
export const getRouteHrmRecruitment = () => `${getAppsRoute()}/hrm/recruitment`

// FMS
export const getRouteFmsMap = () => `${getAppsRoute()}/fms/map`
export const getRouteFmsDashboard = () => `${getAppsRoute()}/fms/dashboard`

// Shared / Other
export const getRouteUserProfile = () => `${getAppsRoute()}/user-profile`
export const getRouteLogout = () => `${getAppsRoute()}/logout`
