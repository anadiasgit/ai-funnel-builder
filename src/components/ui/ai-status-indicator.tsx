'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIStatusIndicatorProps {
  status: 'idle' | 'generating' | 'completed' | 'error'
  className?: string
}

export function AIStatusIndicator({ status, className }: AIStatusIndicatorProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (status === 'generating') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 500)
      return () => clearInterval(interval)
    }
  }, [status])

  const getStatusConfig = () => {
    switch (status) {
      case 'generating':
        return {
          icon: Loader2,
          label: `AI Working${dots}`,
          variant: 'secondary' as const,
          className: 'animate-pulse'
        }
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'AI Complete',
          variant: 'default' as const,
          className: 'text-green-600'
        }
      case 'error':
        return {
          icon: AlertCircle,
          label: 'AI Error',
          variant: 'destructive' as const,
          className: 'text-red-600'
        }
      default:
        return {
          icon: Sparkles,
          label: 'AI Ready',
          variant: 'outline' as const,
          className: 'text-blue-600'
        }
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 font-medium',
        config.className,
        className
      )}
    >
      <IconComponent className="h-3.5 w-3.5" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  )
}
