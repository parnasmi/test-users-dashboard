import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar'
import { Topbar } from '@/widgets/topbar'

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="flex-1 p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
