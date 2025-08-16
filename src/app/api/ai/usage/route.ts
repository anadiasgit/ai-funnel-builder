import { NextRequest, NextResponse } from 'next/server'
import { UsageMetrics, estimateTokens, calculateCost } from '@/lib/openai'

// In a real app, you'd store this in a database
// For now, we'll use an in-memory store (not recommended for production)
const usageStore: UsageMetrics[] = []

export async function POST(request: NextRequest) {
  try {
    const { userId, model, inputText, outputText, requestType } = await request.json()
    
    // Validate request
    if (!userId || !model || !inputText || !outputText || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Calculate tokens and cost
    const inputTokens = estimateTokens(inputText)
    const outputTokens = estimateTokens(outputText)
    const cost = calculateCost(inputTokens, outputTokens, model)
    
    // Create usage record
    const usageRecord: UsageMetrics = {
      userId,
      model,
      inputTokens,
      outputTokens,
      cost,
      timestamp: new Date(),
      requestType
    }
    
    // Store usage (in production, save to database)
    usageStore.push(usageRecord)
    
    return NextResponse.json({
      success: true,
      usage: usageRecord
    })
    
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let filteredUsage = usageStore
    
    // Filter by user if specified
    if (userId) {
      filteredUsage = filteredUsage.filter(usage => usage.userId === userId)
    }
    
    // Filter by date range if specified
    if (startDate || endDate) {
      filteredUsage = filteredUsage.filter(usage => {
        const usageDate = usage.timestamp
        if (startDate && usageDate < new Date(startDate)) return false
        if (endDate && usageDate > new Date(endDate)) return false
        return true
      })
    }
    
    // Calculate totals
    const totalInputTokens = filteredUsage.reduce((sum, usage) => sum + usage.inputTokens, 0)
    const totalOutputTokens = filteredUsage.reduce((sum, usage) => sum + usage.outputTokens, 0)
    const totalCost = filteredUsage.reduce((sum, usage) => sum + usage.cost, 0)
    
    return NextResponse.json({
      usage: filteredUsage,
      totals: {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        cost: totalCost,
        requestCount: filteredUsage.length
      }
    })
    
  } catch (error) {
    console.error('Usage retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
