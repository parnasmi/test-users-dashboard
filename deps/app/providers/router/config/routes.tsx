import { Navigate } from 'react-router'
import { AccountingPage, LogisticsPage } from '@/pages/accounting'
import { LogoutRoute } from '@/pages/auth'
import { CrmPage, TasksPage } from '@/pages/crm'
import { DashboardPage, RevenuePage } from '@/pages/dashboard'
import { FmsPage, FmsDashboardPage } from '@/pages/fms'
import { HrmPage, RecruitmentPage } from '@/pages/hrm'
import { ProcurementPage, SuppliersPage } from '@/pages/procurement'
import { ProductionPage, ProductionOrdersPage } from '@/pages/production'
import { SalesPage, OffersPage } from '@/pages/sales'
import { WmsPage, ZonesPage } from '@/pages/wms'
import {
	AppRoutes,
	AuthRoutes,
	getAppsRoute,
	getRouteAccountingOverview,
	getRouteAccountingLogistics,
	getRouteCrmCompany,
	getRouteCrmTasks,
	getRouteDashboardOverview,
	getRouteDashboardRevenue,
	getRouteFmsMap,
	getRouteFmsDashboard,
	getRouteHrmHeadcount,
	getRouteHrmRecruitment,
	getRouteProcurementRequests,
	getRouteProcurementSuppliers,
	getRouteProductionLines,
	getRouteProductionOrders,
	getRouteSalesOrders,
	getRouteSalesOffers,
	getRouteWmsInventory,
	getRouteWmsZones,
	getPathLogin,
	getPathRegister
} from '@/shared/const/router.const'
import type { AllowedProducts } from '@/shared/types/requests.types'

export type AppRoutesProps = {
	path: string
	element: React.ReactNode
	authOnly?: boolean
	availableIn?: AllowedProducts[]
}

