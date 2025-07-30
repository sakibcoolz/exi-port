// Enum types
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum ProductCondition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED'
}

export enum ProductAvailability {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LIMITED = 'LIMITED',
  ON_DEMAND = 'ON_DEMAND'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum TradeType {
  BUYING = 'BUYING',
  SELLING = 'SELLING',
  PARTNERSHIP = 'PARTNERSHIP',
  INVESTMENT = 'INVESTMENT'
}

export enum SuggestionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

// Base model types
export interface User {
  id: string
  email: string
  name?: string
  password?: string
  phone?: string
  avatar?: string
  company?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  isVerified: boolean
  emailVerified?: Date
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDesc?: string
  price?: number
  currency: string
  minOrder?: string
  unit?: string
  images: string[]
  specifications?: any
  hsCode?: string
  origin?: string
  brand?: string
  model?: string
  condition: ProductCondition
  availability: ProductAvailability
  status: ProductStatus
  views: number
  isPromoted: boolean
  promotedUntil?: Date
  expiresAt?: Date
  country: string
  state?: string
  city?: string
  metaTitle?: string
  metaDesc?: string
  keywords: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  categoryId: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface TradeSuggestion {
  id: string
  title: string
  description: string
  type: TradeType
  category: string
  country: string
  budget?: string
  quantity?: string
  timeline?: string
  specifications?: any
  contactInfo: any
  status: SuggestionStatus
  priority: number
  views: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Extended types with relations
export interface UserWithProducts extends User {
  products: Product[]
  tradeSuggestions: TradeSuggestion[]
}

export interface ProductWithDetails extends Product {
  user: User
  category: Category
}

export interface CategoryWithProducts extends Category {
  products: Product[]
  parent?: Category
  children: Category[]
}

export interface TradeSuggestionWithUser extends TradeSuggestion {
  user: User
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  company?: string
  phone?: string
  country: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ProductFormData {
  title: string
  description: string
  shortDesc?: string
  categoryId: string
  price?: number
  currency: string
  minOrder?: string
  unit?: string
  specifications?: Record<string, any>
  hsCode?: string
  origin?: string
  brand?: string
  model?: string
  condition: string
  availability: string
  country: string
  state?: string
  city?: string
  keywords?: string[]
  images: File[]
}

export interface TradeSuggestionFormData {
  title: string
  description: string
  type: TradeType
  category: string
  country: string
  budget?: string
  quantity?: string
  timeline?: string
  specifications?: Record<string, any>
  contactInfo: {
    name: string
    email: string
    phone?: string
    company?: string
  }
}

// Search and Filter types
export interface ProductFilters {
  search?: string
  category?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  availability?: string
  sortBy?: 'createdAt' | 'price' | 'title' | 'views'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface TradeSuggestionFilters {
  search?: string
  type?: TradeType[]
  country?: string
  category?: string
  sortBy?: 'createdAt' | 'priority' | 'views'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Utility types
export interface SelectOption {
  value: string
  label: string
}

export interface CountryOption extends SelectOption {
  code: string
  flag?: string
}

export interface CategoryOption extends SelectOption {
  parentId?: string
  level: number
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalViews: number
  totalSuggestions: number
}

export interface UserProfile {
  id: string
  name?: string
  email: string
  avatar?: string
  company?: string
  website?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  isVerified: boolean
  role: UserRole
}

// File upload types
export interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  createdAt: Date
}

export interface FileUploadResponse extends ApiResponse {
  data: UploadedFile[]
}

// NextAuth types extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
  }
}
