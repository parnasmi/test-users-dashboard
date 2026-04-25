import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { env } from '@/shared/config/env'
import { getRouteLogin } from '@/shared/config/routes'
import { tokenStorage } from '@/shared/lib/tokenStorage'

export const instance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken()
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      if (typeof window !== 'undefined' && window.location.pathname !== getRouteLogin()) {
        window.location.assign(getRouteLogin())
      }
    }
    return Promise.reject(error)
  },
)

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then((r) => r.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T>(url, body, config).then((r) => r.data),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.patch<T>(url, body, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config).then((r) => r.data),
}
