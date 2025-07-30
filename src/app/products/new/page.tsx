import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import CreateProductForm from '@/components/products/CreateProductForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: 'Post New Product - Exi-port',
  description: 'List your product for international trade'
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })
  return categories
}

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/products/new')
  }

  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Product</h1>
        <p className="text-gray-600">
          List your product to connect with international buyers and importers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Provide detailed information about your product to attract potential buyers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
