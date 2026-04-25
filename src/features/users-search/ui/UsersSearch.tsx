import { useTransition, useState, useEffect } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/shared/ui/input'

export function UsersSearch() {
  const [q, setQ] = useQueryState('q', parseAsString.withDefault('').withOptions({ shallow: false }))
  const [isPending, startTransition] = useTransition()
  const [localValue, setLocalValue] = useState(q)

  // Sync local value with URL state if URL changes from outside (e.g. back button)
  useEffect(() => {
    setLocalValue(q)
  }, [q])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalValue(value)
    
    startTransition(() => {
      setQ(value || null)
    })
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        placeholder="Search users..."
        value={localValue}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {isPending && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <Loader2 className="text-muted-foreground size-4 animate-spin" />
        </div>
      )}
    </div>
  )
}
