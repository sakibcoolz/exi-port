import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import ProfileForm from '@/components/profile/ProfileForm'
import ProfileStats from '@/components/profile/ProfileStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building, Globe, Calendar, Mail, Phone } from 'lucide-react'

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: 'My Profile - Exi-port',
  description: 'Manage your profile information and trade preferences'
}

async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        tradeSuggestions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            products: true,
            tradeSuggestions: true
          }
        }
      }
    })
    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await getUserProfile(session.user.id)
  
  if (!user) {
    redirect('/auth/signin')
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'EXPORTER': return 'default'
      case 'IMPORTER': return 'secondary'
      case 'AGENT': return 'outline'
      case 'BUYER': return 'destructive'
      default: return 'default'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || ''} alt={user.name || 'User'} />
                <AvatarFallback className="text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name || 'Anonymous User'}
                  </h1>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                  {user.isVerified && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                  )}
                  {user.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.city && `${user.city}, `}{user.country}
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {user.company}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Member since {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Stats */}
        <div className="lg:col-span-1">
          <ProfileStats user={user} />
        </div>
        
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and trade preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your latest product listings</CardDescription>
          </CardHeader>
          <CardContent>
            {user.products.length > 0 ? (
              <div className="space-y-4">
                {user.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{product.title}</h4>
                      <p className="text-xs text-gray-600">
                        {product.price && `$${product.price} ${product.currency}`}
                        {product.minOrder && ` • Min: ${product.minOrder}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.views} views
                    </Badge>
                  </div>
                ))}
                {user._count.products > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    And {user._count.products - 5} more products...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No products yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Trade Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trade Suggestions</CardTitle>
            <CardDescription>Your latest trade opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {user.tradeSuggestions.length > 0 ? (
              <div className="space-y-4">
                {user.tradeSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        {suggestion.category}
                        {suggestion.budget && 
                          ` • $${suggestion.budget}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(suggestion.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.views} views
                    </Badge>
                  </div>
                ))}
                {user._count.tradeSuggestions > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    And {user._count.tradeSuggestions - 5} more suggestions...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No trade suggestions yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
