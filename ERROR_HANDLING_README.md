# 🛡️ Error Handling System

A comprehensive error handling, validation, and user feedback system built specifically for AI-powered applications. This system provides robust error handling for AI generation failures, network issues, rate limiting, and more.

## 🚀 What's Included

### Core Components

1. **ErrorBoundary** - React error boundary with fallback UI and recovery options
2. **useErrorHandler** - Custom hook for comprehensive error management
3. **EnhancedErrorDisplay** - Smart error display with contextual actions
4. **NetworkStatusIndicator** - Real-time network status monitoring
5. **InputWithValidation** - Enhanced input with built-in validation
6. **RetryMechanism** - Smart retry logic with exponential backoff

### Error Types Handled

- **Network Issues** - Offline detection, connection problems
- **Rate Limiting** - API rate limits with countdown timers
- **Timeouts** - Operation timeouts with progress indicators
- **Validation Errors** - Input validation with real-time feedback
- **API Failures** - Server errors with retry options
- **Unknown Errors** - Fallback handling for unexpected issues

## 📖 Quick Start

### 1. Basic Error Handling

```tsx
import { useErrorHandler } from '@/components/ui/use-error-handler'

function MyComponent() {
  const errorHandler = useErrorHandler({
    retry: { maxRetries: 3, retryDelay: 1000 },
    timeout: 10000
  })

  const handleOperation = async () => {
    try {
      await errorHandler.executeWithTimeout(async () => {
        // Your AI operation here
        return await aiService.generate()
      })
    } catch (error) {
      // Error is automatically handled by the hook
    }
  }

  return (
    <div>
      {/* Your component content */}
    </div>
  )
}
```

### 2. Error Display

```tsx
import { EnhancedErrorDisplay } from '@/components/ui/enhanced-error-display'

function MyComponent() {
  return (
    <EnhancedErrorDisplay
      errorState={errorHandler.errorState}
      isOnline={errorHandler.isOnline}
      isRateLimited={errorHandler.isRateLimited}
      rateLimitReset={errorHandler.rateLimitReset}
      onRetry={handleRetry}
      onClear={errorHandler.clearError}
      variant="alert" // or "card", "inline"
    />
  )
}
```

### 3. Input Validation

```tsx
import { InputWithValidation } from '@/components/ui/input-with-validation'

function MyForm() {
  const validationRules = [
    {
      test: (value: string) => value.length > 0,
      message: 'This field is required'
    },
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email'
    }
  ]

  return (
    <InputWithValidation
      label="Email Address"
      validationRules={validationRules}
      showValidation={true}
      description="We'll use this for notifications"
    />
  )
}
```

### 4. Retry Mechanism

```tsx
import { RetryMechanism } from '@/components/ui/retry-mechanism'

function MyOperation() {
  return (
    <RetryMechanism
      onRetry={async () => {
        // Your retry logic here
        return await aiService.retry()
      }}
      config={{ maxRetries: 3, initialDelay: 1000 }}
      variant="card"
      showProgress={true}
    >
      <div>Your content here</div>
    </RetryMechanism>
  )
}
```

### 5. Network Status

```tsx
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator'

function MyHeader() {
  return (
    <header>
      <NetworkStatusIndicator variant="badge" />
      {/* Your header content */}
    </header>
  )
}
```

## 🔧 Configuration Options

### Error Handler Configuration

```tsx
const errorHandler = useErrorHandler({
  retry: {
    maxRetries: 3,           // Maximum retry attempts
    retryDelay: 1000,        // Initial delay in ms
    backoffMultiplier: 2,    // Exponential backoff multiplier
    maxDelay: 10000          // Maximum delay cap
  },
  timeout: 30000,            // Operation timeout in ms
  showUserFeedback: true,    // Show user-facing error messages
  logErrors: true            // Log errors to console
})
```

### Retry Mechanism Configuration

```tsx
<RetryMechanism
  config={{
    maxRetries: 5,
    initialDelay: 500,
    backoffMultiplier: 1.5,
    maxDelay: 15000,
    jitter: true
  }}
  variant="card"           // "inline", "card", "minimal"
  showProgress={true}      // Show countdown progress
  autoRetry={false}        // Auto-retry on failure
>
  {/* Your content */}
</RetryMechanism>
```

## 🎯 AI Integration Examples

### 1. AI Generation with Error Handling

```tsx
const generateContent = async () => {
  try {
    const result = await errorHandler.executeWithTimeout(async () => {
      // AI API call with timeout protection
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: userInput })
      })
      
      if (!response.ok) {
        if (response.status === 429) {
          // Handle rate limiting
          const resetTime = response.headers.get('X-RateLimit-Reset')
          errorHandler.handleRateLimit(resetTime)
          throw new Error('Rate limit exceeded')
        }
        throw new Error('AI generation failed')
      }
      
      return await response.json()
    }, 60000) // 60 second timeout for AI operations
    
    // Handle success
    setGeneratedContent(result.content)
    
  } catch (error) {
    // Error is automatically handled by the hook
    // User sees appropriate error message with retry options
  }
}
```

### 2. Smart Retry for AI Operations

