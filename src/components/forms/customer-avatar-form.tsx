'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { useAIStream } from '@/components/ui/use-ai-stream'
import { 
  User, 
  Sparkles,
  CheckCircle2,
  Download
} from 'lucide-react'

interface CustomerAvatarFormProps {
  existingAvatar?: CustomerAvatar | null
  onAvatarGenerated: (avatar: CustomerAvatar) => void
  onFormChange?: () => void
}

interface CustomerAvatar {
  id: string
  businessName: string
  businessDescription: string
  industry: string
  pricePoint: 'low' | 'mid' | 'high'
  audienceDescription: string
  websiteUrl: string
  existingCustomerData: string
  competitorAnalysis: string
  socialMediaAnalysis: string
  knownPainPoints: string
  previousResearch: string
  specificQuestions: string
  targetAge: string
  targetLocation: string
  targetIncome: string
  insights?: string[]
  recommendations?: string[]
}

interface AvatarFormData {
  // Business Context
  businessName: string
  businessDescription: string
  industry: string
  pricePoint: 'low' | 'mid' | 'high'
  
  // Audience Information Source
  audienceDescription: string
  websiteUrl: string
  existingCustomerData: string
  competitorAnalysis: string
  socialMediaAnalysis: string
  
  // Additional Context
  knownPainPoints: string
  previousResearch: string
  specificQuestions: string
  
  // Basic Demographics (for reference)
  targetAge: string
  targetLocation: string
  targetIncome: string
}

