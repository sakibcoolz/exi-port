import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const getBadgeStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case "secondary":
      return "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200"
    case "destructive":
      return "border-transparent bg-red-500 text-white hover:bg-red-600"
    case "outline":
      return "border-gray-300 text-gray-900 hover:bg-gray-50"
    default:
      return "border-transparent bg-blue-500 text-white hover:bg-blue-600"
  }
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        getBadgeStyles(variant),
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }
