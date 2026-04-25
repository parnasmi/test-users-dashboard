import { SidebarProvider } from '@repo/ui-kit/shadcn/sidebar'
import { Outlet } from 'react-router'
import { useBoundStore } from '@/shared/store'
import { AppNavbar } from './app-navbar'

export const OuterLayout = () => {
	const { isSidebarCollapsed, setIsSidebarCollapsed } = useBoundStore()

	return (
		<SidebarProvider
			defaultOpen={!isSidebarCollapsed}
			onOpenChange={(isOpen) => setIsSidebarCollapsed(!isOpen)}
			open={!isSidebarCollapsed}
		>
			<AppNavbar />
			<Outlet />
		</SidebarProvider>
	)
}
