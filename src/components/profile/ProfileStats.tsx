import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, MessageSquare, Eye, Calendar, TrendingUp, Star } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  isVerified: boolean
  _count: {
    products: number
    tradeSuggestions: number
  }
  products: Array<{
    id: string
    views: number
  }>
  tradeSuggestions: Array<{
    id: string
    views: number
  }>
}

interface ProfileStatsProps {
  user: User
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const totalViews = user.products.reduce((sum, product) => sum + product.views, 0) +
                    user.tradeSuggestions.reduce((sum, suggestion) => sum + suggestion.views, 0)

  const membershipDays = Math.floor(
    (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  const averageViews = user._count.products > 0 || user._count.tradeSuggestions > 0 
    ? Math.round(totalViews / (user._count.products + user._count.tradeSuggestions))
    : 0

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'EXPORTER':
        return 'Sells products internationally'
      case 'IMPORTER':
        return 'Buys products from international markets'
      case 'AGENT':
        return 'Facilitates trade between parties'
      case 'BUYER':
        return 'Purchases products for business use'
      default:
        return 'General user'
    }
  }

  const stats = [
    {
      title: 'Products Listed',
      value: user._count.products,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Trade Suggestions',
      value: user._count.tradeSuggestions,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Days Active',
      value: membershipDays,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Role Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Role:</span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <p className="text-xs text-gray-600">
            {getRoleDescription(user.role)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={user.isVerified ? "default" : "secondary"}>
              {user.isVerified ? '✓ Verified' : 'Unverified'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <span className="font-bold text-lg">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Avg. Views per Listing</span>
            </div>
            <span className="font-bold text-lg">{averageViews}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-pink-100">
                <Star className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-sm font-medium">Profile Completeness</span>
            </div>
            <span className="font-bold text-lg">
              {Math.round(
                ((user.name ? 1 : 0) +
                 (user.email ? 1 : 0) +
                 (user.role !== 'USER' ? 1 : 0) +
                 (user.isVerified ? 1 : 0)) / 4 * 100
              )}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a 
            href="/products/create" 
            className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add New Product
          </a>
          <a 
            href="/trade-suggestions/create" 
            className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Create Trade Suggestion
          </a>
          <a 
            href="/dashboard" 
            className="block w-full text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            View Dashboard
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
