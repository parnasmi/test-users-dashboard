export const StorageKeys = {
  ACCESS_TOKEN: 'users-dashboard-access-token',
  REFRESH_TOKEN: 'users-dashboard-refresh-token',
  THEME: 'users-dashboard-theme',
  CURRENT_USER: 'users-dashboard-current-user',
} as const

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys]
