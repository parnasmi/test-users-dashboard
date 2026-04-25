import { Navigate, Outlet, useLocation } from 'react-router'
import { tokenStorage } from '@/shared/lib'
import { getRouteLogin } from '@/shared/config'

export function RequireAuth() {
  const location = useLocation()
  const token = tokenStorage.getAccessToken()

  if (!token) {
    return <Navigate to={getRouteLogin()} replace state={{ from: location }} />
  }

  return <Outlet />
}
