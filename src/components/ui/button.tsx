import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'outline':
          return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        case 'secondary':
          return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        case 'ghost':
          return 'bg-transparent text-gray-700 hover:bg-gray-100'
        case 'link':
          return 'bg-transparent text-blue-600 hover:underline p-0'
        default:
          return 'bg-blue-600 text-white hover:bg-blue-700'
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm'
        case 'lg':
          return 'px-6 py-3 text-lg'
        default:
          return 'px-4 py-2 text-sm'
      }
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          getVariantStyles(),
          getSizeStyles(),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
