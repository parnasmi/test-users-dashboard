import { Link } from 'react-router'
import { LogOut, User } from 'lucide-react'
import { ThemeToggle } from '@/features/theme-toggle'
import { useLogout } from '@/features/logout'
import { userStorage } from '@/shared/lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { SidebarTrigger } from '@/shared/ui/sidebar'
import { getRouteProfile } from '@/shared/config'

export function Topbar() {
  const { logout } = useLogout()
  const user = userStorage.get()

  const initials = user 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U'

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-(--topbar-height) w-full items-center justify-between border-b px-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex size-8 items-center justify-center rounded-full outline-none ring-offset-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="size-8">
                <AvatarImage src={user?.image} alt={user?.username} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  @{user?.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={getRouteProfile()} className="flex w-full items-center">
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
