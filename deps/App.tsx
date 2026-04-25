import { BrowserRouter } from 'react-router'
import { PublicProvider } from '@/app/providers/public-provider/PublicProvider'
import AppRouter from '@/app/providers/router/components/AppRouter/AppRouter'
import '@/shared/config/i18n/i18n'
import '@/app/styles/index.css'

export default function App() {
	return (
		<BrowserRouter>
			<PublicProvider>
				<AppRouter />
			</PublicProvider>
		</BrowserRouter>
	)
}
