import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Progress } from './progress'
import { estimateTokens, calculateCost, models } from '@/lib/openai'

interface CostMonitorProps {
  inputText: string
  outputText: string
  model?: keyof typeof models
  budget?: number
  className?: string
}

export function CostMonitor({ 
  inputText, 
  outputText, 
  model = models.GPT4O, 
  budget,
  className = '' 
}: CostMonitorProps) {
  const [inputTokens, setInputTokens] = useState(0)
  const [outputTokens, setOutputTokens] = useState(0)
  const [cost, setCost] = useState(0)
  const [budgetUsage, setBudgetUsage] = useState(0)

  useEffect(() => {
    const input = estimateTokens(inputText)
    const output = estimateTokens(outputText)
    const calculatedCost = calculateCost(input, output, model)
    
    setInputTokens(input)
    setOutputTokens(output)
    setCost(calculatedCost)
    
    if (budget) {
      setBudgetUsage((calculatedCost / budget) * 100)
    }
  }, [inputText, outputText, model, budget])

  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${(cost * 1000).toFixed(2)}m` // Show in millicents
    }
    return `$${cost.toFixed(4)}`
  }

  // Budget color utility (unused but kept for future use)
  // const getBudgetColor = (usage: number) => {
  //   if (usage < 50) return 'bg-green-500'
  //   if (usage < 80) return 'bg-yellow-500'
  //   return 'bg-red-500'
  // }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Cost Monitor</span>
          <Badge variant="outline" className="font-mono">
            {formatCost(cost)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Input Tokens</span>
              <span className="font-mono">{inputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Output Tokens</span>
              <span className="font-mono">{outputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Tokens</span>
              <span className="font-mono">{(inputTokens + outputTokens).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Model: </span>
              <Badge variant="secondary" className="ml-1">
                {model}
              </Badge>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Input Cost: </span>
              <span className="font-mono">{formatCost((inputTokens / 1000) * 0.005)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Output Cost: </span>
              <span className="font-mono">{formatCost((outputTokens / 1000) * 0.015)}</span>
            </div>
          </div>
        </div>

        {budget && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget Usage</span>
              <span className="font-mono">{budgetUsage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(budgetUsage, 100)} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${0}</span>
              <span>${budget}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            * Costs are estimates based on OpenAI&apos;s pricing for {model}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