export function CustomerAvatarForm({ 
  existingAvatar, 
  onAvatarGenerated,
  onFormChange
}: CustomerAvatarFormProps) {
  const [formData, setFormData] = useState<AvatarFormData>({
    businessName: existingAvatar?.businessName || '',
    businessDescription: existingAvatar?.businessDescription || '',
    industry: existingAvatar?.industry || '',
    pricePoint: existingAvatar?.pricePoint || 'mid',
    audienceDescription: existingAvatar?.audienceDescription || '',
    websiteUrl: existingAvatar?.websiteUrl || '',
    existingCustomerData: existingAvatar?.existingCustomerData || '',
    competitorAnalysis: existingAvatar?.competitorAnalysis || '',
    socialMediaAnalysis: existingAvatar?.socialMediaAnalysis || '',
    knownPainPoints: existingAvatar?.knownPainPoints || '',
    previousResearch: existingAvatar?.previousResearch || '',
    specificQuestions: existingAvatar?.specificQuestions || '',
    targetAge: existingAvatar?.targetAge || '',
    targetLocation: existingAvatar?.targetLocation || '',
    targetIncome: existingAvatar?.targetIncome || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [avatar, setAvatar] = useState(existingAvatar)
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null)

  // AI Stream hook for real-time generation
  const { isStreaming, content, error, startStream, reset: resetAI } = useAIStream({
    onStart: () => console.log('AI generation started'),
    onChunk: (chunk) => console.log('AI chunk received:', chunk),
    onComplete: (fullText) => {
      console.log('AI generation completed:', fullText)
      // The content will be processed in generateFullAvatar
    },
    onError: (error) => console.error('AI generation error:', error)
  })



  const handleInputChange = (field: keyof AvatarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onFormChange?.()
  }



  // Helper function to handle avatar download
  const handleDownload = (avatarData: CustomerAvatar) => {
    try {
      const timestamp = new Date().toLocaleString()
      const content = `CUSTOMER AVATAR - ${avatarData.businessName || 'Business'}\n${'='.repeat(50)}\n\n` +
        `Generated on: ${timestamp}\n\n` +
        `BUSINESS DETAILS:\n` +
        `Business Name: ${avatarData.businessName}\n` +
        `Industry: ${avatarData.industry}\n` +
        `Business Description: ${avatarData.businessDescription}\n` +
        `Price Point: ${avatarData.pricePoint === 'low' ? 'Low Ticket ($7-$97)' : avatarData.pricePoint === 'mid' ? 'Mid Ticket ($97-$997)' : 'High Ticket ($997+)'}\n\n` +
        `AUDIENCE INFORMATION:\n` +
        `Audience Description: ${avatarData.audienceDescription || 'Not provided'}\n` +
        `Target Age: ${avatarData.targetAge || 'Not specified'}\n` +
        `Target Location: ${avatarData.targetLocation || 'Not specified'}\n` +
        `Target Income: ${avatarData.targetIncome || 'Not specified'}\n\n` +
        `RESEARCH DATA:\n` +
        `Website URL: ${avatarData.websiteUrl || 'Not provided'}\n` +
        `Existing Customer Data: ${avatarData.existingCustomerData || 'Not provided'}\n` +
        `Competitor Analysis: ${avatarData.competitorAnalysis || 'Not provided'}\n` +
        `Social Media Analysis: ${avatarData.socialMediaAnalysis || 'Not provided'}\n\n` +
        `ADDITIONAL CONTEXT:\n` +
        `Known Pain Points: ${avatarData.knownPainPoints || 'Not specified'}\n` +
        `Previous Research: ${avatarData.previousResearch || 'Not specified'}\n` +
        `Specific Questions: ${avatarData.specificQuestions || 'Not specified'}\n\n` +
        `AI INSIGHTS:\n${avatarData.insights?.map(insight => `• ${insight}`).join('\n') || 'No insights available'}\n\n` +
        `RECOMMENDATIONS:\n${avatarData.recommendations?.map(rec => `• ${rec}`).join('\n') || 'No recommendations available'}\n\n` +
        `Generated by AI Funnel Builder using Ultimate Customer Avatar Creation Framework`

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const timestamp2 = new Date().toISOString().split('T')[0]
      const filename = `${avatarData.businessName || 'Business'}_Customer_Avatar_${timestamp2}.txt`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Show success feedback
      alert('Customer avatar downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const generateFullAvatar = async () => {
    setIsGenerating(true)
    
    try {
      const context = `Business: ${formData.businessName || 'Business'}, Industry: ${formData.industry || 'General'}`
      
      // Generate complete avatar with AI using the Ultimate Customer Avatar Creation Framework
      const prompt = `Ultimate Customer Avatar Creation Framework

You are an elite customer psychology strategist, behavioral analyst, and direct response expert with deep expertise in psychographic profiling, conversion optimization, and human decision-making psychology.

Your mission: Create a comprehensive, multi-dimensional customer avatar that goes far beyond demographics to uncover the psychological drivers, emotional triggers, and behavioral patterns that influence purchasing decisions.

AUDIENCE RESEARCH INPUT
Business Context:
- My Business/Offer: ${formData.businessDescription}
- Target Market: ${formData.industry}
- Price Point: ${formData.pricePoint === 'low' ? 'Low ticket ($7-$97)' : formData.pricePoint === 'mid' ? 'Mid ticket ($97-$997)' : 'High ticket ($997+)'}

Audience Information Source:
${formData.audienceDescription ? `Option A - Audience Description: ${formData.audienceDescription}` : ''}
${formData.websiteUrl ? `Option B - Website/Content Analysis: ${formData.websiteUrl}` : ''}
${formData.existingCustomerData ? `Option C - Existing Customer Data: ${formData.existingCustomerData}` : ''}
${formData.competitorAnalysis ? `Option D - Competitor Analysis: ${formData.competitorAnalysis}` : ''}
${formData.socialMediaAnalysis ? `Option E - Social Media/Community Analysis: ${formData.socialMediaAnalysis}` : ''}

Additional Context:
- Known Pain Points: ${formData.knownPainPoints || 'Not specified'}
- Previous Research: ${formData.previousResearch || 'Not specified'}
- Specific Questions: ${formData.specificQuestions || 'Not specified'}
- Basic Demographics: Age: ${formData.targetAge || 'Not specified'}, Location: ${formData.targetLocation || 'Not specified'}, Income: ${formData.targetIncome || 'Not specified'}

OUTPUT REQUIREMENTS:

1. INSIGHTS SECTION (Format exactly as shown):
INSIGHTS:
• [First specific psychological insight about the target audience]
• [Second specific insight about their motivations and behaviors]
• [Third insight about their decision-making patterns]
• [Fourth insight about their emotional triggers]
• [Fifth insight about their pain points and goals]

2. RECOMMENDATIONS SECTION (Format exactly as shown):
RECOMMENDATIONS:
• [First actionable marketing strategy recommendation]
• [Second recommendation about messaging approach]
• [Third recommendation about offer positioning]
• [Fourth recommendation about copy angles]
• [Fifth recommendation about funnel strategy]

IMPORTANT FORMATTING RULES:
- Use exactly "INSIGHTS:" as the section header
- Use exactly "RECOMMENDATIONS:" as the section header
- Each insight/recommendation must start with "• " (bullet point + space)
- Each point should be 1-2 sentences maximum
- Be specific to the business context provided
- Do NOT use generic business advice
- Focus on psychological drivers and practical marketing strategies

Create the customer avatar analysis now:`

      // Start the AI stream
      await startStream(
        prompt,
        'customerAvatar',
        { model: 'gpt-4o', maxTokens: 1500, temperature: 0.7 }
      )

      // Wait for stream completion and process content
      let attempts = 0
      const maxAttempts = 50 // 5 seconds total wait time
      
      while (attempts < maxAttempts) {
        if (!isStreaming && content) {
          break
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }

      const aiContent = content || ''
      
      console.log('🔍 AI Response:', aiContent)
      
      // Enhanced parsing logic
      const parseInsightsAndRecommendations = (text: string) => {
        const insights: string[] = []
        const recommendations: string[] = []
        
        // Split into lines and clean them
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
        
        let currentSection = ''
        
        for (const line of lines) {
          // Check for section headers
          if (line.toUpperCase().includes('INSIGHTS:') || line.toUpperCase().includes('KEY INSIGHTS')) {
            currentSection = 'insights'
            continue
          }
          
          if (line.toUpperCase().includes('RECOMMENDATIONS:') || line.toUpperCase().includes('STRATEGIC RECOMMENDATIONS')) {
            currentSection = 'recommendations'
            continue
          }
          
          // Parse bullet points
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            const cleanLine = line.replace(/^[•\-*]\s*/, '').trim()
            
            if (cleanLine.length > 10) { // Only include substantial content
              if (currentSection === 'insights') {
                insights.push(cleanLine)
              } else if (currentSection === 'recommendations') {
                recommendations.push(cleanLine)
              }
            }
          }
          
          // Also check for numbered lists
          const numberedMatch = line.match(/^\d+\.\s*(.+)/)
          if (numberedMatch && numberedMatch[1].length > 10) {
            if (currentSection === 'insights') {
              insights.push(numberedMatch[1].trim())
            } else if (currentSection === 'recommendations') {
              recommendations.push(numberedMatch[1].trim())
            }
          }
        }
        
        return { insights, recommendations }
      }

      const { insights, recommendations } = parseInsightsAndRecommendations(aiContent)
      
      console.log('🎯 Parsed Insights:', insights)
      console.log('🎯 Parsed Recommendations:', recommendations)
      
      // Fallback extraction if structured parsing fails
      if (insights.length === 0 && recommendations.length === 0) {
        console.log('🔄 Attempting fallback parsing...')
        
        // Try to extract any meaningful bullet points or numbered items
        const allLines = aiContent.split('\n').map(line => line.trim())
        const meaningfulLines = allLines.filter(line => 
          (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) &&
          line.length > 20
        ).map(line => line.replace(/^[•\-*\d\.]\s*/, '').trim())
        
        // Split meaningful lines between insights and recommendations
        const midPoint = Math.ceil(meaningfulLines.length / 2)
        insights.push(...meaningfulLines.slice(0, midPoint))
        recommendations.push(...meaningfulLines.slice(midPoint))
      }
      
      const generatedAvatar: CustomerAvatar = {
        ...formData,
        id: Date.now().toString(),
        insights: insights.length > 0 ? insights : [
          'Detailed psychological insights will be generated based on your specific business and audience data',
          'AI analysis will uncover emotional triggers and decision-making patterns',
          'Customer motivation drivers will be identified from your provided information'
        ],
        recommendations: recommendations.length > 0 ? recommendations : [
          'Targeted marketing strategies will be recommended based on your customer psychology',
          'Specific copy angles and messaging approaches will be suggested',
          'Conversion optimization tactics will be provided for your funnel'
        ]
      }
      
      console.log('✅ Final Avatar:', generatedAvatar)
      
      setAvatar(generatedAvatar)
      onAvatarGenerated(generatedAvatar)
      
    } catch (error) {
      console.error('Error generating avatar:', error)
      
      // Create avatar with error state but still usable
      const fallbackAvatar: CustomerAvatar = {
        ...formData,
        id: Date.now().toString(),
        insights: [
          'AI generation encountered an issue. Please try regenerating.',
          'Your business information has been saved and can be used for manual analysis.'
        ],
        recommendations: [
          'Please try regenerating the avatar for AI-powered recommendations.',
          'Consider reviewing your input data and trying again.'
        ]
      }
      
      setAvatar(fallbackAvatar)
      onAvatarGenerated(fallbackAvatar)
    } finally {
      setIsGenerating(false)
    }
  }

  if (avatar && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Customer Avatar Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {avatar.businessName} - Customer Avatar
            </CardTitle>
            <CardDescription>
              AI-generated insights and recommendations for your target audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Industry</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.industry}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Price Point</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {avatar.pricePoint === 'low' ? 'Low Ticket ($7-$97)' : 
                   avatar.pricePoint === 'mid' ? 'Mid Ticket ($97-$997)' : 
                   'High Ticket ($997+)'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Target Age</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.targetAge || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Target Location</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.targetLocation || 'Not specified'}</p>
              </div>
            </div>

            <Separator />

            {/* Business Description */}
              <div>
              <Label className="text-sm font-medium text-gray-700">Business Description</Label>
              <p className="text-sm text-gray-900 mt-1">{avatar.businessDescription}</p>
              </div>

            <Separator />

            {/* Audience Information */}
              <div>
              <Label className="text-sm font-medium text-gray-700">Audience Description</Label>
              <p className="text-sm text-gray-900 mt-1">{avatar.audienceDescription || 'Not provided'}</p>
            </div>

            <Separator />

            {/* AI Insights */}
            <div>
              <Label className="text-sm font-medium text-gray-700">AI Insights</Label>
              <div className="mt-2 space-y-2">
                {avatar.insights?.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recommendations */}
            <div>
              <Label className="text-sm font-medium text-gray-700">AI Recommendations</Label>
              <div className="mt-2 space-y-2">
                {avatar.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setAvatar(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Avatar
            </Button>

            <Button 
              onClick={() => handleDownload(avatar)}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Customer Avatar
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
                AI is generating your complete customer avatar...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={(e) => { e.preventDefault(); generateFullAvatar(); }} className="space-y-6">
        {/* Business Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
          <div>
              <Label htmlFor="businessName" className="text-sm font-medium">
                Business Name
              </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your business name"
              required
            />
          </div>
          <div>
              <Label htmlFor="industry" className="text-sm font-medium">
                Industry
              </Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g., E-commerce, SaaS, Consulting"
              required
            />
              </div>
          </div>

          <div>
              <Label htmlFor="businessDescription" className="text-sm font-medium">
                Business/Offer Description
              </Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                placeholder="Brief description of your business, product, or service"
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pricePoint" className="text-sm font-medium">
                Price Point
              </Label>
              <select
                id="pricePoint"
                value={formData.pricePoint}
                onChange={(e) => handleInputChange('pricePoint', e.target.value as 'low' | 'mid' | 'high')}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="low">Low Ticket ($7-$97)</option>
                <option value="mid">Mid Ticket ($97-$997)</option>
                <option value="high">High Ticket ($997+)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Audience Information Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audience Information Source</CardTitle>
            <CardDescription>Choose one or more sources below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="audienceDescription" className="text-sm font-medium">
                Option A - Audience Description
              </Label>
              <Textarea
                id="audienceDescription"
                value={formData.audienceDescription}
                onChange={(e) => handleInputChange('audienceDescription', e.target.value)}
                placeholder="Detailed description of your target audience - their situation, challenges, goals, etc."
                rows={4}
              />
          </div>

          <div>
              <Label htmlFor="websiteUrl" className="text-sm font-medium">
                Option B - Website/Content Analysis
            </Label>
            <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="URL or website to analyze for audience insights"
            />
          </div>
            
            <div>
              <Label htmlFor="existingCustomerData" className="text-sm font-medium">
                Option C - Existing Customer Data
              </Label>
              <Textarea
                id="existingCustomerData"
                value={formData.existingCustomerData}
                onChange={(e) => handleInputChange('existingCustomerData', e.target.value)}
                placeholder="Information about current customers - surveys, feedback, testimonials, etc."
                rows={3}
              />
        </div>

          <div>
              <Label htmlFor="competitorAnalysis" className="text-sm font-medium">
                Option D - Competitor Analysis
            </Label>
              <Textarea
                id="competitorAnalysis"
                value={formData.competitorAnalysis}
                onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
                placeholder="Competitor websites, their messaging, or customer base to analyze"
                rows={3}
            />
          </div>

          <div>
              <Label htmlFor="socialMediaAnalysis" className="text-sm font-medium">
                Option E - Social Media/Community Analysis
              </Label>
              <Textarea
                id="socialMediaAnalysis"
                value={formData.socialMediaAnalysis}
                onChange={(e) => handleInputChange('socialMediaAnalysis', e.target.value)}
                placeholder="Links to Facebook groups, forums, social media accounts where your audience gathers"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="knownPainPoints" className="text-sm font-medium">
                Known Pain Points
              </Label>
            <Textarea
                id="knownPainPoints"
                value={formData.knownPainPoints}
                onChange={(e) => handleInputChange('knownPainPoints', e.target.value)}
                placeholder="Any pain points you already know about"
              rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="previousResearch" className="text-sm font-medium">
                Previous Research
              </Label>
              <Textarea
                id="previousResearch"
                value={formData.previousResearch}
                onChange={(e) => handleInputChange('previousResearch', e.target.value)}
                placeholder="Any existing avatar work, surveys, or customer insights"
                rows={3}
              />
          </div>

          <div>
              <Label htmlFor="specificQuestions" className="text-sm font-medium">
                Specific Questions
            </Label>
            <Textarea
                id="specificQuestions"
                value={formData.specificQuestions}
                onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                placeholder="Any particular aspects you want to understand better"
              rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Demographics (for reference) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Demographics (Reference Only)</CardTitle>
            <CardDescription>Basic info to help AI understand your audience better</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="targetAge" className="text-sm font-medium">
                  Target Age Range
                </Label>
                <Input
                  id="targetAge"
                  value={formData.targetAge}
                  onChange={(e) => handleInputChange('targetAge', e.target.value)}
                  placeholder="e.g., 25-45, 30-60"
                />
              </div>
              <div>
                <Label htmlFor="targetLocation" className="text-sm font-medium">
                  Target Location
                </Label>
                <Input
                  id="targetLocation"
                  value={formData.targetLocation}
                  onChange={(e) => handleInputChange('targetLocation', e.target.value)}
                  placeholder="e.g., United States, Global, Urban areas"
                />
              </div>
              <div>
                <Label htmlFor="targetIncome" className="text-sm font-medium">
                  Target Income Level
                </Label>
                <Input
                  id="targetIncome"
                  value={formData.targetIncome}
                  onChange={(e) => handleInputChange('targetIncome', e.target.value)}
                  placeholder="e.g., $50K+, $100K+, Middle class"
            />
          </div>
        </div>
          </CardContent>
        </Card>

      <Separator />



      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will analyze this information to create a detailed customer avatar</span>
        </div>
        
        <div className="flex gap-2">
          {existingAvatar && (
            <Button 
              variant="outline"
              onClick={() => handleDownload(existingAvatar)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Existing Avatar
            </Button>
          )}
          
          <Button 
            type="submit" 
              disabled={isGenerating || isStreaming}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                Generating Avatar...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                  Generate Complete Avatar
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
    </div>
  )
}
