import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { tokenStorage, userStorage } from '@/shared/lib'
import { getRouteLogin } from '@/shared/config'

export function useLogout() {
  const navigate = useNavigate()

  const logout = () => {
    tokenStorage.clear()
    userStorage.clear()
    toast.success('Signed out successfully')
    navigate(getRouteLogin())
  }

  return { logout }
}
