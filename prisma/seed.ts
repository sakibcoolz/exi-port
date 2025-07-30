import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = [
    {
      name: 'Agriculture & Food',
      slug: 'agriculture-food',
      description: 'Agricultural products, food items, beverages, and organic produce'
    },
    {
      name: 'Textiles & Apparel',
      slug: 'textiles-apparel',
      description: 'Clothing, fabrics, footwear, and fashion accessories'
    },
    {
      name: 'Electronics & Technology',
      slug: 'electronics-technology',
      description: 'Electronic devices, computers, telecommunications equipment'
    },
    {
      name: 'Machinery & Equipment',
      slug: 'machinery-equipment',
      description: 'Industrial machinery, manufacturing equipment, tools'
    }
  ]

  const createdCategories = await Promise.all(
    categories.map(category =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
    )
  )

  console.log(`✅ Created ${createdCategories.length} categories`)

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const createdUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'exporter@example.com' },
      update: {},
      create: {
        email: 'exporter@example.com',
        name: 'Global Exports Ltd',
        password: hashedPassword,
        role: UserRole.EXPORTER,
        company: 'Global Exports Ltd',
        country: 'India',
        city: 'Mumbai',
        isVerified: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'importer@example.com' },
      update: {},
      create: {
        email: 'importer@example.com',
        name: 'International Imports Co',
        password: hashedPassword,
        role: UserRole.IMPORTER,
        company: 'International Imports Co',
        country: 'USA',
        city: 'New York',
        isVerified: true
      }
    })
  ])

  console.log(`✅ Created ${createdUsers.length} sample users`)

  // Create sample products
  const createdProducts = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Premium Basmati Rice - 1121 Grade',
        slug: 'premium-basmati-rice-1121-grade',
        description: 'High-quality 1121 Basmati rice with long grains and aromatic fragrance.',
        shortDesc: 'Premium quality 1121 Basmati rice for export',
        price: 850.00,
        currency: 'USD',
        minOrder: '20 MT',
        unit: 'per MT',
        hsCode: '100630',
        origin: 'India',
        condition: 'NEW',
        country: 'India',
        state: 'Punjab',
        city: 'Amritsar',
        userId: createdUsers[0].id,
        categoryId: createdCategories[0].id
      }
    }),
    prisma.product.create({
      data: {
        title: 'Organic Cotton T-Shirts - Export Quality',
        slug: 'organic-cotton-t-shirts-export-quality',
        description: 'Premium organic cotton t-shirts manufactured with GOTS certification.',
        shortDesc: 'GOTS certified organic cotton t-shirts',
        price: 4.50,
        currency: 'USD',
        minOrder: '5000 pieces',
        unit: 'per piece',
        hsCode: '610910',
        origin: 'India',
        condition: 'NEW',
        country: 'India',
        state: 'Tamil Nadu',
        city: 'Tirupur',
        userId: createdUsers[0].id,
        categoryId: createdCategories[1].id
      }
    })
  ])

  console.log(`✅ Created ${createdProducts.length} sample products`)

  // Create sample trade suggestions
  const createdTradeSuggestions = await Promise.all([
    prisma.tradeSuggestion.create({
      data: {
        type: 'BUYING',
        title: 'Looking for Organic Spices Supplier',
        description: 'We are a US-based food distributor looking for reliable suppliers of organic spices.',
        productCategory: 'Agriculture & Food',
        productName: 'Organic Spices Mix',
        quantity: '500 kg',
        unit: 'monthly',
        budgetMin: 5000.00,
        budgetMax: 15000.00,
        currency: 'USD',
        country: 'USA',
        state: 'California',
        city: 'Los Angeles',
        urgency: 'NORMAL',
        contactMethod: 'EMAIL',
        email: 'buyer@fooddist.com',
        userId: createdUsers[1].id
      }
    }),
    prisma.tradeSuggestion.create({
      data: {
        type: 'SELLING',
        title: 'Fresh Fruits Export - Mangoes & Pomegranates',
        description: 'Direct from farm fresh mangoes and pomegranates available for export.',
        productCategory: 'Agriculture & Food',
        productName: 'Fresh Fruits',
        quantity: '20-50 MT',
        unit: 'per shipment',
        budgetMin: 800.00,
        budgetMax: 1200.00,
        currency: 'USD',
        country: 'India',
        state: 'Maharashtra',
        city: 'Pune',
        urgency: 'HIGH',
        contactMethod: 'BOTH',
        email: 'export@freshfruits.com',
        phoneNumber: '+91-9876543210',
        userId: createdUsers[0].id
      }
    })
  ])

  console.log(`✅ Created ${createdTradeSuggestions.length} sample trade suggestions`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
