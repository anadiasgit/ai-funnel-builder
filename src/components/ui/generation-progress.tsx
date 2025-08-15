'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface GenerationProgressProps {
  progress: number
  className?: string
  showPercentage?: boolean
}

export function GenerationProgress({ 
  progress, 
  className, 
  showPercentage = true 
}: GenerationProgressProps) {
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-blue-500'
    if (value >= 40) return 'bg-yellow-500'
    if (value >= 20) return 'bg-orange-500'
    return 'bg-gray-300'
  }

  const getProgressText = (value: number) => {
    if (value === 100) return 'Funnel Complete! 🎉'
    if (value >= 80) return 'Almost there!'
    if (value >= 60) return 'Great progress!'
    if (value >= 40) return 'Getting started'
    if (value >= 20) return 'Just beginning'
    return 'Let\'s get started!'
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Progress 
        value={progress} 
        className="h-3"
        indicatorClassName={getProgressColor(progress)}
      />
      
      {showPercentage && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">
            {getProgressText(progress)}
          </span>
          <span className="text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
