import { useState, useCallback } from 'react'

interface UseAIStreamOptions {
  onStart?: () => void
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: string) => void
}

interface StreamOptions {
  model?: string
  maxTokens?: number
  temperature?: number
}

export function useAIStream(options: UseAIStreamOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const startStream = useCallback(async (
    prompt: string, 
    promptType: string, 
    streamOptions: StreamOptions = {}
  ) => {
    setIsStreaming(true)
    setError(null)
    setContent('')
    options.onStart?.()

    try {
      const response = await fetch('/api/ai-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          promptType,
          ...streamOptions,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.done) {
                setIsStreaming(false)
                options.onComplete?.(fullContent)
                return fullContent
              }
              if (data.content) {
                fullContent += data.content
                setContent(fullContent)
                options.onChunk?.(data.content)
              }
            } catch (e) {
              // Ignore JSON parsing errors
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      options.onError?.(errorMessage)
    } finally {
      setIsStreaming(false)
    }
  }, [options])

  const stopStream = useCallback(() => {
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    setContent('')
    setError(null)
    setIsStreaming(false)
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
