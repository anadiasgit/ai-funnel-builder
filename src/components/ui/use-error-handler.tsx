'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react'

export interface ErrorState {
  hasError: boolean
  message: string
  type: 'network' | 'rate-limit' | 'validation' | 'timeout' | 'api' | 'unknown'
  retryCount: number
  lastError: Error | null
  timestamp: number
}

export interface RetryConfig {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
  maxDelay: number
}

export interface ErrorHandlerConfig {
  retry: RetryConfig
  timeout: number
  showUserFeedback: boolean
  logErrors: boolean
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000
}

const DEFAULT_CONFIG: ErrorHandlerConfig = {
  retry: DEFAULT_RETRY_CONFIG,
  timeout: 30000,
  showUserFeedback: true,
  logErrors: true
}

export function useErrorHandler(config: Partial<ErrorHandlerConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: '',
    type: 'unknown',
    retryCount: 0,
    lastError: null,
    timestamp: 0
  })
  
  const [isOnline, setIsOnline] = useState(true)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitReset, setRateLimitReset] = useState<Date | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check initial status
    setIsOnline(navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: '',
      type: 'unknown',
      retryCount: 0,
      lastError: null,
      timestamp: 0
    })
    setIsRateLimited(false)
    setRateLimitReset(null)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setError = useCallback((error: Error, type: ErrorState['type'] = 'unknown', message?: string) => {
    const errorMessage = message || error.message || 'An unexpected error occurred'
    
    if (finalConfig.logErrors) {
      console.error(`[${type.toUpperCase()}] ${errorMessage}:`, error)
    }

    setErrorState({
      hasError: true,
      message: errorMessage,
      type,
      retryCount: 0,
      lastError: error,
      timestamp: Date.now()
    })

    // Auto-clear certain error types after a delay
    if (type === 'validation') {
      setTimeout(() => clearError(), 5000)
    }
  }, [finalConfig.logErrors, clearError])

  const handleRateLimit = useCallback((resetTime: string | number) => {
    const resetDate = new Date(resetTime)
    setIsRateLimited(true)
    setRateLimitReset(resetDate)
    
    // Auto-clear rate limit when time expires
    const now = new Date()
    const timeUntilReset = resetDate.getTime() - now.getTime()
    
    if (timeUntilReset > 0) {
      setTimeout(() => {
        setIsRateLimited(false)
        setRateLimitReset(null)
      }, timeUntilReset)
    }
  }, [])

  const retry = useCallback(async (
    operation: () => Promise<unknown>,
    retryConfig?: Partial<RetryConfig>
  ): Promise<unknown> => {
    const config = { ...finalConfig.retry, ...retryConfig }
    
    if (errorState.retryCount >= config.maxRetries) {
      throw new Error(`Max retries (${config.maxRetries}) exceeded`)
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      config.retryDelay * Math.pow(config.backoffMultiplier, errorState.retryCount),
      config.maxDelay
    )

    return new Promise((resolve, reject) => {
      retryTimeoutRef.current = setTimeout(async () => {
        try {
          setErrorState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }))
          const result = await operation()
          clearError()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }, [errorState.retryCount, finalConfig.retry, clearError])

  const executeWithTimeout = useCallback(async (
    operation: () => Promise<unknown>,
    timeoutMs?: number
  ): Promise<unknown> => {
    const timeout = timeoutMs || finalConfig.timeout
    
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          const timeoutError = new Error(`Operation timed out after ${timeout}ms`)
          setError(timeoutError, 'timeout')
          reject(timeoutError)
        }, timeout)
      })
    ])
  }, [finalConfig.timeout, setError])

  const validateInput = useCallback((input: Record<string, unknown>, validationRules: Record<string, (value: unknown) => boolean | string>) => {
    const errors: string[] = []
    
    Object.entries(validationRules).forEach(([field, validator]) => {
      const result = validator(input[field])
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : `${field} is invalid`)
      }
    })
    
    if (errors.length > 0) {
      const validationError = new Error(errors.join(', '))
      setError(validationError, 'validation')
      return false
    }
    
    return true
  }, [setError])

  const getErrorIcon = useCallback(() => {
    switch (errorState.type) {
      case 'network':
        return isOnline ? Wifi : WifiOff
      case 'rate-limit':
        return Clock
      case 'timeout':
        return Clock
      case 'validation':
        return AlertCircle
      case 'api':
        return AlertCircle
      default:
        return AlertCircle
    }
  }, [errorState.type, isOnline])

  const getErrorMessage = useCallback(() => {
    if (!errorState.hasError) return ''
    
    switch (errorState.type) {
      case 'network':
        return isOnline 
          ? 'Network connection issue detected. Please check your internet connection.'
          : 'You are currently offline. Please check your internet connection.'
      case 'rate-limit':
        if (rateLimitReset) {
          const now = new Date()
          const timeUntilReset = Math.ceil((rateLimitReset.getTime() - now.getTime()) / 1000)
          return `Rate limit exceeded. Please wait ${timeUntilReset} seconds before trying again.`
        }
        return 'Rate limit exceeded. Please wait before trying again.'
      case 'timeout':
        return 'Operation timed out. Please try again.'
      case 'validation':
        return errorState.message
      case 'api':
        return `API Error: ${errorState.message}`
      default:
        return errorState.message
    }
  }, [errorState, isOnline, rateLimitReset])

  const canRetry = useCallback(() => {
    if (errorState.type === 'rate-limit' && isRateLimited) return false
    if (errorState.type === 'validation') return false
    if (errorState.retryCount >= finalConfig.retry.maxRetries) return false
    return true
  }, [errorState, isRateLimited, finalConfig.retry.maxRetries])

  return {
    // State
    errorState,
    isOnline,
    isRateLimited,
    rateLimitReset,
    
    // Actions
    setError,
    clearError,
    retry,
    executeWithTimeout,
    validateInput,
    handleRateLimit,
    
    // Utilities
    getErrorIcon,
    getErrorMessage,
    canRetry,
    
    // Constants
    maxRetries: finalConfig.retry.maxRetries,
    retryCount: errorState.retryCount
  }
}
