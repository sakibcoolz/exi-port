'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface ProductFiltersProps {
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
  onFilterChange: (key: string, value: string) => void
}

const conditions = [
  { value: '', label: 'Any Condition' },
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' }
]

const availabilityOptions = [
  { value: '', label: 'Any Availability' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'LIMITED', label: 'Limited Stock' },
  { value: 'ON_DEMAND', label: 'On Demand' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' }
]

const countries = [
  'United States', 'China', 'India', 'Germany', 'Japan', 'United Kingdom',
  'France', 'Italy', 'Brazil', 'Canada', 'South Korea', 'Spain',
  'Australia', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia',
  'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Thailand', 'Ireland',
  'Israel', 'Nigeria', 'Egypt', 'South Africa', 'Philippines', 'Malaysia',
  'Bangladesh', 'Vietnam', 'Chile', 'Finland', 'Romania', 'Czech Republic',
  'New Zealand', 'Peru', 'Ukraine', 'Morocco', 'Kenya'
]

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    location: true,
    price: true,
    condition: true,
    availability: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 mb-3 hover:text-blue-600"
      >
        {title}
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {/* Category Filter */}
      <div className="lg:col-span-1">
        <FilterSection title="Category" section="category">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          
          {loadingCategories ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <label key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={filters.category === category.name}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category._count.products}
                </span>
              </label>
            ))
          )}
        </div>
      </FilterSection>
      </div>

      {/* Location Filter */}
      <div className="lg:col-span-1">
        <FilterSection title="Location" section="location">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>
      </div>

      {/* Price Range Filter */}
      <div className="lg:col-span-1">
        <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Price Range (USD)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
            </div>
          </div>
          
          {/* Quick Price Ranges */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Quick Ranges
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under $10', min: '', max: '10' },
                { label: '$10-$100', min: '10', max: '100' },
                { label: '$100-$1K', min: '100', max: '1000' },
                { label: 'Over $1K', min: '1000', max: '' }
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    onFilterChange('minPrice', range.min)
                    onFilterChange('maxPrice', range.max)
                  }}
                  className={`text-xs px-2 py-1 border rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterSection>
      </div>

      {/* Condition Filter */}
      <div className="lg:col-span-1">
        <FilterSection title="Condition" section="condition">
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition.value} className="flex items-center">
              <input
                type="radio"
                name="condition"
                value={condition.value}
                checked={filters.condition === condition.value}
                onChange={(e) => onFilterChange('condition', e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{condition.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      </div>

      {/* Availability Filter */}
      <div className="lg:col-span-1">
        <FilterSection title="Availability" section="availability">
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={filters.availability === option.value}
                onChange={(e) => onFilterChange('availability', e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      </div>

      {/* Desktop Sort (hidden on mobile since it's in the main controls) */}
      <div className="hidden lg:block lg:col-span-1">
        <FilterSection title="Sort By" section="availability">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="name">Name A-Z</option>
          </select>
        </FilterSection>
      </div>
    </div>
  )
}
