import {
	AlertRegular,
	ArrowExitRegular,
	ChevronDownRegular,
	PersonRegular,
	QuestionCircleRegular,
	SearchRegular,
	SettingsRegular,
	ShareRegular,
	WindowMultipleRegular,
	GlobeRegular
} from '@fluentui/react-icons'
import { cn } from '@repo/ui-kit/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui-kit/shadcn/avatar'
import { Button } from '@repo/ui-kit/shadcn/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@repo/ui-kit/shadcn/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@repo/ui-kit/shadcn/input-group'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@repo/ui-kit/shadcn/select'
import { SidebarTrigger } from '@repo/ui-kit/shadcn/sidebar'
import { SvgIcon } from '@repo/ui-kit/shared/ui/svg-icon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate } from 'react-router'
import NaitonLogo from '@/shared/assets/img/naiton-logo.svg?react'
import {
	getRouteAccountingOverview,
	getRouteCrmCompany,
	getRouteDashboardOverview,
	getRouteFmsMap,
	getRouteHrmHeadcount,
	getRouteLogout,
	getRouteProcurementRequests,
	getRouteProductionLines,
	getRouteSalesOrders,
	getRouteWmsInventory
} from '@/shared/const/router.const'
import { useBoundStore } from '@/shared/store'
import type { AllowedProducts } from '@/shared/types/requests.types'

type NavbarModule = {
	key: AllowedProducts
	label: string
	to: string
}

const modules: NavbarModule[] = [
	{ key: 'sales', label: 'Sales', to: getRouteSalesOrders() },
	{ key: 'wms', label: 'WMS', to: getRouteWmsInventory() },
	{ key: 'crm', label: 'CRM', to: getRouteCrmCompany() },
	{ key: 'procurement', label: 'Procurement', to: getRouteProcurementRequests() },
	{ key: 'production', label: 'Production', to: getRouteProductionLines() },
	{ key: 'accounting', label: 'Accounting', to: getRouteAccountingOverview() },
	{ key: 'hrm', label: 'HRM', to: getRouteHrmHeadcount() },
	{ key: 'fms', label: 'FMS', to: getRouteFmsMap() }
]

const actionIcons = [WindowMultipleRegular, ShareRegular, QuestionCircleRegular, AlertRegular, SettingsRegular]

export const AppNavbar = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { i18n, t } = useTranslation()
	const { allowedProducts, profile, lng, setLng } = useBoundStore()

	const visibleModules = useMemo(() => {
		if (!allowedProducts.length) {
			return modules
		}

		return modules.filter((moduleItem) => allowedProducts.includes(moduleItem.key))
	}, [allowedProducts])

	return (
		<header className='bg-success-600 fixed inset-x-0 top-0 z-40 text-white'>
			<div className='flex items-center gap-4 px-3 py-2 sm:px-4'>
				<div className='flex min-w-0 items-center gap-3'>
					<SidebarTrigger className='text-white hover:bg-white/10 md:hidden' />

					<NavLink className='hidden sm:flex' to={getRouteDashboardOverview()}>
						<SvgIcon icon={<NaitonLogo />} width={109} height={40} className='text-white' />
					</NavLink>
				</div>

				<InputGroup className='bg-success-500 flex-1 border-transparent text-white lg:flex lg:max-w-50'>
					<InputGroupAddon align='inline-start'>
						<SearchRegular fontSize={16} />
					</InputGroupAddon>
					<InputGroupInput placeholder={`${t('search')}...`} className='placeholder:text-white/90' />
				</InputGroup>

				<nav className='hidden min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto xl:flex'>
					{visibleModules.map((moduleItem) => (
						<NavLink
							key={moduleItem.key}
							className={({ isActive }) =>
								cn(
									'rounded-sm px-1.5 py-2 text-white transition-colors hover:bg-white/10 hover:text-white/80',
									(isActive || location.pathname.startsWith(moduleItem.to)) && 'bg-white/10'
								)
							}
							to={moduleItem.to}
						>
							{moduleItem.label}
						</NavLink>
					))}
				</nav>

				<div className='ml-auto flex items-center gap-2 text-white'>
					{actionIcons.map((Icon, index) => (
						<Button
							key={Icon.displayName ?? index}
							variant='ghost'
							size='icon'
							className='relative rounded-sm p-1 text-white transition hover:border-white/10 hover:bg-white/10'
						>
							<Icon className='size-6' />
							{index === 3 ? (
								<span className='absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] leading-[13px] text-white'>
									3
								</span>
							) : null}
						</Button>
					))}
					<Select
						value={lng}
						onValueChange={async (value) => {
							setLng(value as 'en' | 'ru')
							await i18n.changeLanguage(value)
						}}
					>
						<SelectTrigger className='border-success-500 rounded-full bg-transparent p-1 text-white uppercase'>
							<GlobeRegular fontSize={24} />
							<SelectValue />
						</SelectTrigger>
						<SelectContent align='end'>
							{['en', 'ru'].map((language, index) => (
								<SelectItem key={`${language}_${index}`} value={language}>
									{language.toUpperCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<DropdownMenu>
						<DropdownMenuTrigger
							className='border-success-500 inline-flex cursor-pointer items-center gap-1 rounded-full border p-1 pr-2 text-xs outline-none disabled:cursor-default'
							disabled={!profile}
						>
							<Avatar className='size-7 border border-white/20'>
								{profile ? (
									<AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
								) : (
									<AvatarFallback className='bg-success-500'>
										<PersonRegular fontSize={20} />
									</AvatarFallback>
								)}
							</Avatar>
							<span>{profile ? profile.fullName : 'Guest'}</span>
							<ChevronDownRegular fontSize={16} />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{profile && profile.role && <DropdownMenuLabel>{profile.role}</DropdownMenuLabel>}
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<PersonRegular fontSize={16} />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SettingsRegular fontSize={16} />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuItem className='text-red-500' onClick={() => navigate(getRouteLogout())}>
									<ArrowExitRegular fontSize={16} />
									<span>{t('logout')}</span>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
