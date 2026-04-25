import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { AUTH_TOKENS, REDIRECT_URLS, removeTokens, saveTokens } from '@/api/auth/auth.helper'
import type { AuthTokens } from '@/api/auth/auth.types'
import type { ApiError } from '@/types/common.types'
import type { ArgumentItem, Fields } from '@/types/dawa.types'

export const instance = axios.create({
	baseURL: '/api',
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

instance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem(AUTH_TOKENS.access)

		if (config.headers && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		if (config.headers) {
			config.headers['ClientId'] = 'naiton6react'
			config.headers['ClientSecret'] = 'oDiUIWKg1G8RONMtSOiJsyNrtaoig4AmnL35K1MNYzhd7PZrIcnrpgZdPOt2VsD3'
		}

		return config
	},
	(error: AxiosError) => Promise.reject(error)
)

instance.interceptors.response.use(
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
						return instance(originalRequest)
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
				const { data } = await instance.post<AuthTokens>('/auth/refresh', {
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
				return instance(originalRequest)
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
		return instance.get<T>(url, config).then((r) => r.data)
	},

	post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return instance.post<T>(url, body, config).then((r) => r.data)
	},

	put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return instance.put<T>(url, body, config).then((r) => r.data)
	},

	patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
		return instance.patch<T>(url, body, config).then((r) => r.data)
	},

	delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return instance.delete<T>(url, config).then((r) => r.data)
	},

	dawa<T>(name: string, args?: ArgumentItem[], fields?: Fields, config?: AxiosRequestConfig): Promise<T> {
		return instance.post('/datad/execute', [{ name, arguments: args, fields }], config).then((r) => r.data)
	}
}
