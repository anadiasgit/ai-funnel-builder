'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Clock, 
  RefreshCw, 
  X,
  Info,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ErrorState } from './use-error-handler'

interface EnhancedErrorDisplayProps {
  errorState: ErrorState
  isOnline: boolean
  isRateLimited: boolean
  rateLimitReset: Date | null
  onRetry?: () => void
  onDismiss?: () => void
  onClear?: () => void
  className?: string
  showActions?: boolean
  variant?: 'inline' | 'card' | 'alert'
}

export function EnhancedErrorDisplay({
  errorState,
  isOnline,
  isRateLimited,
  rateLimitReset,
  onRetry,
  onDismiss,
  onClear,
  className,
  showActions = true,
  variant = 'alert'
}: EnhancedErrorDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!errorState.hasError) return null

  const getErrorIcon = () => {
    switch (errorState.type) {
      case 'network':
        return isOnline ? Wifi : WifiOff
      case 'rate-limit':
      case 'timeout':
        return Clock
      case 'validation':
        return AlertCircle
      case 'api':
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  const getErrorColor = () => {
    switch (errorState.type) {
      case 'network':
        return 'border-orange-200 bg-orange-50 text-orange-800'
      case 'rate-limit':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'timeout':
        return 'border-orange-200 bg-orange-50 text-orange-800'
      case 'validation':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'api':
        return 'border-red-200 bg-red-50 text-red-800'
      default:
        return 'border-red-200 bg-red-50 text-red-800'
    }
  }

  const getErrorTitle = () => {
    switch (errorState.type) {
      case 'network':
        return isOnline ? 'Network Issue' : 'Offline'
      case 'rate-limit':
        return 'Rate Limited'
      case 'timeout':
        return 'Operation Timed Out'
      case 'validation':
        return 'Validation Error'
      case 'api':
        return 'API Error'
      default:
        return 'Error'
    }
  }

  const getRateLimitCountdown = () => {
    if (!rateLimitReset) return null
    
    const now = new Date()
    const timeUntilReset = Math.ceil((rateLimitReset.getTime() - now.getTime()) / 1000)
    
    if (timeUntilReset <= 0) return null
    
    const minutes = Math.floor(timeUntilReset / 60)
    const seconds = timeUntilReset % 60
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const canRetry = () => {
    if (errorState.type === 'rate-limit' && isRateLimited) return false
    if (errorState.type === 'validation') return false
    return true
  }

  const renderInline = () => {
    const IconComponent = getErrorIcon()
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-md border", getErrorColor(), className)}>
        {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
        <span className="text-sm font-medium">{getErrorTitle()}</span>
        <span className="text-sm opacity-80">{errorState.message}</span>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-auto">
            {canRetry() && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2 text-xs hover:bg-orange-100"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 px-2 text-xs hover:bg-orange-100"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderAlert = () => {
    const IconComponent = getErrorIcon()
    return (
      <Alert variant="destructive" className={cn("border-2", className)}>
        <div className="flex items-start gap-3 w-full">
          <div className="flex-shrink-0 mt-0.5">
            {IconComponent && <IconComponent className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <AlertTitle className="flex items-center gap-2">
              {getErrorTitle()}
              {errorState.retryCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  Attempt {errorState.retryCount + 1}
                </Badge>
              )}
            </AlertTitle>
            
            <AlertDescription className="mt-1">
              {errorState.message}
              
              {errorState.type === 'rate-limit' && rateLimitReset && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Reset in: {getRateLimitCountdown()}</span>
                </div>
              )}
              
              {errorState.type === 'network' && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span>Connection restored</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-600" />
                      <span>You are currently offline</span>
                    </>
                  )}
                </div>
              )}
            </AlertDescription>
            
            {showActions && (
              <div className="flex items-center gap-2 mt-3">
                {canRetry() && onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="border-red-200 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry ({errorState.retryCount + 1}/3)
                  </Button>
                )}
                
                {onClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-red-600 hover:bg-red-100"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Alert>
    )
  }

  const renderCard = () => {
    const IconComponent = getErrorIcon()
    return (
      <Card className={cn("border-2 border-red-200 bg-red-50", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {IconComponent && <IconComponent className="w-6 h-6 text-red-600" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-red-800">{getErrorTitle()}</h4>
                {errorState.retryCount > 0 && (
                  <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                    Attempt {errorState.retryCount + 1}
                  </Badge>
                )}
              </div>
              
              <p className="text-red-700 mb-3">{errorState.message}</p>
              
              {errorState.type === 'rate-limit' && rateLimitReset && (
                <div className="mb-3 p-2 bg-yellow-100 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Clock className="w-4 h-4" />
                    <span>Rate limit will reset in: {getRateLimitCountdown()}</span>
                  </div>
                </div>
              )}
              
              {errorState.type === 'network' && (
                <div className="mb-3 p-2 bg-blue-100 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    {isOnline ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Connection restored - you can try again</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4" />
                        <span>You are currently offline</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {showActions && (
                <div className="flex items-center gap-2">
                  {canRetry() && onRetry && (
                    <Button
                      variant="outline"
                      onClick={onRetry}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry ({errorState.retryCount + 1}/3)
                    </Button>
                  )}
                  
                  {onClear && (
                    <Button
                      variant="ghost"
                      onClick={onClear}
                      className="text-red-600 hover:bg-red-100"
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  switch (variant) {
    case 'inline':
      return renderInline()
    case 'card':
      return renderCard()
    case 'alert':
    default:
      return renderAlert()
  }
}
