import { use } from 'react'
import { type UsersResponse } from '@/entities/user'
import { UsersTable } from '@/widgets/users-table'
import { UsersPagination } from '@/features/users-pagination'

interface UsersTableDataProps {
  promise: Promise<UsersResponse>
}

export function UsersTableData({ promise }: UsersTableDataProps) {
  const data = use(promise)

  return (
    <div className="space-y-4">
      <UsersTable users={data.users} />
      <UsersPagination total={data.total} />
    </div>
  )
}
