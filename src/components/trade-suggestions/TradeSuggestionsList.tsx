'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  TrendingUp, 
  Handshake, 
  DollarSign, 
  Calendar,
  MapPin,
  Building,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface TradeSuggestion {
  id: string
  title: string
  description: string
  type: 'BUYING' | 'SELLING' | 'PARTNERSHIP' | 'INVESTMENT'
  category: string
  country: string
  budget?: string
  quantity?: string
  timeline: string
  views: number
  status: string
  createdAt: string
  user: {
    id: string
    name?: string
    company?: string
    country?: string
    isVerified: boolean
  }
}

export default function TradeSuggestionsList() {
  const [tradeSuggestions, setTradeSuggestions] = useState<TradeSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    country: '',
    search: ''
  })

  useEffect(() => {
    fetchTradeSuggestions()
  }, [filters])

  const fetchTradeSuggestions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.type) params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.country) params.append('country', filters.country)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/trade-suggestions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setTradeSuggestions(data.tradeSuggestions || [])
      } else {
        setError(data.message || 'Failed to fetch trade suggestions')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUYING': return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case 'SELLING': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'PARTNERSHIP': return <Handshake className="h-5 w-5 text-purple-600" />
      case 'INVESTMENT': return <DollarSign className="h-5 w-5 text-yellow-600" />
      default: return <ShoppingCart className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUYING': return 'bg-blue-100 text-blue-800'
      case 'SELLING': return 'bg-green-100 text-green-800'
      case 'PARTNERSHIP': return 'bg-purple-100 text-purple-800'
      case 'INVESTMENT': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{error}</span>
      </div>
    )
  }

  if (tradeSuggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Trade Suggestions Found</h3>
        <p className="text-gray-500 mb-6">Be the first to post a trade requirement!</p>
        <a
          href="/trade-suggestions/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Post Your Requirement
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tradeSuggestions.map((suggestion) => (
        <div key={suggestion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-50">
                {getTypeIcon(suggestion.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{suggestion.category}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    {suggestion.user.company || suggestion.user.name || 'Anonymous'}
                    {suggestion.user.isVerified && (
                      <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
                    )}
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {suggestion.country}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {suggestion.views}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(suggestion.createdAt)}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {suggestion.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {truncateText(suggestion.description, 200)}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {suggestion.budget && (
              <div>
                <div className="text-sm font-medium text-gray-700">Budget</div>
                <div className="text-sm text-gray-600">{suggestion.budget}</div>
              </div>
            )}
            {suggestion.quantity && (
              <div>
                <div className="text-sm font-medium text-gray-700">Quantity</div>
                <div className="text-sm text-gray-600">{suggestion.quantity}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-700">Timeline</div>
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {suggestion.timeline}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Interested?</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Details
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {tradeSuggestions.length >= 10 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Suggestions
          </button>
        </div>
      )}
    </div>
  )
}
