import { useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

import { type User, UserAvatar } from '@/entities/user'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Button } from '@/shared/ui/button'
import { useSortQuery } from '@/features/users-sort'
import { getRouteUserDetail } from '@/shared/config'

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate()
  const { sortBy, order, toggleSort } = useSortQuery()

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'image',
        header: 'Avatar',
        cell: ({ row }) => (
          <UserAvatar
            image={row.original.image}
            firstName={row.original.firstName}
            lastName={row.original.lastName}
          />
        ),
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'firstName',
        header: ({ column }) => (
          <SortButton label="Name" sortKey="firstName" />
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <SortButton label="Email" sortKey="email" />
        ),
        cell: ({ row }) => <span className="hidden md:inline">{row.original.email}</span>,
      },
      {
        accessorKey: 'phone',
        header: ({ column }) => (
          <SortButton label="Phone" sortKey="phone" />
        ),
        cell: ({ row }) => <span className="hidden lg:inline">{row.original.phone}</span>,
      },
      {
        accessorKey: 'age',
        header: ({ column }) => (
          <SortButton label="Age" sortKey="age" />
        ),
      },
      {
        accessorFn: (row) => row.company.name,
        id: 'company.name',
        header: ({ column }) => (
          <SortButton label="Company" sortKey="company.name" />
        ),
        cell: ({ row }) => <span className="hidden xl:inline">{row.original.company.name}</span>,
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <SortButton label="Role" sortKey="role" />
        ),
      },
    ],
    [sortBy, order]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  function SortButton({ label, sortKey }: { label: string; sortKey: string }) {
    const isSorted = sortBy === sortKey
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={(e) => {
          e.stopPropagation()
          toggleSort(sortKey)
        }}
      >
        <span>{label}</span>
        {isSorted ? (
          order === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : (
            <ArrowDown className="ml-2 size-4" />
          )
        ) : (
          <ArrowUpDown className="ml-2 size-4 opacity-50" />
        )}
      </Button>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-center">
        <h3 className="mt-2 text-sm font-semibold">No users found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your search query.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isHiddenOnMobile = 
                  header.id === 'email' || 
                  header.id === 'phone' || 
                  header.id === 'company.name'
                
                return (
                  <TableHead 
                    key={header.id}
                    className={
                      header.id === 'email' ? 'hidden md:table-cell' :
                      header.id === 'phone' ? 'hidden lg:table-cell' :
                      header.id === 'company.name' ? 'hidden xl:table-cell' : ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate(getRouteUserDetail(row.original.id))}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell 
                  key={cell.id}
                  className={
                    cell.column.id === 'email' ? 'hidden md:table-cell' :
                    cell.column.id === 'phone' ? 'hidden lg:table-cell' :
                    cell.column.id === 'company.name' ? 'hidden xl:table-cell' : ''
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
