import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib'

interface UserAvatarProps {
  image?: string
  firstName: string
  lastName: string
  className?: string
}

export function UserAvatar({ image, firstName, lastName, className }: UserAvatarProps) {
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()

  return (
    <Avatar className={cn('size-8', className)}>
      <AvatarImage src={image} alt={`${firstName} ${lastName}`} />
      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
    </Avatar>
  )
}
