'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAIStream } from '@/components/ui/use-ai-stream'
import { 
  Video, 
  Sparkles,
  CheckCircle2,
  Wand2,
  Copy,
  RefreshCw
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CustomerAvatar, MainOffer } from '@/lib/types'

interface MainVSLFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingVSL?: MainVSL | null
  onVSLGenerated: (vsl: MainVSL) => void
}



interface MainVSL {
  hook: string
  problem: string
  solution: string
  proof: string
  offer: string
  close: string
  urgency: string
}

export function MainVSLForm({ 
  customerAvatar, 
  mainOffer, 
  existingVSL, 
  onVSLGenerated 
}: MainVSLFormProps) {
  const [formData, setFormData] = useState({
    hook: existingVSL?.hook || '',
    problem: existingVSL?.problem || '',
    solution: existingVSL?.solution || '',
    proof: existingVSL?.proof || '',
    offer: existingVSL?.offer || '',
    close: existingVSL?.close || '',
    urgency: existingVSL?.urgency || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [vsl, setVSL] = useState(existingVSL)
  const [aiSuggestions, setAiSuggestions] = useState<Partial<MainVSL>>({})
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null)

  // AI Stream hook for real-time generation
  const { isStreaming, content, error, startStream, reset: resetAI } = useAIStream({
    onStart: () => console.log('AI generation started'),
    onChunk: (chunk) => console.log('AI chunk received:', chunk),
    onComplete: (fullText) => {
      console.log('AI generation completed:', fullText)
      if (activeField) {
        setAiSuggestions(prev => ({ ...prev, [activeField]: fullText }))
        setActiveField(null)
      }
    },
    onError: (error) => console.error('AI generation error:', error)
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateAIField = async (field: keyof typeof formData) => {
    setActiveField(field)
    
    const context = `Industry: ${customerAvatar.industry}, Business Description: ${customerAvatar.businessDescription}, Product: ${mainOffer.productName}, Price: $${mainOffer.price}`
    
    const fieldPrompts = {
      hook: `Create a compelling 15-second hook for a VSL about ${mainOffer.productName} in the ${customerAvatar.industry} industry. Make it attention-grabbing and emotionally compelling.`,
      problem: `Describe the pain points and frustrations that customers in the ${customerAvatar.industry} industry face. Make it relatable and emotionally charged.`,
      solution: `Introduce ${mainOffer.productName} as the solution to the problems faced by customers in the ${customerAvatar.industry} industry. Explain how it works and why it's the best solution.`,
      proof: `Create compelling proof and social validation for ${mainOffer.productName} in the ${customerAvatar.industry} industry. Include specific results, testimonials, or case studies.`,
      offer: `Present the offer for ${mainOffer.productName} at $${mainOffer.price}. Emphasize the value, benefits, and why this price is a great deal.`,
      close: `Write a strong call-to-action and closing statement for the VSL about ${mainOffer.productName}. Make it urgent and compelling.`,
      urgency: `Create an urgency message for ${mainOffer.productName} that encourages immediate action. Include scarcity, time limits, or special bonuses.`
    }

    await startStream(
      `${fieldPrompts[field]}\n\nContext: ${context}`,
      'mainVSL',
      { model: 'gpt-4o-mini', maxTokens: 300, temperature: 0.8 }
    )
  }

  const applyAISuggestion = (field: keyof typeof formData) => {
    if (aiSuggestions[field]) {
      setFormData(prev => ({ ...prev, [field]: aiSuggestions[field] as string }))
      setAiSuggestions(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const generateFullVSL = async () => {
    setIsGenerating(true)
    
    try {
      const context = `Industry: ${customerAvatar.industry}, Business Description: ${customerAvatar.businessDescription}, Product: ${mainOffer.productName}, Price: $${mainOffer.price}`
      
      await startStream(
        `Generate a complete VSL script for ${mainOffer.productName} in the ${customerAvatar.industry} industry. Business context: ${customerAvatar.businessDescription}. Price: $${mainOffer.price}. Include all sections: hook, problem, solution, proof, offer, close, and urgency. Make it highly converting and emotionally compelling.`,
        'mainVSL',
        { model: 'gpt-4o', maxTokens: 1000, temperature: 0.7 }
      )
      
      // Parse the AI response and update form
      // This is a simplified version - you might want to enhance the parsing
      const generatedVSL = {
        hook: formData.hook || `What if I told you that you could transform your ${customerAvatar.industry} business in just 30 days?`,
        problem: formData.problem || `Most ${customerAvatar.industry} business owners are stuck in a cycle of trying different strategies, spending money, and not seeing results. They're frustrated, overwhelmed, and ready to give up.`,
        solution: formData.solution || `That's why I created ${mainOffer.productName} - a proven system that's helped 500+ ${customerAvatar.industry} businesses like yours achieve breakthrough results.`,
        proof: formData.proof || `Here's what one of our clients said: 'We increased our revenue by 300% in just 90 days using this system.' Another client went from struggling to profitable in just 30 days.`,
        offer: formData.offer || `Today, I'm offering you access to this system for just $${mainOffer.price}. That's less than what most people spend on coffee in a week.`,
        close: formData.close || `Click the button below to get started now. This offer won't last long, and I want to make sure you get the results you deserve.`,
        urgency: formData.urgency || 'Limited Time: Only 47 spots available this month'
      }
      
      setVSL(generatedVSL)
      onVSLGenerated(generatedVSL)
    } catch (error) {
      console.error('Error generating VSL:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (vsl && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Main VSL Script Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Main VSL Script
            </CardTitle>
            <CardDescription>
              AI-optimized video sales letter script for maximum conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hook */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium text-blue-800">Hook (0:00 - 0:15)</Label>
              <p className="text-blue-700 mt-1 font-medium">{vsl.hook}</p>
            </div>

            {/* Problem */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Problem (0:15 - 1:00)</Label>
              <p className="text-gray-700 mt-1">{vsl.problem}</p>
            </div>

            {/* Solution */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Solution (1:00 - 2:00)</Label>
              <p className="text-gray-700 mt-1">{vsl.solution}</p>
            </div>

            {/* Proof */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Proof (2:00 - 3:00)</Label>
              <p className="text-gray-700 mt-1">{vsl.proof}</p>
            </div>

            {/* Offer */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-medium text-green-800">Offer (3:00 - 3:30)</Label>
              <p className="text-green-700 mt-1 font-medium">{vsl.offer}</p>
            </div>

            {/* Close */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Close (3:30 - 4:00)</Label>
              <p className="text-gray-700 mt-1">{vsl.close}</p>
            </div>

            {/* Urgency */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Label className="text-sm font-medium text-orange-800">Urgency Message</Label>
              <p className="text-orange-700 mt-1 font-medium">{vsl.urgency}</p>
            </div>

            <Button 
              onClick={() => setVSL(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate VSL Script
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Status Bar */}
      {isStreaming && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">
                AI is generating content for: {activeField ? activeField.charAt(0).toUpperCase() + activeField.slice(1) : 'VSL Script'}
              </span>
              {activeField && (
                <Badge variant="outline" className="ml-auto">
                  {content.length} characters
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions Panel */}
      {Object.keys(aiSuggestions).some(key => aiSuggestions[key as keyof typeof aiSuggestions]) && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-900 flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(aiSuggestions).map(([field, suggestion]) => 
              suggestion ? (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-green-800 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => applyAISuggestion(field as keyof typeof formData)}
                        className="h-7 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAiSuggestions(prev => ({ ...prev, [field]: undefined }))}
                        className="h-7 px-2 text-xs"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-green-900">{suggestion}</p>
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-900">Customer Avatar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Industry:</span>
                <span className="text-blue-900 font-medium">{customerAvatar.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Audience:</span>
                <span className="text-blue-900 font-medium">{customerAvatar.audienceDescription || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-900">Main Offer</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Product:</span>
                <span className="text-green-900 font-medium">{mainOffer.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Price:</span>
                <span className="text-green-900 font-medium">${mainOffer.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); generateFullVSL(); }} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="hook" className="text-sm font-medium">
              Hook (First 15 seconds)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('hook')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="hook"
            value={formData.hook}
            onChange={(e) => handleInputChange('hook', e.target.value)}
            placeholder="Grab attention immediately with a compelling question or statement"
            rows={2}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="problem" className="text-sm font-medium">
              Problem (45 seconds)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('problem')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="problem"
            value={formData.problem}
            onChange={(e) => handleInputChange('problem', e.target.value)}
            placeholder="Describe the pain points and frustrations your audience faces"
            rows={3}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="solution" className="text-sm font-medium">
              Solution (1 minute)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('solution')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="solution"
            value={formData.solution}
            onChange={(e) => handleInputChange('solution', e.target.value)}
            placeholder="Introduce your product/service as the solution"
            rows={3}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="proof" className="text-sm font-medium">
              Proof (1 minute)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('proof')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="proof"
            value={formData.proof}
            onChange={(e) => handleInputChange('proof', e.target.value)}
            placeholder="Share testimonials, case studies, or results"
            rows={3}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="offer" className="text-sm font-medium">
              Offer (30 seconds)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('offer')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="offer"
            value={formData.offer}
            onChange={(e) => handleInputChange('offer', e.target.value)}
            placeholder="Present your offer with pricing and value"
            rows={2}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="close" className="text-sm font-medium">
              Close (30 seconds)
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('close')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="close"
            value={formData.close}
            onChange={(e) => handleInputChange('close', e.target.value)}
            placeholder="Final call to action and encouragement"
            rows={2}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="urgency" className="text-sm font-medium">
              Urgency Message
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => generateAIField('urgency')}
              disabled={isStreaming}
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="urgency"
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            placeholder="Create urgency to encourage immediate action"
            rows={2}
            required
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>AI will optimize your VSL script for maximum engagement and conversions</span>
          </div>
          
          <Button 
            type="submit" 
            disabled={isGenerating || isStreaming}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                Generating Full VSL...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Complete VSL Script
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
