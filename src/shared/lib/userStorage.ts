import { StorageKeys } from '@/shared/config'
import { type AuthResponse } from '@/entities/user'

export const userStorage = {
  get: (): AuthResponse | null => {
    const user = localStorage.getItem(StorageKeys.CURRENT_USER)
    if (!user) return null
    try {
      return JSON.parse(user)
    } catch {
      return null
    }
  },
  set: (user: AuthResponse) => {
    localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user))
  },
  clear: () => {
    localStorage.removeItem(StorageKeys.CURRENT_USER)
  },
}
