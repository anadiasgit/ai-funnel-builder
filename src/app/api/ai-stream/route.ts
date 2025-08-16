import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'

// Only import serverEnv on server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge' // Use edge runtime for streaming

export async function POST(request: NextRequest) {
  try {
    const { prompt, promptType, model = 'gpt-4o-mini', maxTokens = 2000, temperature = 0.7 } = await request.json()

    // Your prompt templates (move from client to server)
    const funnelPrompts = {
      mainVSL: {
        system: "You are an expert VSL (Video Sales Letter) copywriter.",
        user: "Create a compelling VSL script for this offer:"
      },
      customerAvatar: {
        system: "You are an expert marketing strategist.",
        user: "Create a detailed customer avatar:"
      },
      salesPage: {
        system: "You are an expert sales copywriter.",
        user: "Write compelling sales page copy:"
      },
      emailSequence: {
        system: "You are an expert email copywriter.",
        user: "Create an engaging email sequence:"
      },
      orderBump: {
        system: "You are an expert in conversion optimization.",
        user: "Design an irresistible order bump offer:"
      },
      upsell: {
        system: "You are an expert in upsell strategies.",
        user: "Create a compelling upsell offer:"
      }
    }

    const selectedPrompt = funnelPrompts[promptType as keyof typeof funnelPrompts] || funnelPrompts.mainVSL

    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: selectedPrompt.system },
        { role: 'user', content: `${selectedPrompt.user}\n\n${prompt}` }
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const data = JSON.stringify({ content, done: false })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          
          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '', done: true })}\n\n`))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
