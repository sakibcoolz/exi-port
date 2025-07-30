# Exi-port.com - Global Trade Platform

## Project Overview

Exi-port.com is a comprehensive global trade classified platform that connects exporters, importers, and trade agents worldwide. The platform enables users to post products, discover trade opportunities, and build profitable business relationships.

## Technology Stack

### Frontend
- **Next.js 15** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication system
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **bcrypt.js** - Password hashing

### Additional Libraries
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sharp** - Image optimization
- **Multer** - File uploads

## Features Implemented

### 🏠 Homepage
- Hero section with search functionality
- Platform statistics display
- Feature highlights (Global Reach, Secure Trading, Fast Matching, Expert Support)
- Popular product categories
- How it works section (3-step process)
- User testimonials
- Responsive design

### 🔐 Authentication System
- **Sign In Page** (`/auth/signin`)
  - Email/password authentication
  - Remember me functionality
  - Forgot password link
  - Social login buttons (Google, LinkedIn)
  - Error handling and validation

- **Sign Up Page** (`/auth/signup`)
  - Complete registration form
  - User role selection (Exporter, Importer, Trade Agent)
  - Form validation with Zod
  - Terms and conditions agreement
  - Success confirmation

- **API Routes**
  - `/api/auth/register` - User registration
  - `/api/auth/[...nextauth]` - NextAuth configuration

### 📦 Products Listing (`/products`)
- Advanced search functionality
- Category filtering
- Price range filtering
- Sort options (newest, oldest, price, popularity)
- Grid/List view toggle
- Responsive product cards
- Mock product data with realistic information
- Suspense boundary for search params

### 📊 User Dashboard (`/dashboard`)
- Welcome message with user name
- Statistics overview (products, views, inquiries)
- Quick action cards (Post Product, Manage Products, View Inquiries)
- Recent products section
- Recent inquiries section
- Role-based access control

### 🧭 Navigation & Layout
- **Navbar**
  - Logo and branding
  - Search functionality
  - User authentication state
  - Mobile-responsive menu
  - User profile dropdown
  - Quick access to dashboard and products

- **Footer**
  - Organized link sections (Products, Trade, Support, Company)
  - Contact information
  - Newsletter signup
  - Social media links
  - Copyright information

## Database Schema

### User Model
```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  password     String
  companyName  String
  phone        String
  role         UserRole  @default(EXPORTER)
  isVerified   Boolean   @default(false)
  products     Product[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

### Product Model
```prisma
model Product {
  id           String        @id @default(cuid())
  title        String
  description  String
  price        Float
  currency     String        @default("USD")
  minOrderQty  Int
  unit         String
  category     Category      @relation(fields: [categoryId], references: [id])
  categoryId   String
  images       String[]
  location     String
  status       ProductStatus @default(PENDING)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

### Category Model
```prisma
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts
│   │       └── register/route.ts
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── products/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── providers.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── prisma/
    └── schema.prisma
```

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/exi_port"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Social Auth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Homepage: http://localhost:3000
   - Products: http://localhost:3000/products
   - Sign In: http://localhost:3000/auth/signin
   - Sign Up: http://localhost:3000/auth/signup

## Features for Future Development

### Phase 2 - Core Functionality
- [ ] Product detail pages
- [ ] Product creation/editing forms
- [ ] Image upload functionality
- [ ] Advanced search with filters
- [ ] User profile management
- [ ] Inquiry system (buyer-seller communication)

### Phase 3 - Advanced Features
- [ ] Real-time chat system
- [ ] Trade suggestions engine
- [ ] Document management
- [ ] Payment integration
- [ ] Order management
- [ ] Rating and review system

### Phase 4 - Business Features
- [ ] Premium memberships
- [ ] Featured listings
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Export/Import documentation tools
- [ ] Multi-language support

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- CSRF protection (NextAuth)
- Secure session management

## Performance Optimizations

- Next.js App Router for optimal performance
- Static page generation where possible
- Image optimization with Next.js Image component
- Component-level code splitting
- Tailwind CSS for optimal bundle size

## Responsive Design

- Mobile-first approach
- Breakpoint system: sm, md, lg, xl
- Touch-friendly interfaces
- Optimized for all device sizes

---

The Exi-port.com platform is now ready for development and can be extended with additional features as needed. The foundation provides a solid base for a comprehensive global trade platform.
