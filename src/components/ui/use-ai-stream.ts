import { useState, useCallback, useRef } from 'react'
import { funnelPrompts } from '@/lib/openai'

interface UseAIStreamOptions {
  onStart?: () => void
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: string) => void
}

interface UseAIStreamReturn {
  isStreaming: boolean
  content: string
  error: string | null
  startStream: (prompt: string, promptType: keyof typeof funnelPrompts, options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  }) => Promise<void>
  stopStream: () => void
  reset: () => void
}

export function useAIStream(options: UseAIStreamOptions = {}): UseAIStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const { onStart, onChunk, onComplete, onError } = options

  const startStream = useCallback(async (
    prompt: string,
    promptType: keyof typeof funnelPrompts,
    streamOptions: {
      model?: string
      maxTokens?: number
      temperature?: number
    } = {}
  ) => {
    try {
      // Reset state
      setError(null)
      setContent('')
      setIsStreaming(true)
      
      // Call onStart callback
      onStart?.()
      
      // Create abort controller for this request
      abortControllerRef.current = new AbortController()
      
      // Make API request
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          promptType,
          model: streamOptions.model || 'gpt-4o',
          maxTokens: streamOptions.maxTokens || 2000,
          temperature: streamOptions.temperature || 0.7,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Set up SSE reader
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          
          // Process complete lines
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.error) {
                  throw new Error(data.error)
                }
                
                if (data.done) {
                  // Stream completed
                  onComplete?.(content)
                  return
                }
                
                if (data.content) {
                  // Update content
                  setContent(prev => prev + data.content)
                  onChunk?.(data.content)
                }
              } catch (parseError) {
                // Skip malformed lines
                console.warn('Failed to parse SSE data:', line)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled
        return
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [onStart, onChunk, onComplete, onError, content])

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    setContent('')
    setError(null)
    setIsStreaming(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  return {
    isStreaming,
    content,
    error,
    startStream,
    stopStream,
    reset,
  }
}
