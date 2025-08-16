# OpenAI API Setup Guide

This guide will help you set up the OpenAI integration for the AI Funnel Builder project.

## Prerequisites

1. **OpenAI Account**: Sign up at [OpenAI's website](https://platform.openai.com/)
2. **API Key**: Generate an API key from your OpenAI dashboard
3. **Node.js**: Version 18+ required

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

The required dependencies have already been installed:

```bash
npm install openai zod
```

## Features Implemented

### 1. **Core OpenAI Integration** (`src/lib/openai.ts`)
- OpenAI client configuration
- Model definitions (GPT-4o, GPT-4o-mini)
- Cost tracking and token estimation
- Error handling and retry logic

### 2. **Streaming API** (`src/app/api/ai/stream/route.ts`)
- Server-Sent Events (SSE) for real-time responses
- Optimized prompts for each funnel component
- Error handling and validation

### 3. **Usage Tracking** (`src/app/api/ai/usage/route.ts`)
- Token usage monitoring
- Cost calculation
- Request history tracking

### 4. **Rate Limiting** (`src/lib/rate-limiter.ts`)
- Per-user rate limiting
- Configurable limits (per minute, hour, day)
- Automatic cleanup of expired limits

### 5. **React Hooks** (`src/components/ui/use-ai-stream.ts`)
- Easy-to-use streaming hook
- Real-time content updates
- Error handling and abort functionality

### 6. **Cost Monitoring** (`src/components/ui/cost-monitor.tsx`)
- Real-time cost display
- Token counting
- Budget tracking

### 7. **Demo Page** (`src/app/ai-demo/page.tsx`)
- Interactive testing interface
- All funnel component prompts
- Real-time streaming demo

## Funnel Component Prompts

The system includes optimized prompts for:

- **Main VSL**: Video sales letter scripts
- **Offer Generation**: Pricing and offer structures
- **Order Bumps**: Add-on offers
- **Upsells**: Multi-level upsell strategies
- **Email Strategy**: Email sequences
- **Thank You Pages**: Post-purchase engagement

## Usage Examples

### Basic Streaming Usage

```typescript
import { useAIStream } from '@/components/ui/use-ai-stream'

function MyComponent() {
  const { isStreaming, content, startStream } = useAIStream()
  
  const handleGenerate = async () => {
    await startStream(
      "Create a VSL for weight loss supplements",
      "mainVSL",
      { model: "gpt-4o", maxTokens: 2000 }
    )
  }
  
  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      {isStreaming && <p>Generating...</p>}
      <div>{content}</div>
    </div>
  )
}
```

### Cost Monitoring

```typescript
import { CostMonitor } from '@/components/ui/cost-monitor'

<CostMonitor
  inputText={userPrompt}
  outputText={generatedContent}
  model="gpt-4o"
  budget={0.10}
/>
```

## API Endpoints

### Streaming Generation
- **POST** `/api/ai/stream`
- Body: `{ prompt, promptType, model, maxTokens, temperature }`
- Response: Server-Sent Events stream

### Usage Tracking
- **POST** `/api/ai/usage` - Record usage
- **GET** `/api/ai/usage` - Retrieve usage statistics

## Rate Limits

Default rate limits (configurable):
- **Per Minute**: 60 requests
- **Per Hour**: 1,000 requests
- **Per Day**: 10,000 requests

## Cost Structure

Current OpenAI pricing (GPT-4o):
- **Input**: $0.005 per 1K tokens
- **Output**: $0.015 per 1K tokens

## Testing

1. Set up your environment variables
2. Run the development server: `npm run dev`
3. Navigate to `/ai-demo` to test the integration
4. Try different prompt types and models

## Production Considerations

1. **Database Storage**: Replace in-memory stores with proper database tables
2. **Redis**: Use Redis for rate limiting instead of in-memory storage
3. **Monitoring**: Add proper logging and monitoring
4. **Security**: Implement proper user authentication and authorization
5. **Error Handling**: Add comprehensive error tracking (e.g., Sentry)

## Troubleshooting

### Common Issues

1. **"Invalid OpenAI API key format"**
   - Ensure your API key starts with `sk-`
   - Check that the key is properly set in `.env.local`

2. **"Rate limit exceeded"**
   - Wait for the rate limit window to reset
   - Check your usage in the OpenAI dashboard

3. **Streaming not working**
   - Ensure your browser supports Server-Sent Events
   - Check the browser console for errors

4. **High costs**
   - Monitor token usage with the CostMonitor component
   - Consider using GPT-4o-mini for less critical content

## Support

For issues related to:
- **OpenAI API**: Check [OpenAI's documentation](https://platform.openai.com/docs)
- **Project Integration**: Check the project's GitHub issues
- **Streaming**: Verify SSE support in your environment

## Next Steps

1. Test the integration with the demo page
2. Integrate into your existing funnel forms
3. Set up proper database storage for usage tracking
4. Implement user authentication and authorization
5. Add monitoring and alerting for costs and usage
