export const endpoints = {
	LOGIN: '/v1/auth/login',
	LOGOUT: '/v1/auth/logout',
	PROFILE: '/v1/profile',
	SALES_ORDERS: '/v1/sales/orders',
	SALES_ORDER_DETAILS: '/v1/sales/orders/:id',
	CRM_LEADS: '/v1/crm/leads',
	CRM_LEAD_DETAILS: '/v1/crm/leads/:id'
} as const
