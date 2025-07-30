'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Plus, 
  TrendingUp,
  Eye, 
  MessageSquare,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats] = useState({
    totalProducts: 12,
    activeProducts: 8,
    totalViews: 1247,
    totalInquiries: 23,
    monthlyViews: 567,
    monthlyInquiries: 12,
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const recentProducts = [
    {
      id: '1',
      title: 'Premium Organic Cotton T-Shirts',
      status: 'ACTIVE',
      views: 156,
      inquiries: 8,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Industrial Grade Steel Pipes',
      status: 'PENDING',
      views: 89,
      inquiries: 3,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Fresh Basmati Rice - Premium Grade',
      status: 'ACTIVE',
      views: 234,
      inquiries: 12,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]

  const recentInquiries = [
    {
      id: '1',
      productTitle: 'Premium Organic Cotton T-Shirts',
      inquirerName: 'John Smith',
      inquirerCompany: 'Fashion Forward Ltd.',
      message: 'Interested in bulk order of 10,000 pieces...',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'NEW',
    },
    {
      id: '2',
      productTitle: 'Fresh Basmati Rice',
      inquirerName: 'Maria Garcia',
      inquirerCompany: 'Global Foods Import',
      message: 'Looking for monthly supply of 5 tons...',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'REPLIED',
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-100'
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100'
      case 'DRAFT':
        return 'text-gray-700 bg-gray-100'
      case 'NEW':
        return 'text-blue-700 bg-blue-100'
      case 'REPLIED':
        return 'text-green-700 bg-green-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your products and trade activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/products/new"
            className="bg-blue-600 rounded-lg shadow-sm p-6 text-white hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Post New Product</h3>
                <p className="text-blue-100">Add a new product to your catalog</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/products"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Package className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                <p className="text-gray-600">Edit and manage your product listings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/inquiries"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Inquiries</h3>
                <p className="text-gray-600">Respond to buyer inquiries</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                <Link 
                  href="/dashboard/products"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <div key={product.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {product.views} views
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {product.inquiries} inquiries
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
                <Link 
                  href="/dashboard/inquiries"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {inquiry.inquirerName}
                      </h3>
                      <p className="text-xs text-gray-500">{inquiry.inquirerCompany}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{inquiry.productTitle}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {inquiry.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
