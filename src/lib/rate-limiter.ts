import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitStore {
  [userId: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {}

// Default rate limit configurations
export const rateLimits = {
  perMinute: { windowMs: 60 * 1000, maxRequests: 60 },
  perHour: { windowMs: 60 * 60 * 1000, maxRequests: 1000 },
  perDay: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 10000 }
} as const

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number,
    public remainingRequests: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export function checkRateLimit(
  userId: string,
  config: RateLimitConfig = rateLimits.perMinute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const userLimit = rateLimitStore[userId]
  
  // Initialize or reset if window has passed
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore[userId] = {
      count: 1,
      resetTime: now + config.windowMs
    }
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs }
  }
  
  // Check if limit exceeded
  if (userLimit.count >= config.maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: userLimit.resetTime 
    }
  }
  
  // Increment count
  userLimit.count++
  
  return { 
    allowed: true, 
    remaining: config.maxRequests - userLimit.count, 
    resetTime: userLimit.resetTime 
  }
}

export function getRateLimitHeaders(
  userId: string,
  config: RateLimitConfig = rateLimits.perMinute
): Record<string, string> {
  const { remaining, resetTime } = checkRateLimit(userId, config)
  
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    'X-RateLimit-Reset-Timestamp': resetTime.toString()
  }
}

export function validateRateLimit(
  userId: string,
  config: RateLimitConfig = rateLimits.perMinute
): void {
  const { allowed, remaining, resetTime } = checkRateLimit(userId, config)
  
  if (!allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again after ${new Date(resetTime).toISOString()}`,
      resetTime,
      remaining
    )
  }
}

// Clean up expired rate limit entries (run periodically)
export function cleanupExpiredLimits(): void {
  const now = Date.now()
  
  Object.keys(rateLimitStore).forEach(userId => {
    if (now > rateLimitStore[userId].resetTime) {
      delete rateLimitStore[userId]
    }
  })
}

// Set up periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredLimits, 5 * 60 * 1000)
}
