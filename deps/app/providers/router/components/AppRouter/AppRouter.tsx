import { Loading } from '@repo/ui-kit/shared/ui/loading'
import { Suspense, useCallback } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { InnerLayout } from '@/app/layouts/InnerLayout'
import { OuterLayout } from '@/app/layouts/OuterLayout'
import { AuthProvider } from '@/app/providers/auth-provider/AuthProvider'
import { AuthLoginPage, RegisterPage } from '@/pages/auth'
import { ForbiddenPage } from '@/pages/forbidden'
import { NotFoundPage } from '@/pages/notfound'
import {
	getAppsRoute,
	getRouteAuth,
	getRouteAuthLogin,
	getRouteDashboardOverview,
	getRouteForbidden,
	// getRouteLogout,
	getPathLogin,
	getPathRegister
} from '@/shared/const/router.const'
import { routes as routePaths, type AppRoutesProps } from '../../config/routes'
import { RequireAuth } from '../RequireAuth'
import { ScrollContainer } from '../ScrollContainer/ScrollContainer'

export default function AppRouter() {
	const renderWithWrapper = useCallback((route: AppRoutesProps) => {
		const element = (
			<Suspense fallback={<Loading loading={true} />}>
				<ScrollContainer>{route.element}</ScrollContainer>
			</Suspense>
		)

		return (
			<Route
				key={route.path}
				element={route.authOnly ? <RequireAuth availableIn={route.availableIn}>{element}</RequireAuth> : element}
				path={route.path}
			/>
		)
	}, [])

	return (
		<Routes>
			<Route element={<Navigate replace to={getRouteAuthLogin()} />} path='/' />

			<Route element={<AuthLayout />} path={getRouteAuth()}>
				<Route element={<Navigate replace to={getRouteAuthLogin()} />} index />
				<Route element={<AuthLoginPage />} path={getPathLogin()} />
				<Route element={<RegisterPage />} path={getPathRegister()} />
			</Route>

			<Route element={<OuterLayout />} path={getAppsRoute()}>
				<Route element={<InnerLayout />}>
					<Route element={<AuthProvider />}>
						<Route
							element={
								<ScrollContainer>
									<RequireAuth>
										<Navigate replace to={getRouteDashboardOverview()} />
									</RequireAuth>
								</ScrollContainer>
							}
							index
						/>
						{Object.values(routePaths).map(renderWithWrapper)}
					</Route>
				</Route>
			</Route>

			<Route element={<ForbiddenPage />} path={getRouteForbidden()} />
			<Route element={<NotFoundPage />} path='*' />
		</Routes>
	)
}
