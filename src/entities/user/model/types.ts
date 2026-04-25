export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  image: string
}

export type AuthResponse = User & {
  accessToken: string
  refreshToken: string
}
