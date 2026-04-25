import { Loading } from '@repo/ui-kit/shared/ui/loading'
import { type ReactNode, useEffect } from 'react'
import { Outlet } from 'react-router'
import { useFetchQueries } from '@/shared/api/api-helper-hooks/useFetchQueries'
import { endpoints } from '@/shared/const/endpoints.const'
import { useBoundStore } from '@/shared/store'
import type { UserProfile } from '@/shared/store/use-auth-store/use-auth-store'
import type { AllowedProducts, GetRequestResponse, TCompanyInfo } from '@/shared/types/requests.types'

type ProfilePayload = UserProfile & {
	allowed: AllowedProducts[]
	companyInfo: TCompanyInfo
}

type AuthProviderProps = {
	children?: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const isAuthenticated = useBoundStore((state) => state.isAuthenticated)
	const profile = useBoundStore((state) => state.profile)
	const setProfile = useBoundStore((state) => state.setProfile)
	const setAllowedProducts = useBoundStore((state) => state.setAllowedProducts)
	const setCompanyInfo = useBoundStore((state) => state.setCompanyInfo)

	const profileQuery = useFetchQueries<GetRequestResponse<ProfilePayload>>({
		url: endpoints.PROFILE,
		enabled: isAuthenticated && profile === null,
		showNotification: false,
		refetchOnWindowFocus: false
	})

	useEffect(() => {
		const payload = profileQuery.data?.data

		if (!payload) {
			return
		}

		const { allowed, companyInfo, ...userProfile } = payload
		setProfile(userProfile)
		setAllowedProducts(allowed)
		setCompanyInfo(companyInfo)
	}, [profileQuery.data, setAllowedProducts, setCompanyInfo, setProfile])

	if (isAuthenticated && profile === null && profileQuery.isPending) {
		return <Loading loading={true} />
	}

	return children ?? <Outlet />
}
