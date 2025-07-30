const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    const tradeSuggestionCount = await prisma.tradeSuggestion.count()
    
    console.log('✅ Database connection successful!')
    console.log(`Found: ${userCount} users, ${categoryCount} categories, ${productCount} products, ${tradeSuggestionCount} trade suggestions`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
