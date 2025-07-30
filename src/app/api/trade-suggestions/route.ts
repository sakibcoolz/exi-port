import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTradeSuggestionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['BUYING', 'SELLING', 'PARTNERSHIP', 'INVESTMENT']),
  category: z.string().min(1, 'Category is required'),
  country: z.string().min(1, 'Country is required'),
  budget: z.string().optional(),
  quantity: z.string().optional(),
  timeline: z.string().min(1, 'Timeline is required'),
  specifications: z.object({
    productName: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    quality: z.string().optional(),
    packaging: z.string().optional(),
    certification: z.string().optional(),
    additionalRequirements: z.string().optional(),
  }).optional(),
  contactInfo: z.object({
    preferredContact: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    companyWebsite: z.string().optional(),
    additionalNotes: z.string().optional(),
  })
})

// GET /api/trade-suggestions - Get all trade suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const country = searchParams.get('country')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    if (type) {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (country) {
      where.country = country
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [tradeSuggestions, total] = await Promise.all([
      prisma.tradeSuggestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              company: true,
              country: true,
              isVerified: true
            }
          }
        }
      }),
      prisma.tradeSuggestion.count({ where })
    ])

    return NextResponse.json({
      tradeSuggestions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching trade suggestions:', error)
    return NextResponse.json(
      { message: 'Failed to fetch trade suggestions' },
      { status: 500 }
    )
  }
}

// POST /api/trade-suggestions - Create new trade suggestion
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createTradeSuggestionSchema.parse(body)

    // Create trade suggestion
    const tradeSuggestion = await prisma.tradeSuggestion.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        category: validatedData.category,
        country: validatedData.country,
        budget: validatedData.budget,
        quantity: validatedData.quantity,
        timeline: validatedData.timeline,
        specifications: validatedData.specifications || {},
        contactInfo: validatedData.contactInfo,
        userId: session.user.id,
        // Set expiration date (default: 3 months from now)
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            company: true,
            country: true,
            isVerified: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Trade suggestion created successfully',
        tradeSuggestion 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating trade suggestion:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: error.issues 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to create trade suggestion' },
      { status: 500 }
    )
  }
}