```tsx
<RetryMechanism
  onRetry={async () => {
    // Retry AI generation with exponential backoff
    const result = await aiService.generate(userInput)
    if (!result.success) {
      throw new Error('Generation failed')
    }
    return result
  }}
  config={{ maxRetries: 3, initialDelay: 2000 }}
  onSuccess={(result) => {
    setContent(result.content)
    showSuccessMessage('Content generated successfully!')
  }}
  onFailure={(error, attempt) => {
    console.log(`Attempt ${attempt} failed:`, error.message)
  }}
>
  <div className="p-4 bg-gray-50 rounded-md">
    <p>AI content generation with smart retry logic</p>
  </div>
</RetryMechanism>
```

### 3. Input Validation for AI Prompts

```tsx
const promptValidationRules = [
  {
    test: (value: string) => value.length >= 10,
    message: 'Prompt must be at least 10 characters long'
  },
  {
    test: (value: string) => value.length <= 1000,
    message: 'Prompt must be less than 1000 characters'
  },
  {
    test: (value: string) => !value.includes('inappropriate'),
    message: 'Prompt contains inappropriate content'
  }
]

<InputWithValidation
  label="AI Prompt"
  placeholder="Describe what you want to generate..."
  validationRules={promptValidationRules}
  showValidation={true}
  onValidationChange={(isValid, errors) => {
    setCanGenerate(isValid)
    setValidationErrors(errors)
  }}
/>
```

## 🌐 Network Status Monitoring

### Real-time Connection Detection

```tsx
function NetworkAwareComponent() {
  const [isOnline, setIsOnline] = useState(true)
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p>You are currently offline. Some features may be unavailable.</p>
      </div>
    )
  }

  return <YourComponent />
}
```

## 🎨 Customization

### Custom Error Messages

```tsx
const customErrorMessages = {
  'ai-generation-failed': 'AI service is temporarily unavailable. Please try again.',
  'rate-limit-exceeded': 'Too many requests. Please wait a moment.',
  'network-error': 'Connection lost. Please check your internet.',
  'validation-error': 'Please check your input and try again.'
}

// Use in EnhancedErrorDisplay
<EnhancedErrorDisplay
  errorState={errorState}
  customMessages={customErrorMessages}
  // ... other props
/>
```

### Custom Validation Rules

```tsx
const customValidationRules = [
  {
    test: (value: string) => value.length > 0,
    message: 'This field is required',
    severity: 'error'
  },
  {
    test: (value: string) => value.length >= 5,
    message: 'Consider adding more detail',
    severity: 'warning'
  }
]
```

## 🧪 Testing

### Demo Page

Visit `/error-handling-demo` to see all components in action with simulated error scenarios.

### Testing Error Scenarios

```tsx
// Simulate network errors
const simulateNetworkError = () => {
  errorHandler.setError(new Error('Network connection failed'), 'network')
}

// Simulate rate limiting
const simulateRateLimit = () => {
  const resetTime = new Date(Date.now() + 10000)
  errorHandler.handleRateLimit(resetTime)
}

// Simulate timeouts
const simulateTimeout = () => {
  errorHandler.executeWithTimeout(
    () => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    ),
    1000
  )
}
```

## 🚀 Production Deployment

### Error Logging

```tsx
const errorHandler = useErrorHandler({
  logErrors: true,
  onError: (error, type) => {
    // Send to your error tracking service
    analytics.track('error', { type, message: error.message })
    sentry.captureException(error)
  }
})
```

### Performance Monitoring

```tsx
const errorHandler = useErrorHandler({
  onRetry: (attempt, delay) => {
    // Track retry performance
    analytics.track('retry_attempt', { attempt, delay })
  },
  onTimeout: (duration) => {
    // Track timeout performance
    analytics.track('operation_timeout', { duration })
  }
})
```

## 🔗 Integration with Existing Code

### Replace Basic Error Handling

**Before:**
```tsx
try {
  const result = await apiCall()
} catch (error) {
  setError(error.message)
}
```

**After:**
```tsx
try {
  const result = await errorHandler.executeWithTimeout(apiCall)
} catch (error) {
  // Error is automatically handled with retry options
}
```

### Add to Existing Forms

```tsx
// Add validation to existing inputs
<InputWithValidation
  {...existingInputProps}
  validationRules={[
    { test: (value) => value.length > 0, message: 'Required' }
  ]}
/>
```

## 📚 API Reference

### useErrorHandler Hook

```tsx
const {
  errorState,           // Current error state
  isOnline,            // Network status
  isRateLimited,       // Rate limit status
  rateLimitReset,      // Rate limit reset time
  setError,            // Set error manually
  clearError,          // Clear current error
  retry,               // Retry operation
  executeWithTimeout,  // Execute with timeout
  validateInput,       // Validate input data
  handleRateLimit,     // Handle rate limiting
  canRetry,            // Check if retry is possible
  maxRetries,          // Maximum retry attempts
  retryCount           // Current retry count
} = useErrorHandler(config)
```

### EnhancedErrorDisplay Props

```tsx
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
```

## 🤝 Contributing

This error handling system is designed to be extensible. Feel free to:

1. Add new error types
2. Create custom error display variants
3. Extend validation rules
4. Add new retry strategies
5. Improve network detection

## 📄 License

This error handling system is part of the AI Funnel Builder project and follows the same licensing terms.

---

**Ready for AI Integration!** 🚀

This system provides all the error handling infrastructure you need for AI-powered applications. It handles network issues, rate limiting, timeouts, and validation errors with smart retry logic and user-friendly feedback.
