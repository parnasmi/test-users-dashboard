import { type JSX, useMemo } from 'react'
import { Navigate, useLocation } from 'react-router'
import { getRouteAuthLogin, getRouteForbidden } from '@/shared/const/router.const'
import { useBoundStore } from '@/shared/store'
import type { AllowedProducts } from '@/shared/types/requests.types'

type RequireAuthProps = {
	children: JSX.Element
	availableIn?: AllowedProducts[]
}

export function RequireAuth({ children, availableIn }: RequireAuthProps) {
	const { isAuthenticated, allowedProducts, profile } = useBoundStore()
	const location = useLocation()

	const hasRequiredProducts = useMemo(() => {
		if (!availableIn?.length) {
			return true
		}

		// If authenticated but profile isn't loaded yet, we can't determine permissions
		if (isAuthenticated && profile === null) {
			return null
		}

		if (!allowedProducts.length) {
			return false
		}

		return allowedProducts.some((product) => availableIn.includes(product))
	}, [allowedProducts, availableIn, isAuthenticated, profile])

	if (!isAuthenticated) {
		return <Navigate replace state={{ from: location }} to={getRouteAuthLogin()} />
	}

	if (hasRequiredProducts === null) {
		return null
	}

	if (!hasRequiredProducts) {
		return <Navigate replace state={{ from: location }} to={getRouteForbidden()} />
	}

	return children
}
