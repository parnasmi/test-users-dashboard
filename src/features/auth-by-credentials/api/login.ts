import { api, endpoints } from '@/shared/api'
import type { AuthResponse } from '@/entities/user'
import type { LoginInput } from '../model/schema'

export async function loginRequest(data: LoginInput): Promise<AuthResponse> {
  return api.post<AuthResponse>(endpoints.AUTH_LOGIN, data)
}
