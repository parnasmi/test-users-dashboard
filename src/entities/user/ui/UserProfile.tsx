import { use } from 'react'
import { type User } from '@/entities/user'
import { UserAvatar } from '@/entities/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Building2, 
  CreditCard, 
  Bitcoin,
  Calendar,
  User as UserIcon
} from 'lucide-react'

interface UserProfileProps {
  promise: Promise<User>
}

export function UserProfile({ promise }: UserProfileProps) {
  const user = use(promise)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar 
            image={user.image} 
            firstName={user.firstName} 
            lastName={user.lastName} 
            className="h-20 w-20 text-2xl"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit text-sm capitalize">
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
            <InfoItem icon={<Calendar className="h-4 w-4" />} label="Birth Date" value={user.birthDate} />
            <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Role" value={user.role} className="capitalize" />
            <InfoItem label="Age" value={user.age.toString()} />
            <InfoItem label="Gender" value={user.gender} className="capitalize" />
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">{user.address.address}</p>
            <p className="text-muted-foreground">
              {user.address.city}, {user.address.state} {user.address.postalCode}
            </p>
            <p className="text-muted-foreground">{user.address.country}</p>
          </CardContent>
        </Card>

        {/* Company */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Company
            </CardTitle>
            <CardDescription>{user.company.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Department" value={user.company.department} />
              <InfoItem label="Title" value={user.company.title} />
            </div>
            <div className="space-y-1 pt-2 border-t">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Office Location</p>
              <p className="text-sm">{user.company.address.address}</p>
              <p className="text-sm text-muted-foreground">
                {user.company.address.city}, {user.company.address.state}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial & Crypto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Bank Account ({user.bank.cardType})
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="font-mono text-sm">{user.bank.cardNumber}</p>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Expires: {user.bank.cardExpire}</span>
                  <span>Currency: {user.bank.currency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bitcoin className="h-4 w-4 text-muted-foreground" />
                Crypto Wallet ({user.crypto.coin})
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="font-mono text-sm break-all">{user.crypto.wallet}</p>
                <p className="mt-1 text-xs text-muted-foreground">Network: {user.crypto.network}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoItem({ 
  icon, 
  label, 
  value, 
  className 
}: { 
  icon?: React.ReactNode, 
  label: string, 
  value: string,
  className?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-medium ${className}`}>{value}</p>
    </div>
  )
}
