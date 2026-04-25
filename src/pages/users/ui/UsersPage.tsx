import { Suspense, useMemo } from 'react'
import { useQueryStates, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'

import { fetchUsers } from '@/shared/api'
import { UsersSearch } from '@/features/users-search'
import { TableSkeleton, UsersTable } from '@/widgets/users-table'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { UsersTableData } from './UsersTableData'

export default function UsersPage() {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    q: parseAsString.withDefault(''),
    sortBy: parseAsStringLiteral(['firstName', 'email', 'phone', 'age', 'role', 'company.name']).withDefault('firstName'),
    order: parseAsStringLiteral(['asc', 'desc']).withDefault('asc'),
  }, { shallow: false })

  const promise = useMemo(() => {
    return fetchUsers({
      limit: params.pageSize,
      skip: (params.page - 1) * params.pageSize,
      q: params.q,
      sortBy: params.sortBy,
      order: params.order,
    })
  }, [params.pageSize, params.page, params.q, params.sortBy, params.order])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>
      
      <UsersSearch />

      <ErrorBoundary>
        <Suspense fallback={<TableSkeleton />}>
          <UsersTableData promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
