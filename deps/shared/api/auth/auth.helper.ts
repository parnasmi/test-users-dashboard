import type { AuthTokens } from './auth.types'

export const REDIRECT_URLS = {
	home: '/',
	auth: '/auth'
} as const

export const AUTH_KEYS = {
	currentUser: ['auth', 'currentUser'],
	isAuthenticated: ['auth', 'isAuthenticated']
} as const

export const AUTH_TOKENS = {
	access: 'access_token',
	refresh: 'refresh_token'
} as const

export const saveTokens = (data: AuthTokens) => {
	localStorage.setItem(AUTH_TOKENS.access, data.accessToken)
	localStorage.setItem(AUTH_TOKENS.refresh, data.refreshToken)
}

export const removeTokens = () => {
	localStorage.removeItem(AUTH_TOKENS.access)
	localStorage.removeItem(AUTH_TOKENS.refresh)
}
