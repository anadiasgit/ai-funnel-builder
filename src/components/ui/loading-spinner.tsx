import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-current', sizeClasses[size])} />
      {text && <span className="ml-2 text-sm">{text}</span>}
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
