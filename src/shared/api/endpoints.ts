export const endpoints = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  USERS: '/users',
  USERS_SEARCH: '/users/search',
  USER_BY_ID: (id: string | number) => `/users/${id}`,
} as const
