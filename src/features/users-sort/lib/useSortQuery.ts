import { useQueryStates, parseAsStringLiteral } from 'nuqs'

const sortOrderValues = ['asc', 'desc'] as const

export function useSortQuery() {
  const [{ sortBy, order }, setSort] = useQueryStates({
    sortBy: parseAsStringLiteral(['firstName', 'email', 'phone', 'age', 'role', 'company.name']).withDefault('firstName'),
    order: parseAsStringLiteral(sortOrderValues).withDefault('asc'),
  }, { shallow: false })

  const toggleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSort({ order: order === 'asc' ? 'desc' : 'asc' })
    } else {
      setSort({ sortBy: newSortBy as any, order: 'asc' })
    }
  }

  return { sortBy, order, toggleSort }
}
