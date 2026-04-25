import { Toaster } from '@repo/ui-kit/shadcn/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { apiSubscribe } from '@/shared/api/api'
import { getAppsRoute, getRouteAuth } from '@/shared/const/router.const'
import { useBoundStore } from '@/shared/store'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 60_000
		}
	}
})

useBoundStore.subscribe((state) => {
	apiSubscribe(state)
})

export function PublicProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate()
	const location = useLocation()
	const isAuthenticated = useBoundStore((state) => state.isAuthenticated)

	useLayoutEffect(() => {
		const isAuthRoute = location.pathname === getRouteAuth() || location.pathname.startsWith(`${getRouteAuth()}/`)

		if (isAuthenticated && isAuthRoute) {
			navigate(`${getAppsRoute()}/dashboard`, { replace: true })
		}
	}, [isAuthenticated, location.pathname, navigate])

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			{children}
			<Toaster position='top-center' duration={3000} />
		</QueryClientProvider>
	)
}
