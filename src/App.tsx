import { BrowserRouter } from 'react-router'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { AppRouter } from '@/app/providers/router'
import { Toaster } from '@/shared/ui/sonner'
import { TooltipProvider } from '@/shared/ui/tooltip'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <NuqsAdapter>
              <AppRouter />
            </NuqsAdapter>
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
