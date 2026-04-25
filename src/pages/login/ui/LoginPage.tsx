import { LoginForm } from '@/features/auth-by-credentials'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5 shadow-none">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            <p>Use test credentials:</p>
            <div className="mt-1 flex items-center justify-center gap-2 font-medium text-foreground">
              <code className="rounded bg-muted px-1.5 py-0.5">emilys</code>
              <span>/</span>
              <code className="rounded bg-muted px-1.5 py-0.5">emilyspass</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
