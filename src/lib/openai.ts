import OpenAI from 'openai'

// Import server environment for API key
let serverEnv: { OPENAI_API_KEY: string } | null = null

// Lazy load server environment to avoid client-side issues
const getServerEnv = () => {
  if (!serverEnv) {
    try {
      // Dynamic import to avoid client-side issues
      serverEnv = { OPENAI_API_KEY: process.env.OPENAI_API_KEY || '' }
    } catch {
      // Fallback for development
      serverEnv = { OPENAI_API_KEY: process.env.OPENAI_API_KEY || '' }
    }
  }
  return serverEnv
}

export const openai = new OpenAI({
  apiKey: getServerEnv().OPENAI_API_KEY,
})

export const models = {
  GPT4O: 'gpt-4o',
  GPT4O_MINI: 'gpt-4o-mini',
} as const

// Cost tracking (per 1K tokens)
export const tokenCosts = {
  [models.GPT4O]: { input: 0.005, output: 0.015 },
  [models.GPT4O_MINI]: { input: 0.00015, output: 0.0006 },
} as const

// Token counting utility
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
}

export function calculateCost(inputTokens: number, outputTokens: number, model: keyof typeof models): number {
  const costs = tokenCosts[models[model]]
  return (inputTokens / 1000 * costs.input) + (outputTokens / 1000 * costs.output)
}

// Rate limiting configuration
export const rateLimits = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  maxTokensPerRequest: 4000,
} as const

// Error handling and retry logic
export class OpenAIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'OpenAIError'
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError!
}

// Streaming response handler
export async function* streamResponse(
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
): AsyncGenerator<string> {
  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  } catch (error) {
    throw new OpenAIError(`Streaming error: ${error}`, undefined, true)
  }
}

// Optimized prompts for funnel components
export const funnelPrompts = {
  mainVSL: {
    system: `You are an expert copywriter specializing in high-converting video sales letters (VSLs). 
    Create compelling, emotionally-driven copy that follows proven conversion principles. 
    Focus on problem identification, solution presentation, and strong calls to action.`,
    user: `Create a video sales letter script for {product} targeting {audience}. 
    Include: hook, problem identification, solution presentation, social proof, offer, and call to action.`
  },
  
  offerGeneration: {
    system: `You are a pricing and offer optimization expert. 
    Create irresistible offers with multiple pricing tiers, bonuses, and urgency elements.`,
    user: `Design a compelling offer structure for {product} with pricing tiers, bonuses, and urgency elements.`
  },
  
  orderBump: {
    system: `You are an expert in order bump optimization. 
    Create low-risk, high-value add-ons that increase average order value.`,
    user: `Design an order bump offer for {mainProduct} that provides immediate value and increases conversion.`
  },
  
  upsell: {
    system: `You are an upsell strategy expert. 
    Create compelling upsell offers that provide genuine value and increase customer lifetime value.`,
    user: `Design an upsell strategy for {mainProduct} with multiple upsell levels and compelling value propositions.`
  },
  
  emailStrategy: {
    system: `You are an email marketing expert specializing in high-converting sequences. 
    Create engaging, personalized email content that nurtures leads and drives sales.`,
    user: `Create an email sequence for {product} targeting {audience} with {goal} as the primary objective.`
  },
  
  thankYouPage: {
    system: `You are a conversion optimization expert. 
    Create thank you pages that reinforce the purchase decision and encourage additional engagement.`,
    user: `Design a thank you page for {product} that reinforces the purchase and encourages next steps.`
  }
} as const

// Usage tracking interface
export interface UsageMetrics {
  userId: string
  model: keyof typeof models
  inputTokens: number
  outputTokens: number
  cost: number
  timestamp: Date
  requestType: keyof typeof funnelPrompts
}

// Main completion function with streaming support
export async function createStreamingCompletion(
  prompt: string,
  systemPrompt: string,
  model: keyof typeof models = 'GPT4O',
  maxTokens: number = 2000,
  temperature: number = 0.7
) {
  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    })
    
    return stream
  } catch (error) {
    if (error instanceof OpenAI.OpenAIError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any).status
      throw new OpenAIError(
        `OpenAI API error: ${error.message}`,
        status,
        status === 429 || status >= 500
      )
    }
    throw new OpenAIError(`Unexpected error: ${error}`, undefined, true)
  }
}

// Non-streaming completion for simpler use cases
export async function createCompletion(
  prompt: string,
  systemPrompt: string,
  model: keyof typeof models = 'GPT4O',
  maxTokens: number = 2000,
  temperature: number = 0.7
) {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature,
    })
    
    return completion
  } catch (error) {
    if (error instanceof OpenAI.OpenAIError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any).status
      throw new OpenAIError(
        `OpenAI API error: ${error.message}`,
        status,
        status === 429 || status >= 500
      )
    }
    throw new OpenAIError(`Unexpected error: ${error}`, undefined, true)
  }
}
