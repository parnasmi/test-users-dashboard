export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  image: string
  phone: string
  age: number
  role: string
  company: {
    name: string
    title: string
    department: string
  }
}

export type AuthResponse = User & {
  accessToken: string
  refreshToken: string
}

export type UsersResponse = {
  users: User[]
  total: number
  skip: number
  limit: number
}
