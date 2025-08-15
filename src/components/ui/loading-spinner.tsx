'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 
        className={cn(
          'animate-spin text-blue-600',
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="text-gray-500">Please wait while we set up your experience</p>
      </div>
    </div>
  )
}
