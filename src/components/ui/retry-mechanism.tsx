'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RetryConfig {
  maxRetries: number
  initialDelay: number
  backoffMultiplier: number
  maxDelay: number
  jitter: boolean
}

interface RetryState {
  attempt: number
  isRetrying: boolean
  lastError: Error | null
  nextRetryTime: Date | null
  totalRetries: number
  successCount: number
}

interface RetryMechanismProps {
  onRetry: () => Promise<unknown>
  config?: Partial<RetryConfig>
  onSuccess?: (result: unknown) => void
  onFailure?: (error: Error, attempt: number) => void
  onMaxRetriesExceeded?: () => void
  className?: string
  variant?: 'inline' | 'card' | 'minimal'
  showProgress?: boolean
  autoRetry?: boolean
  children?: React.ReactNode
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
  jitter: true
}

export function RetryMechanism({
  onRetry,
  config = {},
  onSuccess,
  onFailure,
  onMaxRetriesExceeded,
  className,
  variant = 'inline',
  showProgress = true,
  autoRetry = false,
  children
}: RetryMechanismProps) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const [retryState, setRetryState] = useState<RetryState>({
    attempt: 0,
    isRetrying: false,
    lastError: null,
    nextRetryTime: null,
    totalRetries: 0,
    successCount: 0
  })
  
  const [isActive, setIsActive] = useState(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate delay for next retry
  const calculateDelay = useCallback((attempt: number): number => {
    let delay = finalConfig.initialDelay * Math.pow(finalConfig.backoffMultiplier, attempt)
    
    // Apply maximum delay cap
    delay = Math.min(delay, finalConfig.maxDelay)
    
    // Add jitter to prevent thundering herd
    if (finalConfig.jitter) {
      const jitterAmount = delay * 0.1
      delay += Math.random() * jitterAmount - jitterAmount / 2
    }
    
    return Math.max(delay, 100) // Minimum 100ms delay
  }, [finalConfig])

  // Execute retry with delay
  const executeRetry = useCallback(async (delay: number) => {
    return new Promise<void>((resolve) => {
      retryTimeoutRef.current = setTimeout(async () => {
        try {
          setRetryState(prev => ({ ...prev, isRetrying: true }))
          const result = await onRetry()
          
          setRetryState(prev => ({
            ...prev,
            isRetrying: false,
            lastError: null,
            nextRetryTime: null,
            successCount: prev.successCount + 1
          }))
          
          onSuccess?.(result)
          resolve()
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error))
          
          setRetryState(prev => ({
            ...prev,
            isRetrying: false,
            lastError: errorObj,
            totalRetries: prev.totalRetries + 1
          }))
          
          onFailure?.(errorObj, retryState.attempt + 1)
          resolve()
        }
      }, delay)
    })
  }, [onRetry, onSuccess, onFailure, retryState.attempt])

  // Start retry process
  const startRetry = useCallback(async () => {
    if (retryState.attempt >= finalConfig.maxRetries) {
      onMaxRetriesExceeded?.()
      return
    }

    setIsActive(true)
    const delay = calculateDelay(retryState.attempt)
    const nextRetryTime = new Date(Date.now() + delay)
    
    setRetryState(prev => ({
      ...prev,
      attempt: prev.attempt + 1,
      nextRetryTime
    }))

    await executeRetry(delay)
  }, [retryState.attempt, finalConfig.maxRetries, calculateDelay, executeRetry, onMaxRetriesExceeded])

  // Auto-retry logic
  useEffect(() => {
    if (autoRetry && retryState.lastError && retryState.attempt < finalConfig.maxRetries) {
      const delay = calculateDelay(retryState.attempt)
      const nextRetryTime = new Date(Date.now() + delay)
      
      setRetryState(prev => ({ ...prev, nextRetryTime }))
      executeRetry(delay)
    }
  }, [autoRetry, retryState.lastError, retryState.attempt, finalConfig.maxRetries, calculateDelay, executeRetry])

  // Progress tracking
  useEffect(() => {
    if (showProgress && retryState.nextRetryTime && isActive) {
      progressIntervalRef.current = setInterval(() => {
        const now = new Date()
        const timeLeft = retryState.nextRetryTime!.getTime() - now.getTime()
        
        if (timeLeft <= 0) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
        }
      }, 100)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [showProgress, retryState.nextRetryTime, isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!retryState.nextRetryTime || !isActive) return 0
    
    const now = new Date()
    const totalDelay = retryState.nextRetryTime.getTime() - (now.getTime() - calculateDelay(retryState.attempt - 1))
    const elapsed = totalDelay - (retryState.nextRetryTime.getTime() - now.getTime())
    
    return Math.max(0, Math.min(100, (elapsed / totalDelay) * 100))
  }

  // Get countdown text
  const getCountdownText = () => {
    if (!retryState.nextRetryTime || !isActive) return ''
    
    const now = new Date()
    const timeLeft = retryState.nextRetryTime.getTime() - now.getTime()
    
    if (timeLeft <= 0) return 'Retrying now...'
    
    const seconds = Math.ceil(timeLeft / 1000)
    return `Retrying in ${seconds}s`
  }

  // Reset retry state
  const reset = useCallback(() => {
    setRetryState({
      attempt: 0,
      isRetrying: false,
      lastError: null,
      nextRetryTime: null,
      totalRetries: 0,
      successCount: 0
    })
    setIsActive(false)
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  // Cancel current retry
  const cancel = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    
    setRetryState(prev => ({
      ...prev,
      isRetrying: false,
      nextRetryTime: null
    }))
    
    setIsActive(false)
  }, [])

  const canRetry = retryState.attempt < finalConfig.maxRetries && !retryState.isRetrying
  const isMaxRetriesExceeded = retryState.attempt >= finalConfig.maxRetries

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {children}
        
        {retryState.lastError && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startRetry}
            disabled={!canRetry}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry ({retryState.attempt + 1}/{finalConfig.maxRetries})
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <Card className={cn("border-2", className, {
        'border-red-200': retryState.lastError,
        'border-green-200': retryState.successCount > 0 && !retryState.lastError
      })}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {retryState.lastError ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                Retry Required
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Operation Complete
              </>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {children}
          
          {retryState.lastError && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 font-medium">Last Error:</p>
                <p className="text-sm text-red-600">{retryState.lastError.message}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Attempts:</span>
                <Badge variant="outline">
                  {retryState.attempt}/{finalConfig.maxRetries}
                </Badge>
                <span>•</span>
                <span>Total Retries: {retryState.totalRetries}</span>
              </div>
              
              {showProgress && retryState.nextRetryTime && isActive && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{getCountdownText()}</span>
                    <span className="text-gray-500">{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-2">
                {canRetry && (
                  <Button onClick={startRetry} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Now
                  </Button>
                )}
                
                {isActive && (
                  <Button variant="outline" onClick={cancel} className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                
                <Button variant="ghost" onClick={reset} className="flex-1">
                  Reset
                </Button>
              </div>
              
              {isMaxRetriesExceeded && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Info className="w-4 h-4" />
                    <span>Maximum retries exceeded. Please check your connection and try again.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default inline variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {children}
      
      {retryState.lastError && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Attempt {retryState.attempt}/{finalConfig.maxRetries}
          </Badge>
          
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={startRetry}
              className="h-7 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={cancel}
              className="h-7 px-2 text-xs"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
      
      {showProgress && retryState.nextRetryTime && isActive && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{getCountdownText()}</span>
        </div>
      )}
    </div>
  )
}
