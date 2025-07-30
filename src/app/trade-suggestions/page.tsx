import { Suspense } from 'react'
import TradeSuggestionsList from '@/components/trade-suggestions/TradeSuggestionsList'
import CreateTradeSuggestionButton from '@/components/trade-suggestions/CreateTradeSuggestionButton'
import { Search, Filter, TrendingUp, Handshake, ShoppingCart, DollarSign } from 'lucide-react'

export default function TradeSuggestionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Trade Suggestions & Requirements
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Post your business requirements or browse opportunities from traders worldwide. 
              Connect with potential partners for buying, selling, partnerships, and investments.
            </p>
            
            {/* Trade Type Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-900">Buying Requests</div>
                <div className="text-2xl font-bold text-blue-600">324</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-900">Selling Offers</div>
                <div className="text-2xl font-bold text-green-600">187</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Handshake className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-900">Partnerships</div>
                <div className="text-2xl font-bold text-purple-600">92</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-yellow-900">Investments</div>
                <div className="text-2xl font-bold text-yellow-600">45</div>
              </div>
            </div>

            <CreateTradeSuggestionButton />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trade suggestions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Types</option>
                <option value="BUYING">Buying Requests</option>
                <option value="SELLING">Selling Offers</option>
                <option value="PARTNERSHIP">Partnerships</option>
                <option value="INVESTMENT">Investments</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Countries</option>
                <option value="United States">United States</option>
                <option value="China">China</option>
                <option value="Germany">Germany</option>
                <option value="India">India</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Trade Suggestions List */}
        <Suspense fallback={<div className="text-center py-8">Loading trade suggestions...</div>}>
          <TradeSuggestionsList />
        </Suspense>
      </div>
    </div>
  )
}
