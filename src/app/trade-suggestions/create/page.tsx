'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  TrendingUp, 
  Handshake, 
  DollarSign, 
  Globe, 
  Calendar, 
  Package, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const categories = [
  'Agriculture & Food',
  'Automotive & Transportation',
  'Beauty & Personal Care',
  'Chemicals & Materials',
  'Construction & Real Estate',
  'Electronics & Technology',
  'Energy & Environment',
  'Fashion & Apparel',
  'Health & Medical',
  'Home & Garden',
  'Industrial & Manufacturing',
  'Sports & Recreation',
  'Textiles & Leather',
  'Toys & Games',
  'Other'
]

const countries = [
  'United States', 'China', 'Germany', 'Japan', 'United Kingdom', 'France', 'India', 'Italy',
  'Brazil', 'Canada', 'Russia', 'South Korea', 'Spain', 'Australia', 'Mexico', 'Indonesia',
  'Netherlands', 'Saudi Arabia', 'Turkey', 'Taiwan', 'Belgium', 'Argentina', 'Ireland',
  'Israel', 'Thailand', 'Nigeria', 'Egypt', 'South Africa', 'Philippines', 'Bangladesh',
  'Vietnam', 'Chile', 'Finland', 'Romania', 'Czech Republic', 'New Zealand', 'Peru',
  'Iraq', 'Algeria', 'Qatar', 'Kazakhstan', 'Greece', 'Portugal', 'Ukraine', 'Kuwait'
]

const timelines = [
  'Immediate (Within 1 week)',
  'Short term (1-4 weeks)',
  'Medium term (1-3 months)',
  'Long term (3-6 months)',
  'Future planning (6+ months)',
  'Ongoing/Continuous'
]

export default function CreateTradeSuggestionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'BUYING' as 'BUYING' | 'SELLING' | 'PARTNERSHIP' | 'INVESTMENT',
    category: '',
    country: '',
    budget: '',
    quantity: '',
    timeline: '',
    specifications: {
      productName: '',
      brand: '',
      model: '',
      quality: '',
      packaging: '',
      certification: '',
      additionalRequirements: ''
    },
    contactInfo: {
      preferredContact: 'email',
      phone: '',
      email: '',
      companyWebsite: '',
      additionalNotes: ''
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to create a trade suggestion.</p>
            <Link
              href="/auth/signin"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('specifications.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [field]: value
        }
      }))
    } else if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required'
    if (!formData.description.trim()) return 'Description is required'
    if (!formData.category) return 'Category is required'
    if (!formData.country) return 'Country is required'
    if (!formData.timeline) return 'Timeline is required'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/trade-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/trade-suggestions')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to create trade suggestion')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trade Suggestion Created!</h2>
            <p className="text-gray-600 mb-4">Your trade requirement has been posted successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to trade suggestions...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUYING': return <ShoppingCart className="h-5 w-5" />
      case 'SELLING': return <TrendingUp className="h-5 w-5" />
      case 'PARTNERSHIP': return <Handshake className="h-5 w-5" />
      case 'INVESTMENT': return <DollarSign className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Trade Suggestion
          </h1>
          <p className="text-lg text-gray-600">
            Post your business requirements and connect with potential trade partners
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Trade Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What type of trade opportunity are you posting?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'BUYING', label: 'I want to buy', desc: 'Looking for suppliers', color: 'blue' },
                  { value: 'SELLING', label: 'I want to sell', desc: 'Offering products/services', color: 'green' },
                  { value: 'PARTNERSHIP', label: 'Partnership', desc: 'Seeking business partners', color: 'purple' },
                  { value: 'INVESTMENT', label: 'Investment', desc: 'Investment opportunities', color: 'yellow' }
                ].map((type) => (
                  <div key={type.value} className="relative">
                    <input
                      type="radio"
                      id={type.value}
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={type.value}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.type === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-2 rounded-full mb-2 ${
                          formData.type === type.value 
                            ? `bg-${type.color}-100 text-${type.color}-600`
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getTypeIcon(type.value)}
                        </div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a clear, descriptive title for your trade requirement"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Country *
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $10,000 - $50,000"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity/Volume
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1000 units, 10 tons"
                />
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <div className="relative">
                  <select
                    id="timeline"
                    name="timeline"
                    required
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select timeline</option>
                    {timelines.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide detailed information about your requirements, expectations, and any specific criteria..."
              />
            </div>

            {/* Product Specifications */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Product Specifications (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specifications.productName" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    id="specifications.productName"
                    name="specifications.productName"
                    type="text"
                    value={formData.specifications.productName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specific product name"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Brand
                  </label>
                  <input
                    id="specifications.brand"
                    name="specifications.brand"
                    type="text"
                    value={formData.specifications.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any specific brand preference"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.model" className="block text-sm font-medium text-gray-700 mb-2">
                    Model/Version
                  </label>
                  <input
                    id="specifications.model"
                    name="specifications.model"
                    type="text"
                    value={formData.specifications.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Model number or version"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.quality" className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Requirements
                  </label>
                  <input
                    id="specifications.quality"
                    name="specifications.quality"
                    type="text"
                    value={formData.specifications.quality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Quality standards, grade, etc."
                  />
                </div>

                <div>
                  <label htmlFor="specifications.packaging" className="block text-sm font-medium text-gray-700 mb-2">
                    Packaging Requirements
                  </label>
                  <input
                    id="specifications.packaging"
                    name="specifications.packaging"
                    type="text"
                    value={formData.specifications.packaging}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Packaging specifications"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.certification" className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications Needed
                  </label>
                  <input
                    id="specifications.certification"
                    name="specifications.certification"
                    type="text"
                    value={formData.specifications.certification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ISO, CE, FDA, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="specifications.additionalRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    id="specifications.additionalRequirements"
                    name="specifications.additionalRequirements"
                    rows={3}
                    value={formData.specifications.additionalRequirements}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any other specific requirements or preferences..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactInfo.preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    id="contactInfo.preferredContact"
                    name="contactInfo.preferredContact"
                    value={formData.contactInfo.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Both Email & Phone</option>
                    <option value="platform">Through Platform Only</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your contact number"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    id="contactInfo.email"
                    name="contactInfo.email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your business email"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    id="contactInfo.companyWebsite"
                    name="contactInfo.companyWebsite"
                    type="url"
                    value={formData.contactInfo.companyWebsite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="contactInfo.additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Contact Notes
                  </label>
                  <textarea
                    id="contactInfo.additionalNotes"
                    name="contactInfo.additionalNotes"
                    rows={3}
                    value={formData.contactInfo.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Best time to contact, preferred language, etc."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-8 border-t">
              <Link
                href="/trade-suggestions"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Trade Suggestion
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
