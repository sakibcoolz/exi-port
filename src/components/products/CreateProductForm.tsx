'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Save, ImagePlus } from 'lucide-react'
import { countries } from '@/lib/countries'

const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  shortDesc: z.string().max(300).optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0).optional(),
  currency: z.string(),
  minOrder: z.string().optional(),
  unit: z.string().optional(),
  hsCode: z.string().optional(),
  origin: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
  country: z.string().min(1, 'Please select a country'),
  state: z.string().optional(),
  city: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional()
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface CreateProductFormProps {
  categories: Category[]
}

export default function CreateProductForm({ categories }: CreateProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [images, setImages] = useState<File[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      currency: 'USD',
      condition: 'NEW'
    }
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Append images
      images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      const result = await response.json()
      setMessage({ type: 'success', text: 'Product created successfully!' })
      
      // Redirect to the product page after a short delay
      setTimeout(() => {
        router.push(`/products/${result.product.slug}`)
      }, 2000)

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setImages(prev => [...prev, ...files].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Premium Basmati Rice - Export Quality"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDesc">Short Description</Label>
          <Input
            id="shortDesc"
            {...register('shortDesc')}
            placeholder="Brief description for listings"
            className={errors.shortDesc ? 'border-red-500' : ''}
          />
          {errors.shortDesc && (
            <p className="text-sm text-red-600">{errors.shortDesc.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description *</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Provide detailed information about your product, its features, specifications, and benefits..."
            rows={6}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={watch('categoryId') || ''}
            onValueChange={(value: string) => setValue('categoryId', value)}
          >
            <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Pricing & Order Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Pricing & Order Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="100.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={watch('currency')}
              onValueChange={(value: string) => setValue('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              {...register('unit')}
              placeholder="per kg, per piece, per MT"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrder">Minimum Order Quantity</Label>
          <Input
            id="minOrder"
            {...register('minOrder')}
            placeholder="100 kg, 1000 pieces, 20 MT"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder="Brand name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              {...register('model')}
              placeholder="Model number/name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={watch('condition')}
              onValueChange={(value: any) => setValue('condition', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="USED">Used</SelectItem>
                <SelectItem value="REFURBISHED">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hsCode">HS Code</Label>
            <Input
              id="hsCode"
              {...register('hsCode')}
              placeholder="Harmonized System Code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin">Country of Origin</Label>
            <Input
              id="origin"
              {...register('origin')}
              placeholder="Manufacturing country"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={watch('country') || ''}
              onValueChange={(value: string) => setValue('country', value)}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="State or province"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="City name"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload product images
                  </span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG up to 5MB each. Max 5 images.
                </p>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">SEO (Optional)</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...register('metaTitle')}
              placeholder="SEO title for search engines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDesc">Meta Description</Label>
            <Textarea
              id="metaDesc"
              {...register('metaDesc')}
              placeholder="SEO description for search engines"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isLoading ? 'Creating...' : 'Create Product'}</span>
        </Button>
      </div>
    </form>
  )
}