export const routes: Record<AppRoutes, AppRoutesProps> = {
	// Dashboard
	[AppRoutes.DASHBOARD_ROOT]: {
		path: `${getAppsRoute()}/dashboard`,
		element: <Navigate replace to={getRouteDashboardOverview()} />,
		authOnly: true
	},
	[AppRoutes.DASHBOARD]: {
		path: getRouteDashboardOverview(),
		element: <DashboardPage />,
		authOnly: true
	},
	[AppRoutes.DASHBOARD_REVENUE]: {
		path: getRouteDashboardRevenue(),
		element: <RevenuePage />,
		authOnly: true
	},

	// Sales
	[AppRoutes.SALES_ROOT]: {
		path: `${getAppsRoute()}/sales`,
		element: <Navigate replace to={getRouteSalesOrders()} />,
		authOnly: true
	},
	[AppRoutes.SALES]: {
		path: getRouteSalesOrders(),
		element: <SalesPage />,
		authOnly: true,
		availableIn: ['sales']
	},
	[AppRoutes.SALES_OFFERS]: {
		path: getRouteSalesOffers(),
		element: <OffersPage />,
		authOnly: true,
		availableIn: ['sales']
	},

	// CRM
	[AppRoutes.CRM_ROOT]: {
		path: `${getAppsRoute()}/crm`,
		element: <Navigate replace to={getRouteCrmCompany()} />,
		authOnly: true
	},
	[AppRoutes.CRM]: {
		path: getRouteCrmCompany(),
		element: <CrmPage />,
		authOnly: true,
		availableIn: ['crm']
	},
	[AppRoutes.CRM_TASKS]: {
		path: getRouteCrmTasks(),
		element: <TasksPage />,
		authOnly: true,
		availableIn: ['crm']
	},

	// WMS
	[AppRoutes.WMS_ROOT]: {
		path: `${getAppsRoute()}/wms`,
		element: <Navigate replace to={getRouteWmsInventory()} />,
		authOnly: true
	},
	[AppRoutes.WMS]: {
		path: getRouteWmsInventory(),
		element: <WmsPage />,
		authOnly: true,
		availableIn: ['wms']
	},
	[AppRoutes.WMS_ZONES]: {
		path: getRouteWmsZones(),
		element: <ZonesPage />,
		authOnly: true,
		availableIn: ['wms']
	},

	// Procurement
	[AppRoutes.PROCUREMENT_ROOT]: {
		path: `${getAppsRoute()}/procurement`,
		element: <Navigate replace to={getRouteProcurementRequests()} />,
		authOnly: true
	},
	[AppRoutes.PROCUREMENT]: {
		path: getRouteProcurementRequests(),
		element: <ProcurementPage />,
		authOnly: true,
		availableIn: ['procurement']
	},
	[AppRoutes.PROCUREMENT_SUPPLIERS]: {
		path: getRouteProcurementSuppliers(),
		element: <SuppliersPage />,
		authOnly: true,
		availableIn: ['procurement']
	},

	// Production
	[AppRoutes.PRODUCTION_ROOT]: {
		path: `${getAppsRoute()}/production`,
		element: <Navigate replace to={getRouteProductionLines()} />,
		authOnly: true
	},
	[AppRoutes.PRODUCTION]: {
		path: getRouteProductionLines(),
		element: <ProductionPage />,
		authOnly: true,
		availableIn: ['production']
	},
	[AppRoutes.PRODUCTION_ORDERS]: {
		path: getRouteProductionOrders(),
		element: <ProductionOrdersPage />,
		authOnly: true,
		availableIn: ['production']
	},

	// Accounting
	[AppRoutes.ACCOUNTING_ROOT]: {
		path: `${getAppsRoute()}/accounting`,
		element: <Navigate replace to={getRouteAccountingOverview()} />,
		authOnly: true
	},
	[AppRoutes.ACCOUNTING]: {
		path: getRouteAccountingOverview(),
		element: <AccountingPage />,
		authOnly: true,
		availableIn: ['accounting']
	},
	[AppRoutes.ACCOUNTING_LOGISTICS]: {
		path: getRouteAccountingLogistics(),
		element: <LogisticsPage />,
		authOnly: true,
		availableIn: ['accounting']
	},

	// HRM
	[AppRoutes.HRM_ROOT]: {
		path: `${getAppsRoute()}/hrm`,
		element: <Navigate replace to={getRouteHrmHeadcount()} />,
		authOnly: true
	},
	[AppRoutes.HRM]: {
		path: getRouteHrmHeadcount(),
		element: <HrmPage />,
		authOnly: true,
		availableIn: ['hrm']
	},
	[AppRoutes.HRM_RECRUITMENT]: {
		path: getRouteHrmRecruitment(),
		element: <RecruitmentPage />,
		authOnly: true,
		availableIn: ['hrm']
	},

	// FMS
	[AppRoutes.FMS_ROOT]: {
		path: `${getAppsRoute()}/fms`,
		element: <Navigate replace to={getRouteFmsMap()} />,
		authOnly: true
	},
	[AppRoutes.FMS]: {
		path: getRouteFmsMap(),
		element: <FmsPage />,
		authOnly: true,
		availableIn: ['fms']
	},
	[AppRoutes.FMS_DASHBOARD]: {
		path: getRouteFmsDashboard(),
		element: <FmsDashboardPage />,
		authOnly: true,
		availableIn: ['fms']
	},

	// Other
	[AppRoutes.LOGOUT]: {
		path: '/app/logout', // Using string directly here as it's a special route, or getRouteLogout()
		element: <LogoutRoute />,
		authOnly: true
	},
	[AppRoutes.USER_PROFILE]: {
		path: '/app/user-profile',
		element: <div>User Profile Coming Soon</div>,
		authOnly: true
	}
}

export const authRoutes: Record<AuthRoutes, AppRoutesProps> = {
	[AuthRoutes.LOGIN]: {
		path: getPathLogin(),
		element: <></>
	},
	[AuthRoutes.REGISTER]: {
		path: getPathRegister(),
		element: <></>
	}
}
