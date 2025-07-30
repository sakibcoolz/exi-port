'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function CreateTradeSuggestionButton() {
  return (
    <Link
      href="/trade-suggestions/create"
      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="h-5 w-5 mr-2" />
      Post Trade Requirement
    </Link>
  )
}
