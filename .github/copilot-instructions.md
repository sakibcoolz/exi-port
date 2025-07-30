# Exi-port.com Development Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Exi-port.com is a global trade classified platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. The platform connects exporters, importers, trade agents, and buyers worldwide.

## Architecture Guidelines

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt.js
- **File Handling**: Sharp for image processing, Multer for uploads
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Code Style
- Use TypeScript for all files
- Follow Next.js 15 App Router conventions
- Use Server Components by default, Client Components only when needed
- Implement proper error handling and loading states
- Use Tailwind CSS for styling with responsive design
- Follow accessibility best practices

### Database Guidelines
- Use Prisma for all database operations
- Implement proper relations and indexes
- Use transactions for multi-table operations
- Include proper validation and error handling

### API Guidelines
- Follow RESTful principles
- Implement proper status codes and error responses
- Use middleware for authentication and validation
- Include proper CORS handling

### Security Guidelines
- Hash passwords with bcrypt
- Implement JWT authentication
- Validate all user inputs
- Sanitize data before database operations
- Use environment variables for sensitive data

### Features to Implement
1. **Public Product Listings** - No login required for browsing
2. **User Registration & Authentication** - JWT-based auth system
3. **Product Management** - CRUD operations for products
4. **Trade Suggestions** - Smart form for trade requirements
5. **Search & Filtering** - By country, category, keywords
6. **File Upload** - Image handling for products
7. **Responsive Design** - Mobile-first approach

### File Structure
- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations
- `/public` - Static assets

When generating code, prioritize:
1. Type safety
2. Performance optimization
3. User experience
4. Security
5. Maintainability
