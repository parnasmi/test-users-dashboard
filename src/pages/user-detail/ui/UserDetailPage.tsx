import { useMemo, Suspense } from 'react'
import { useParams, Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { fetchUserById } from '@/shared/api/users'
import { getRouteUsers } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { UserDetailContent } from './UserDetailContent'
import { UserDetailSkeleton } from './UserDetailSkeleton'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()

  const promise = useMemo(() => {
    if (!id) return Promise.reject(new Error('User ID is required'))
    return fetchUserById(id)
  }, [id])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2 h-8 gap-1">
          <Link to={getRouteUsers()}>
            <ChevronLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<UserDetailSkeleton />}>
          <UserDetailContent promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
