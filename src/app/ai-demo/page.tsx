'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAIStream } from '@/components/ui/use-ai-stream'
import { CostMonitor } from '@/components/ui/cost-monitor'
import { funnelPrompts, models } from '@/lib/openai'

export default function AIDemoPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedPromptType, setSelectedPromptType] = useState<keyof typeof funnelPrompts>('mainVSL')
  const [selectedModel, setSelectedModel] = useState<keyof typeof models>('GPT4O')
  const [maxTokens, setMaxTokens] = useState(2000)
  const [temperature, setTemperature] = useState(0.7)

  const {
    isStreaming,
    content,
    error,
    startStream,
    stopStream,
    reset
  } = useAIStream({
    onStart: () => console.log('AI stream started'),
    onChunk: (chunk) => console.log('Received chunk:', chunk),
    onComplete: (fullText) => console.log('Stream completed, total length:', fullText.length),
    onError: (error) => console.error('Stream error:', error)
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    await startStream(prompt, selectedPromptType, {
      model: selectedModel,
      maxTokens,
      temperature
    })
  }

  const getPromptTemplate = () => {
    const template = funnelPrompts[selectedPromptType]
    return template ? template.user : 'No template available'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Funnel Builder Demo</h1>
        <p className="text-muted-foreground">
          Test the AI integration with streaming responses and cost monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Generation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt Type</label>
                <Select value={selectedPromptType} onValueChange={(value) => setSelectedPromptType(value as keyof typeof funnelPrompts)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                                         {Object.entries(funnelPrompts).map(([key]) => (
                       <SelectItem key={key} value={key}>
                         {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Template: {getPromptTemplate()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as keyof typeof models)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(models).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    min="100"
                    max="4000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    max="2"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Prompt</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your specific prompt here..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isStreaming || !prompt.trim()}
                  className="flex-1"
                >
                  {isStreaming ? 'Generating...' : 'Generate Content'}
                </Button>
                {isStreaming && (
                  <Button variant="outline" onClick={stopStream}>
                    Stop
                  </Button>
                )}
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cost Monitor */}
          <CostMonitor
            inputText={prompt}
            outputText={content}
            model={selectedModel}
            budget={0.10} // $0.10 budget for demo
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Content</span>
                {isStreaming && (
                  <Badge variant="secondary" className="animate-pulse">
                    Streaming...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              {content ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Generated using: <Badge variant="outline">{selectedModel}</Badge></p>
                    <p>Prompt type: <Badge variant="outline">{selectedPromptType}</Badge></p>
                    <p>Content length: {content.length} characters</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {isStreaming ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p>Generating content...</p>
                    </div>
                  ) : (
                    <p>Generated content will appear here</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status: </span>
              <Badge variant={isStreaming ? "default" : "secondary"}>
                {isStreaming ? "Active" : "Idle"}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Model: </span>
              <Badge variant="outline">{selectedModel}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Max Tokens: </span>
              <span className="font-mono">{maxTokens}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Temperature: </span>
              <span className="font-mono">{temperature}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
