import { Outlet } from 'react-router'

export function AuthLayout() {
	return (
		<main className='min-h-screen bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_26%,#0f8f52_26%,#38b86a_100%)]'>
			<div className='grid min-h-screen lg:grid-cols-[minmax(320px,420px)_1fr]'>
				<section className='relative flex flex-col justify-between overflow-hidden bg-white px-8 py-10 sm:px-10 lg:px-12'>
					<div>
						<div className='inline-flex items-center gap-3'>
							<div className='border-primary/30 bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl font-bold'>
								N
							</div>
							<div>
								<p className='text-primary text-4xl font-semibold tracking-tight'>Naiton</p>
								<p className='text-primary/80 text-sm font-medium tracking-[0.24em] uppercase'>Business Suite</p>
							</div>
						</div>
					</div>

					<div className='relative z-10 mx-auto flex w-full max-w-sm items-center justify-center py-14'>
						<Outlet />
					</div>

					<div className='space-y-4 text-sm text-slate-500'>
						<div className='flex items-center gap-2'>
							<span className='rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600'>
								EN
							</span>
							<span>Technical support</span>
						</div>
						<p>© 2006 — 2026 Naiton Business Suite. All rights reserved.</p>
					</div>
				</section>

				<section className='relative hidden overflow-hidden lg:block'>
					<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_25%),linear-gradient(135deg,rgba(0,0,0,0.26),transparent_40%),linear-gradient(135deg,#0d8a52,#3db968)]' />
					<div className='absolute inset-y-[-10%] left-[8%] w-[70%] rotate-[-18deg] rounded-[56px] bg-black/18' />
					<div className='absolute inset-y-[-22%] left-[24%] w-[54%] rotate-[-18deg] rounded-[56px] bg-black/10' />
					<div className='absolute top-[-12%] -left-[10%] h-[70%] w-[55%] rounded-full border border-emerald-300/45' />
					<div className='absolute top-[-8%] -left-[8%] h-[82%] w-[63%] rounded-full border border-emerald-300/40' />
					<div className='absolute top-[-4%] -left-[6%] h-[94%] w-[71%] rounded-full border border-emerald-300/35' />
					<div className='absolute right-[-4%] -bottom-[28%] h-[92%] w-[46%] rounded-full border border-emerald-300/35' />
					<div className='absolute right-[-2%] -bottom-[22%] h-[80%] w-[40%] rounded-full border border-emerald-300/30' />
					<div className='absolute top-1/2 left-1/2 flex h-72 w-72 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[72px] border border-white/12 bg-white/8 shadow-2xl backdrop-blur-sm'>
						<div className='flex h-44 w-44 items-center justify-center rounded-full border-[18px] border-black/8 text-8xl font-black tracking-tight text-black/20'>
							N
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}
