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
  birthDate: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
  }
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company: {
    name: string
    title: string
    department: string
    address: {
      address: string
      city: string
      state: string
      stateCode: string
      postalCode: string
      country: string
    }
  }
  crypto: {
    coin: string
    wallet: string
    network: string
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
