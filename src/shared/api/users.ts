import { api, endpoints } from '@/shared/api'
import { type UsersResponse, type User } from '@/entities/user'
import { createPromiseCache, stableKey } from '@/shared/lib'

const usersCache = createPromiseCache<UsersResponse>()
const userByIdCache = createPromiseCache<User>()

export interface GetUsersParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  q?: string
}

export function fetchUsers(params: GetUsersParams): Promise<UsersResponse> {
  const key = stableKey(params)
  
  return usersCache.get(key, async () => {
    const { q, ...rest } = params
    
    // If there is a search query, use search endpoint
    const url = q ? endpoints.USERS_SEARCH : endpoints.USERS
    
    return api.get<UsersResponse>(url, {
      params: {
        ...rest,
        ...(q ? { q } : {}),
      }
    })
  })
}

export function fetchUserById(id: string | number): Promise<User> {
  const key = `user-${id}`
  
  return userByIdCache.get(key, () => {
    return api.get<User>(endpoints.USER_BY_ID(id))
  })
}
