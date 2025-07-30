import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Search and filter schema
const ProductSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  maxPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).optional(),
  availability: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'LIMITED', 'ON_DEMAND']).optional(),
  sortBy: z.enum(['newest', 'oldest', 'price-low', 'price-high', 'popular', 'name']).default('newest'),
  page: z.string().transform(val => parseInt(val) || 1).default(() => 1),
  limit: z.string().transform(val => parseInt(val) || 12).default(() => 12),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const {
      search,
      category,
      country,
      minPrice,
      maxPrice,
      condition,
      availability,
      sortBy,
      page,
      limit
    } = ProductSearchSchema.parse(params)

    // Build where clause
    const where: any = {
      status: 'ACTIVE', // Only show active products
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { user: { company: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Category filter
    if (category && category !== 'All Categories') {
      where.category = { name: { equals: category, mode: 'insensitive' } }
    }

    // Country filter
    if (country) {
      where.country = { equals: country, mode: 'insensitive' }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // Condition filter
    if (condition) {
      where.condition = condition
    }

    // Availability filter
    if (availability) {
      where.availability = availability
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { views: 'desc' }
        break
      case 'name':
        orderBy = { title: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get products with relations
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              company: true,
              country: true,
              city: true,
              isVerified: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    // Process products data
    const processedProducts = products.map((product: any) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      keywords: product.keywords ? JSON.parse(product.keywords) : [],
      specifications: product.specifications || {},
    }))

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        products: processedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        }
      }
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Create new product (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication middleware
    const body = await request.json()
    
    const ProductCreateSchema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      shortDesc: z.string().optional(),
      price: z.number().positive().optional(),
      currency: z.string().default('USD'),
      minOrder: z.string().optional(),
      unit: z.string().optional(),
      images: z.array(z.string()).optional(),
      specifications: z.record(z.string(), z.any()).optional(),
      hsCode: z.string().optional(),
      origin: z.string().optional(),
      brand: z.string().optional(),
      model: z.string().optional(),
      condition: z.enum(['NEW', 'USED', 'REFURBISHED']).default('NEW'),
      availability: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'LIMITED', 'ON_DEMAND']).default('AVAILABLE'),
      country: z.string().min(1),
      state: z.string().optional(),
      city: z.string().optional(),
      categoryId: z.string().min(1),
      userId: z.string().min(1), // In real app, get from session
      metaTitle: z.string().optional(),
      metaDesc: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })

    const validatedData = ProductCreateSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        keywords: validatedData.keywords ? JSON.stringify(validatedData.keywords) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            company: true,
            country: true,
            city: true,
            isVerified: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
        keywords: product.keywords ? JSON.parse(product.keywords) : [],
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.issues 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
