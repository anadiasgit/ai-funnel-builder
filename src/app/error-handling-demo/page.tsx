'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { InputWithValidation } from '@/components/ui/input-with-validation'
import { EnhancedErrorDisplay } from '@/components/ui/enhanced-error-display'
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator'
import { RetryMechanism } from '@/components/ui/retry-mechanism'
import { useErrorHandler } from '@/components/ui/use-error-handler'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { 
  AlertCircle, 
  Wifi, 
  Clock, 
  RefreshCw, 
  Play, 
  Stop,
  Zap,
  Bug,
  Shield,
  Activity
} from 'lucide-react'

// Simulated API functions for demo purposes
const simulateAPIError = async (type: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  switch (type) {
    case 'network':
      throw new Error('Network connection failed')
    case 'rate-limit':
      throw new Error('Rate limit exceeded')
    case 'timeout':
      throw new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      )
    case 'validation':
      throw new Error('Invalid input data')
    case 'api':
      throw new Error('API server error')
    default:
      throw new Error('Unknown error occurred')
  }
}

const simulateSuccess = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'Operation completed successfully!'
}

export default function ErrorHandlingDemoPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoSuccess, setDemoSuccess] = useState<string | null>(null)

  // Error handler hook
  const errorHandler = useErrorHandler({
    retry: { maxRetries: 3, retryDelay: 1000, backoffMultiplier: 2, maxDelay: 5000 },
    timeout: 10000,
    showUserFeedback: true,
    logErrors: true
  })

  // Demo functions
  const triggerError = async (type: string) => {
    setDemoError(null)
    setDemoSuccess(null)
    
    try {
      await errorHandler.executeWithTimeout(
        () => simulateAPIError(type),
        5000
      )
    } catch (error) {
      if (error instanceof Error) {
        errorHandler.setError(error, type as any)
      }
    }
  }

  const triggerSuccess = async () => {
    setDemoError(null)
    setDemoSuccess(null)
    
    try {
      const result = await errorHandler.executeWithTimeout(
        () => simulateSuccess(),
        5000
      )
      setDemoSuccess(result)
      errorHandler.clearError()
    } catch (error) {
      if (error instanceof Error) {
        errorHandler.setError(error, 'timeout')
      }
    }
  }

  const simulateRateLimit = () => {
    const resetTime = new Date(Date.now() + 10000) // 10 seconds from now
    errorHandler.handleRateLimit(resetTime)
  }

  // Validation rules for demo
  const emailValidationRules = [
    {
      test: (value: string) => value.length > 0,
      message: 'Email is required'
    },
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    }
  ]

  const passwordValidationRules = [
    {
      test: (value: string) => value.length >= 8,
      message: 'Password must be at least 8 characters'
    },
    {
      test: (value: string) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter'
    },
    {
      test: (value: string) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter'
    },
    {
      test: (value: string) => /[0-9]/.test(value),
      message: 'Password must contain at least one number'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ Error Handling System Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive error handling, validation, and user feedback systems ready for AI integration
          </p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            <NetworkStatusIndicator variant="full" showDetails />
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Input Validation</TabsTrigger>
            <TabsTrigger value="errors">Error Display</TabsTrigger>
            <TabsTrigger value="retry">Retry Logic</TabsTrigger>
            <TabsTrigger value="network">Network Status</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                    <Shield className="w-5 h-5" />
                    Error Boundaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 text-sm">
                    Catch and handle React component errors gracefully with fallback UI and recovery options.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <Activity className="w-5 h-5" />
                    Network Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm">
                    Real-time network status monitoring with connection type detection and offline handling.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
                    <RefreshCw className="w-5 h-5" />
                    Smart Retry Logic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 text-sm">
                    Exponential backoff with jitter, progress tracking, and configurable retry strategies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                    <Bug className="w-5 h-5" />
                    Error Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 text-sm">
                    Handle network, rate-limit, timeout, validation, and API errors with appropriate UI feedback.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    User Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm">
                    Clear error messages, actionable buttons, and contextual help for better user experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-200 bg-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-indigo-800">
                    <Zap className="w-5 h-5" />
                    AI Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-700 text-sm">
                    Built specifically for AI operations with timeout handling, rate limiting, and retry logic.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-green-600" />
                  Quick Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Test the error handling system with simulated scenarios:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => triggerError('network')}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Network Error
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => triggerError('rate-limit')}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    Rate Limit
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => triggerError('timeout')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Timeout
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={triggerSuccess}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Success
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={simulateRateLimit}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    Simulate Rate Limit
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={errorHandler.clearError}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    Clear Errors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Input Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Validation Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWithValidation
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    validationRules={emailValidationRules}
                    description="We'll use this for account notifications"
                    showValidation={true}
                  />
                  
                  <InputWithValidation
                    label="Password"
                    placeholder="Create a strong password"
                    type="password"
                    validationRules={passwordValidationRules}
                    showPasswordToggle={true}
                    description="Must meet security requirements"
                    showValidation={true}
                  />
                </div>

                <Separator />
                
                <div className="text-sm text-gray-600">
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Real-time validation with visual feedback</li>
                    <li>Custom validation rules with error/warning levels</li>
                    <li>Password visibility toggle</li>
                    <li>Validation summary with badges</li>
                    <li>External error/success state support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Display Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Display Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Alert Variant (Default)</h4>
                  <EnhancedErrorDisplay
                    errorState={errorHandler.errorState}
                    isOnline={errorHandler.isOnline}
                    isRateLimited={errorHandler.isRateLimited}
                    rateLimitReset={errorHandler.rateLimitReset}
                    onRetry={() => triggerSuccess()}
                    onClear={errorHandler.clearError}
                    variant="alert"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Card Variant</h4>
                  <EnhancedErrorDisplay
                    errorState={errorHandler.errorState}
                    isOnline={errorHandler.isOnline}
                    isRateLimited={errorHandler.isRateLimited}
                    rateLimitReset={errorHandler.rateLimitReset}
                    onRetry={() => triggerSuccess()}
                    onClear={errorHandler.clearError}
                    variant="card"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Inline Variant</h4>
                  <EnhancedErrorDisplay
                    errorState={errorHandler.errorState}
                    isOnline={errorHandler.isOnline}
                    isRateLimited={errorHandler.isRateLimited}
                    rateLimitReset={errorHandler.rateLimitReset}
                    onRetry={() => triggerSuccess()}
                    onClear={errorHandler.clearError}
                    variant="inline"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retry Logic Tab */}
          <TabsContent value="retry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retry Mechanism Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Card Variant with Progress</h4>
                  <RetryMechanism
                    onRetry={async () => {
                      await new Promise(resolve => setTimeout(resolve, 2000))
                      if (Math.random() > 0.5) {
                        throw new Error('Simulated failure')
                      }
                      return 'Success!'
                    }}
                    config={{ maxRetries: 3, initialDelay: 1000 }}
                    variant="card"
                    showProgress={true}
                    onSuccess={(result) => console.log('Success:', result)}
                    onFailure={(error, attempt) => console.log('Failure:', error, attempt)}
                  >
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        This component demonstrates the retry mechanism with exponential backoff, 
                        progress tracking, and smart retry logic.
                      </p>
                    </div>
                  </RetryMechanism>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Inline Variant</h4>
                  <RetryMechanism
                    onRetry={async () => {
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      throw new Error('Another simulated failure')
                    }}
                    variant="inline"
                  >
                    <span className="text-sm text-gray-600">Inline retry mechanism</span>
                  </RetryMechanism>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Minimal Variant</h4>
                  <RetryMechanism
                    onRetry={async () => {
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      throw new Error('Minimal retry demo')
                    }}
                    variant="minimal"
                  >
                    <span className="text-sm text-gray-600">Minimal retry display</span>
                  </RetryMechanism>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Status Tab */}
          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Status Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Badge Variant</h4>
                    <NetworkStatusIndicator variant="badge" />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Icon Variant</h4>
                    <NetworkStatusIndicator variant="icon" />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Full Variant</h4>
                    <NetworkStatusIndicator variant="full" showDetails />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">Network Features:</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Real-time online/offline detection</li>
                    <li>Connection type detection (2G, 3G, 4G, WiFi)</li>
                    <li>Slow connection warnings</li>
                    <li>Last seen timestamp</li>
                    <li>Automatic status updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Handler Status */}
        {errorHandler.errorState.hasError && (
          <Card className="border-2 border-red-200 bg-red-50 mt-6">
            <CardHeader>
              <CardTitle className="text-red-800">Error Handler Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Error Type:</span>
                  <div className="text-red-600">{errorHandler.errorState.type}</div>
                </div>
                <div>
                  <span className="font-medium">Retry Count:</span>
                  <div className="text-red-600">{errorHandler.retryCount}/{errorHandler.maxRetries}</div>
                </div>
                <div>
                  <span className="font-medium">Network Status:</span>
                  <div className={errorHandler.isOnline ? 'text-green-600' : 'text-red-600'}>
                    {errorHandler.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Rate Limited:</span>
                  <div className={errorHandler.isRateLimited ? 'text-yellow-600' : 'text-green-600'}>
                    {errorHandler.isRateLimited ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {demoSuccess && (
          <Card className="border-2 border-green-200 bg-green-50 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{demoSuccess}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
