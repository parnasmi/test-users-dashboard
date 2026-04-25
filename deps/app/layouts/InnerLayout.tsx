import { SidebarInset } from '@repo/ui-kit/shadcn/sidebar'
import { Outlet } from 'react-router'
import { AppSidebar } from './app-sidebar'

export function InnerLayout() {
	return (
		<>
			<AppSidebar />
			<SidebarInset className='min-h-[calc(100vh-var(--app-navbar-height))] bg-transparent pt-(--app-navbar-height) md:pl-(--app-sidebar-width)'>
				<Outlet />
			</SidebarInset>
		</>
	)
}
