import { Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { routeTree, type RouteConfig } from './routes'
import { RequireAuth } from './RequireAuth'
import { RouteSkeleton } from './RouteSkeleton'

function renderRoute(route: RouteConfig) {
  const element = (
    <Suspense fallback={<RouteSkeleton />}>
      {route.element}
    </Suspense>
  )

  const wrappedElement = route.authOnly
    ? undefined // auth routes use RequireAuth as a layout route
    : element

  // If authOnly, wrap element inside a RequireAuth layout route
  if (route.authOnly) {
    return (
      <Route key={route.path} element={<RequireAuth />}>
        <Route path={route.path} element={element}>
          {route.children?.map(renderRoute)}
        </Route>
      </Route>
    )
  }

  return (
    <Route key={route.path} path={route.path} element={wrappedElement}>
      {route.children?.map(renderRoute)}
    </Route>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      {routeTree.map(renderRoute)}
    </Routes>
  )
}
