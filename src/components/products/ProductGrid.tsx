'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, DollarSign, Eye, Star, Verified } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  shortDesc?: string
  price?: number
  currency: string
  minOrder?: string
  unit?: string
  images: string[]
  condition: string
  availability: string
  country: string
  state?: string
  city?: string
  views: number
  createdAt: string
  user: {
    id: string
    name?: string
    company?: string
    country?: string
    city?: string
    isVerified: boolean
  }
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductGridProps {
  filters: {
    search: string
    category: string
    country: string
    minPrice: string
    maxPrice: string
    condition: string
    availability: string
    sortBy: string
  }
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.country && { country: filters.country }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.availability && { availability: filters.availability }),
        sortBy: filters.sortBy,
        page: page.toString(),
        limit: '12'
      })

      const response = await fetch(`/api/products?${searchParams}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setPagination(data.data.pagination)
      } else {
        setError(data.error || 'Failed to fetch products')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number, currency = 'USD') => {
    if (!price) return 'Price on request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  const getLocationString = (product: Product) => {
    const parts = [product.city, product.state, product.country].filter(Boolean)
    return parts.join(', ')
  }

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'NEW': return 'bg-green-100 text-green-800'
      case 'USED': return 'bg-yellow-100 text-yellow-800'
      case 'REFURBISHED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityBadgeColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'LIMITED': return 'bg-orange-100 text-orange-800'
      case 'ON_DEMAND': return 'bg-blue-100 text-blue-800'
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <div className="text-sm text-gray-500">
          <p>Suggestions:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your spelling</li>
            <li>• Use more general keywords</li>
            <li>• Remove some filters</li>
            <li>• Browse by category instead</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {pagination.totalCount} products
        </p>
        {pagination.totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchProducts(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchProducts(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group"
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.images[0] || '/api/placeholder/300/200'}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              
              {/* Condition & Availability Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConditionBadgeColor(product.condition)}`}>
                  {product.condition}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAvailabilityBadgeColor(product.availability)}`}>
                  {product.availability.replace('_', ' ')}
                </span>
              </div>

              {/* Views Counter */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {product.views}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Title & Category */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/products/${product.id}`}>
                      {product.title}
                    </Link>
                  </h3>
                </div>
                <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {product.category.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.shortDesc || product.description}
              </p>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPrice(product.price, product.currency)}
                  {product.unit && <span className="text-sm font-normal text-gray-500 ml-1">per {product.unit}</span>}
                </div>
                {product.minOrder && (
                  <p className="text-xs text-gray-500">Min. order: {product.minOrder}</p>
                )}
              </div>

              {/* Location & Date */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{getLocationString(product)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formatDate(product.createdAt)}
                </div>
              </div>

              {/* Supplier Info */}
              <div className="border-t pt-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-600">
                        {(product.user.company || product.user.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.user.company || product.user.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.user.city && product.user.country 
                          ? `${product.user.city}, ${product.user.country}`
                          : product.user.country || 'Location not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {product.user.isVerified && (
                    <div className="flex items-center text-blue-600">
                      <Verified className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/products/${product.id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchProducts(1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              First
            </button>
            <button
              onClick={() => fetchProducts(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i
              if (pageNum > pagination.totalPages) return null
              
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchProducts(pageNum)}
                  className={`px-3 py-2 text-sm border rounded ${
                    pageNum === pagination.page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => fetchProducts(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
            <button
              onClick={() => fetchProducts(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
