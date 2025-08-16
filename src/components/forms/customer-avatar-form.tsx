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
  industry: string
  targetAudience: string
  painPoints: string
  goals: string
  budget: string
  location: string
  insights?: string[]
  recommendations?: string[]
}

interface AvatarFormData {
  businessName: string
  industry: string
  targetAudience: string
  painPoints: string
  goals: string
  budget: string
  location: string
}

export function CustomerAvatarForm({ 
  existingAvatar, 
  onAvatarGenerated,
  onFormChange
}: CustomerAvatarFormProps) {
  const [formData, setFormData] = useState<AvatarFormData>({
    businessName: existingAvatar?.businessName || '',
    industry: existingAvatar?.industry || '',
    targetAudience: existingAvatar?.targetAudience || '',
    painPoints: existingAvatar?.painPoints || '',
    goals: existingAvatar?.goals || '',
    budget: existingAvatar?.budget || '',
    location: existingAvatar?.location || ''
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

  // Smart suggestions based on industry selection
  useEffect(() => {
    if (formData.industry && !existingAvatar) {
      const suggestions = getIndustrySuggestions(formData.industry)
      setFormData(prev => ({
        ...prev,
        painPoints: prev.painPoints || suggestions.painPoints,
        goals: prev.goals || suggestions.goals,
        targetAudience: prev.targetAudience || suggestions.targetAudience
      }))
    }
  }, [formData.industry, existingAvatar])

  const getIndustrySuggestions = (industry: string) => {
    const industryMap: Record<string, {
      painPoints: string
      goals: string
      targetAudience: string
    }> = {
      'Technology': {
        painPoints: 'High customer acquisition costs, complex sales cycles, rapid technology changes, competition from larger companies, difficulty explaining technical value to non-technical buyers',
        goals: 'Increase market share, improve customer retention, develop recurring revenue streams, expand into new markets, build thought leadership',
        targetAudience: 'Small to medium businesses, startups, enterprise companies, IT managers, business owners looking to digitize'
      },
      'Marketing & Advertising': {
        painPoints: 'Inconsistent lead generation, high client acquisition costs, difficulty proving ROI, client retention challenges, seasonal fluctuations',
        goals: 'Generate consistent leads, increase client lifetime value, improve conversion rates, build recurring revenue, expand service offerings',
        targetAudience: 'Small businesses, e-commerce stores, local service businesses, startups, established companies looking to grow'
      },
      'E-commerce': {
        painPoints: 'High customer acquisition costs, cart abandonment, inventory management, seasonal fluctuations, competition from Amazon',
        goals: 'Increase conversion rates, reduce customer acquisition costs, improve customer retention, expand product lines, enter new markets',
        targetAudience: 'Online shoppers, mobile users, specific demographics, international customers, repeat buyers'
      },
      'Health & Wellness': {
        painPoints: 'Client acquisition challenges, inconsistent income, difficulty scaling, insurance limitations, seasonal fluctuations',
        goals: 'Increase client base, improve client retention, develop recurring revenue, expand services, build referral system',
        targetAudience: 'Health-conscious individuals, specific age groups, people with specific health goals, corporate wellness programs'
      },
      'Finance': {
        painPoints: 'Regulatory compliance, client trust issues, market volatility, competition from robo-advisors, difficulty explaining complex products',
        goals: 'Increase assets under management, improve client retention, develop recurring revenue, expand service offerings, build thought leadership',
        targetAudience: 'Individuals planning for retirement, small business owners, high-net-worth individuals, millennials building wealth'
      },
      'Real Estate': {
        painPoints: 'Market fluctuations, high competition, seasonal variations, client acquisition costs, difficulty standing out',
        goals: 'Increase sales volume, improve client retention, develop referral system, expand service areas, build team',
        targetAudience: 'First-time homebuyers, property investors, sellers, commercial clients, specific neighborhoods'
      }
    }
    
    return industryMap[industry] || {
      painPoints: 'Difficulty generating leads, high customer acquisition costs, inconsistent revenue, competition challenges, scaling limitations',
      goals: 'Increase revenue, improve customer retention, expand market reach, develop recurring income, build brand awareness',
      targetAudience: 'Small to medium businesses, specific demographics, local customers, online audience, repeat buyers'
    }
  }

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
        `Target Audience: ${avatarData.targetAudience}\n` +
        `Primary Location: ${avatarData.location}\n` +
        `Typical Customer Budget: ${avatarData.budget}\n\n` +
        `PAIN POINTS:\n${avatarData.painPoints}\n\n` +
        `CUSTOMER GOALS:\n${avatarData.goals}\n\n` +
        `AI INSIGHTS:\n${avatarData.insights?.map(insight => `• ${insight}`).join('\n') || 'No insights available'}\n\n` +
        `RECOMMENDATIONS:\n${avatarData.recommendations?.map(rec => `• ${rec}`).join('\n') || 'No recommendations available'}\n\n` +
        `Generated by AI Funnel Builder`

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
      const context = `Business: ${formData.businessName || 'Business'}, Industry: ${formData.industry || 'General'}, Location: ${formData.location || 'Global'}`
      
      // Generate complete avatar with AI
      const prompt = `You are an expert marketing strategist creating a detailed customer avatar. 

BUSINESS DETAILS:
- Business Name: ${formData.businessName}
- Industry: ${formData.industry}
- Location: ${formData.location}

CURRENT CUSTOMER INFORMATION:
- Target Audience: ${formData.targetAudience}
- Pain Points: ${formData.painPoints}
- Goals: ${formData.goals}
- Budget: ${formData.budget}

TASK: Based on the EXACT information provided above, create a comprehensive customer avatar. DO NOT use generic business insights - use the specific details provided.

Please generate:

1. ENHANCED TARGET AUDIENCE: Expand on "${formData.targetAudience}" with specific demographics, behaviors, and characteristics
2. COMPREHENSIVE PAIN POINTS: Deepen "${formData.painPoints}" with emotional and practical challenges
3. DETAILED CUSTOMER GOALS: Expand on "${formData.goals}" with short-term and long-term objectives
4. AI INSIGHTS (5-7 points): Specific insights about customers in the ${formData.industry} industry, focusing on the target audience described
5. STRATEGIC RECOMMENDATIONS (5-7 points): Marketing and sales strategies specifically for ${formData.industry} customers with the pain points and goals described

IMPORTANT: Use the EXACT information provided. If they say "dog owners" and "dog toys", focus on dog owners, not generic business owners.`

      // Start the AI stream
      await startStream(
        prompt,
        'customerAvatar',
        { model: 'gpt-4o', maxTokens: 800, temperature: 0.7 }
      )

      // Wait for the stream to complete and get the content
      // The content will be available in the useAIStream hook
      const aiContent = content || ''
      
      // Parse the AI response more intelligently
      const sections = aiContent.split(/\d+\.\s+/).filter(section => section.trim().length > 0)
      
      let enhancedTargetAudience = formData.targetAudience
      let enhancedPainPoints = formData.painPoints
      let enhancedGoals = formData.goals
      let insights: string[] = []
      let recommendations: string[] = []
      
      // Parse each section based on the AI response structure
      sections.forEach(section => {
        const lines = section.split('\n').filter(line => line.trim().length > 0)
        const firstLine = lines[0]?.toLowerCase() || ''
        
        if (firstLine.includes('target audience') || firstLine.includes('audience')) {
          enhancedTargetAudience = lines.slice(1).join(' ').trim() || formData.targetAudience
        } else if (firstLine.includes('pain points') || firstLine.includes('pain')) {
          enhancedPainPoints = lines.slice(1).join(' ').trim() || formData.painPoints
        } else if (firstLine.includes('goals') || firstLine.includes('objectives')) {
          enhancedGoals = lines.slice(1).join(' ').trim() || formData.goals
        } else if (firstLine.includes('insights')) {
          insights = lines.slice(1).filter(line => line.trim().length > 10).slice(0, 7)
        } else if (firstLine.includes('recommendations') || firstLine.includes('strategies')) {
          recommendations = lines.slice(1).filter(line => line.trim().length > 10).slice(0, 7)
        }
      })
      
      // If parsing didn't work well, try to extract insights and recommendations from the full text
      if (insights.length === 0) {
        const insightLines = aiContent.split('\n')
          .filter(line => line.trim().length > 20 && (line.includes('•') || line.includes('-') || line.includes('*')))
          .map(line => line.replace(/^[•\-*]\s*/, '').trim())
          .filter(line => line.length > 10)
        insights = insightLines.slice(0, 7)
      }
      
      if (recommendations.length === 0) {
        const recLines = aiContent.split('\n')
          .filter(line => line.trim().length > 20 && (line.includes('•') || line.includes('-') || line.includes('*')))
          .map(line => line.replace(/^[•\-*]\s*/, '').trim())
          .filter(line => line.length > 10)
        recommendations = recLines.slice(0, 7)
      }
      
      const generatedAvatar = {
        ...formData,
        targetAudience: enhancedTargetAudience,
        painPoints: enhancedPainPoints,
        goals: enhancedGoals,
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        insights: insights.length > 0 ? insights : [
          'AI insights will be generated based on your specific business'
        ],
        recommendations: recommendations.length > 0 ? recommendations : [
          'AI recommendations will be generated based on your specific business'
        ]
      }
      
      setAvatar(generatedAvatar)
      onAvatarGenerated(generatedAvatar)
    } catch (error) {
      console.error('Error generating avatar:', error)
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
                <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.targetAudience}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Budget Range</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.budget}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.location}</p>
              </div>
            </div>

            <Separator />

            {/* Pain Points & Goals */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Pain Points</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.painPoints}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Goals</Label>
                <p className="text-sm text-gray-900 mt-1">{avatar.goals}</p>
              </div>
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Information */}
          <div className="space-y-4">
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

            <div>
              <Label htmlFor="targetAudience" className="text-sm font-medium">
                Target Audience
              </Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g., Small business owners, 30-50 years old"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Primary Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., United States, Global"
                required
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget" className="text-sm font-medium">
                Typical Customer Budget
              </Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="e.g., $500-$2000, $50-200/month"
                required
              />
            </div>

            <div>
              <Label htmlFor="painPoints" className="text-sm font-medium">
                Main Pain Points
              </Label>
              <Textarea
                id="painPoints"
                value={formData.painPoints}
                onChange={(e) => handleInputChange('painPoints', e.target.value)}
                placeholder="What problems do your customers face?"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-sm font-medium">
                Customer Goals
              </Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="What are your customers trying to achieve?"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

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
