import { useMemo, Suspense } from 'react'
import { fetchMe } from '@/shared/api/users'
import { UserProfile, UserProfileSkeleton } from '@/entities/user'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'

export function ProfilePage() {
  const promise = useMemo(() => fetchMe(), [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
