import { BrowserRouter } from 'react-router'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { AppRouter } from '@/app/providers/router'
import { Toaster } from '@/shared/ui/sonner'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system">
          <NuqsAdapter>
            <AppRouter />
          </NuqsAdapter>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
