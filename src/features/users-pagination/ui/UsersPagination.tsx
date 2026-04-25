import { useQueryStates, parseAsInteger } from 'nuqs'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

interface UsersPaginationProps {
  total: number
}

export function UsersPagination({ total }: UsersPaginationProps) {
  const [{ page, pageSize }, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  }, { shallow: false })

  const totalPages = Math.ceil(total / pageSize)
  const canGoBack = page > 1
  const canGoForward = page < totalPages

  const goToPage = (newPage: number) => {
    setPagination({ page: newPage })
  }

  const changePageSize = (newSize: string) => {
    setPagination({ pageSize: parseInt(newSize), page: 1 })
  }

  if (total === 0) return null

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-row">
      <div className="text-muted-foreground flex-1 text-sm">
        Total {total} users
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={changePageSize}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent align="end">
              {[10, 25, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => goToPage(1)}
            disabled={!canGoBack}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => goToPage(page - 1)}
            disabled={!canGoBack}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => goToPage(page + 1)}
            disabled={!canGoForward}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => goToPage(totalPages)}
            disabled={!canGoForward}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
