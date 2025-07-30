import { PrismaClient } from '@prisma/client'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'

const prisma = new PrismaClient()

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {category._count.products} product{category._count.products !== 1 ? 's' : ''}
                    </span>
                    <span className="text-blue-600 group-hover:underline">
                      View all →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              Categories will appear here once they are created.
            </p>
          </div>
        )}

        {/* Popular Categories Section */}
        {categories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popular Categories
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                .sort((a, b) => b._count.products - a._count.products)
                .slice(0, 12)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group p-4 bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-center">
                      <Package className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {category._count.products} items
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Post your trade requirement and let suppliers come to you, or browse our trade suggestions to find potential partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trade-suggestions/new"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Post Trade Requirement
            </Link>
            <Link
              href="/trade-suggestions"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Trade Suggestions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
