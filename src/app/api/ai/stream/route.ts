import { NextRequest, NextResponse } from 'next/server'
import { createStreamingCompletion, streamResponse, funnelPrompts, OpenAIError } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { prompt, promptType, model, maxTokens, temperature } = await request.json()
    
    // Validate request
    if (!prompt || !promptType) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and promptType' },
        { status: 400 }
      )
    }
    
    // Get the appropriate prompt template
    const promptTemplate = funnelPrompts[promptType as keyof typeof funnelPrompts]
    if (!promptTemplate) {
      return NextResponse.json(
        { error: 'Invalid prompt type' },
        { status: 400 }
      )
    }
    
    // Create streaming completion
    const stream = await createStreamingCompletion(
      prompt,
      promptTemplate.system,
      model,
      maxTokens,
      temperature
    )
    
    // Set up SSE headers
    const encoder = new TextEncoder()
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResponse(stream)) {
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
            controller.enqueue(encoder.encode(data))
          }
          
          // Send completion signal
          const endData = `data: ${JSON.stringify({ done: true })}\n\n`
          controller.enqueue(encoder.encode(endData))
          controller.close()
        } catch (error) {
          const errorData = `data: ${JSON.stringify({ 
            error: error instanceof OpenAIError ? error.message : 'Unknown error' 
          })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      }
    })
    
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('Streaming API error:', error)
    
    if (error instanceof OpenAIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
