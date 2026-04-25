import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import type { ApiError } from '@/types/common.types'
import { AUTH_TOKENS, REDIRECT_URLS, removeTokens, saveTokens } from './auth/auth.helper'
import type { AuthTokens } from './auth/auth.types'

export const dummy = axios.create({
	baseURL: '/dummy',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

// Флаг для предотвращения множественных refresh запросов
let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error)
		else prom.resolve()
	})
	failedQueue = []
}

dummy.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem(AUTH_TOKENS.access)

		if (config.headers && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	},
	(error: AxiosError) => Promise.reject(error)
)

dummy.interceptors.response.use(
	(response) => response,

	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean
		}

		// Если 401 и это не повторный запрос
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// Если уже идет refresh, добавляем запрос в очередь
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(() => {
						return dummy(originalRequest)
					})
					.catch((err) => {
						return Promise.reject(err)
					})
			}

			originalRequest._retry = true
			isRefreshing = true

			const refreshToken = localStorage.getItem(AUTH_TOKENS.refresh)

			if (!refreshToken) {
				// Нет refresh token - разлогиниваем
				localStorage.removeItem(AUTH_TOKENS.access)
				localStorage.removeItem(AUTH_TOKENS.refresh)

				toast.error('Session expired. Please login again.')

				window.location.href = REDIRECT_URLS.auth

				return Promise.reject(error)
			}

			try {
				// Обновляем токены
				const { data } = await dummy.post<AuthTokens>('/auth/refresh', {
					refreshToken
				})

				// Сохраняем новые токены в памяти
				saveTokens(data)

				// Обновляем заголовок оригинального запроса
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
				}

				// Обрабатываем очередь
				processQueue(null)
				isRefreshing = false

				// Повторяем оригинальный запрос
				return dummy(originalRequest)
			} catch (err) {
				// Refresh не удался - разлогиниваем
				processQueue(err as Error)
				isRefreshing = false

				removeTokens()
				window.location.href = REDIRECT_URLS.auth

				return Promise.reject(err)
			}
		}

		return Promise.reject(error)
	}
)

export const api = {
	get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return dummy.get<T>(url, config).then((r) => r.data)
	},

	post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return dummy.post<T>(url, body, config).then((r) => r.data)
	},

	put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return dummy.put<T>(url, body, config).then((r) => r.data)
	},

	patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return dummy.patch<T>(url, body, config).then((r) => r.data)
	},

	delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return dummy.delete<T>(url, config).then((r) => r.data)
	}
}
