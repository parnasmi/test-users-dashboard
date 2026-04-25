import { StorageKeys } from '@/shared/config/storage-keys'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type TokenStorage = {
  get: () => AuthTokens | null
  set: (tokens: AuthTokens) => void
  clear: () => void
  getAccessToken: () => string | null
}

const createLocalStorageTokenStorage = (): TokenStorage => ({
  get: () => {
    const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(StorageKeys.REFRESH_TOKEN)
    if (!accessToken || !refreshToken) return null
    return { accessToken, refreshToken }
  },
  set: ({ accessToken, refreshToken }) => {
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, accessToken)
    localStorage.setItem(StorageKeys.REFRESH_TOKEN, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN)
    localStorage.removeItem(StorageKeys.REFRESH_TOKEN)
  },
  getAccessToken: () => localStorage.getItem(StorageKeys.ACCESS_TOKEN),
})

export const tokenStorage: TokenStorage = createLocalStorageTokenStorage()
