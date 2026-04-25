import type { User } from '@/types/user.types'

export type AuthTokens = {
	accessToken: string
	refreshToken: string
}

export type AuthResponse = Pick<User, 'id' | 'firstName' | 'lastName' | 'gender' | 'email' | 'username' | 'image'> &
	AuthTokens

export type AuthState = {
	user: User | null
	tokens: AuthTokens | null
	isAuthenticated: boolean
}
