import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test the connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Try to query the database (this will show if tables exist)
    try {
      const userCount = await prisma.user.count()
      console.log(`📊 Current users in database: ${userCount}`)
    } catch (error) {
      console.log('⚠️  Tables not yet created. Run: npx prisma db push')
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.log('\n💡 Troubleshooting tips:')
    console.log('1. Make sure PostgreSQL is running')
    console.log('2. Check your DATABASE_URL in .env file')
    console.log('3. Ensure the database exists')
    console.log('4. Verify connection details (host, port, username, password)')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
