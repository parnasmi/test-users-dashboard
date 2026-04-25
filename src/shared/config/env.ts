const DEFAULT_API_BASE_URL = 'https://dummyjson.com'

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
} as const
