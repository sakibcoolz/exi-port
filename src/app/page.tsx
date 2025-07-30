import Link from 'next/link'
import { Search, Globe, Users, ArrowRight, Star, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with exporters and importers from over 190 countries worldwide.',
    },
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Verified users and secure communication channels for safe business transactions.',
    },
    {
      icon: Zap,
      title: 'Fast Matching',
      description: 'AI-powered matching system to find the right trade partners quickly.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support and trade consultation from industry experts.',
    },
  ]

  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Products Listed', value: '500,000+' },
    { label: 'Countries', value: '190+' },
    { label: 'Successful Deals', value: '100,000+' },
  ]

  const categories = [
    'Agriculture & Food',
    'Electronics & Technology',
    'Textiles & Apparel', 
    'Machinery & Equipment',
    'Chemicals & Materials',
    'Automotive Parts',
    'Home & Garden',
    'Health & Beauty',
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Global Trade
              <span className="block text-blue-200">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with exporters, importers, and trade partners worldwide. 
              Discover opportunities, post products, and grow your business on our global platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for products, companies, or trade opportunities..."
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/products/new"
                className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Post Your Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Exi-port.com?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in international trade, 
              from discovering opportunities to closing deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore thousands of products across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-center group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with international trade in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and create a comprehensive business profile to showcase your company and products.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Post or Browse
              </h3>
              <p className="text-gray-600">
                Post your products for export or browse thousands of listings to find what you need to import.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect & Trade
              </h3>
              <p className="text-gray-600">
                Connect directly with trade partners and start building profitable business relationships.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Exi-port.com has revolutionized how we find international suppliers. The platform is user-friendly and the quality of leads is exceptional.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Business Owner</div>
                    <div className="text-gray-500">Global Imports Ltd.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
