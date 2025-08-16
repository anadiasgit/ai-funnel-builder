'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { useAIStream } from '@/components/ui/use-ai-stream'
import { 
  User, 
  Sparkles,
  CheckCircle2,
  Download,
  HelpCircle,
  Wand2,
  Copy,
  RefreshCw,
  Brain,
  Target
} from 'lucide-react'
import { Tooltip } from '@/components/ui/help-system'

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
  const [aiSuggestions, setAiSuggestions] = useState<Partial<AvatarFormData>>({})
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])

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

  const generateAIField = async (field: keyof typeof formData) => {
    setActiveField(field)
    
    const context = `Business: ${formData.businessName || 'Business'}, Industry: ${formData.industry || 'General'}, Location: ${formData.location || 'Global'}`
    
    const fieldPrompts = {
      targetAudience: `Create a detailed description of the ideal target audience for a business in the ${formData.industry || 'general'} industry. Include demographics, job titles, characteristics, and behaviors. Make it specific and actionable.`,
      painPoints: `Identify the most common and compelling pain points that customers in the ${formData.industry || 'general'} industry face. Focus on emotional and practical challenges that drive purchasing decisions.`,
      goals: `Describe the primary goals and aspirations that customers in the ${formData.industry || 'general'} industry are trying to achieve. Include both short-term and long-term objectives.`,
      budget: `Suggest typical budget ranges and pricing expectations for customers in the ${formData.industry || 'general'} industry. Consider different customer segments and their willingness to pay.`
    }

    await startStream(
      `${fieldPrompts[field]}\n\nContext: ${context}`,
      'customerAvatar',
      { model: 'gpt-4o-mini', maxTokens: 200, temperature: 0.8 }
    )
  }

  const generateAIInsights = async () => {
    setActiveField('insights')
    
    const context = `Business: ${formData.businessName || 'Business'}, Industry: ${formData.industry || 'General'}, Target Audience: ${formData.targetAudience || 'General'}, Pain Points: ${formData.painPoints || 'Various'}, Goals: ${formData.goals || 'Growth'}`
    
    await startStream(
      `Generate 5-7 specific insights about customers in the ${formData.industry || 'general'} industry. Focus on behavioral patterns, decision-making factors, and market trends. Make each insight actionable and specific.\n\nContext: ${context}`,
      'customerAvatar',
      { model: 'gpt-4o', maxTokens: 400, temperature: 0.7 }
    )
  }

  const generateAIRecommendations = async () => {
    setActiveField('recommendations')
    
    const context = `Business: ${formData.businessName || 'Business'}, Industry: ${formData.industry || 'General'}, Target Audience: ${formData.targetAudience || 'General'}, Pain Points: ${formData.painPoints || 'Various'}, Goals: ${formData.goals || 'Growth'}`
    
    await startStream(
      `Generate 5-7 strategic recommendations for marketing and sales to customers in the ${formData.industry || 'general'} industry. Focus on messaging, channels, offers, and positioning. Make each recommendation specific and actionable.\n\nContext: ${context}`,
      'customerAvatar',
      { model: 'gpt-4o', maxTokens: 400, temperature: 0.7 }
    )
  }

  const applyAISuggestion = (field: keyof typeof formData) => {
    if (aiSuggestions[field]) {
      setFormData(prev => ({ ...prev, [field]: aiSuggestions[field] as string }))
      setAiSuggestions(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const applyAIInsights = () => {
    if (content && activeField === 'insights') {
      // Parse the AI response into bullet points
      const insights = content.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10)
      setAiInsights(insights)
      setActiveField(null)
    }
  }

  const applyAIRecommendations = () => {
    if (content && activeField === 'recommendations') {
      // Parse the AI response into bullet points
      const recommendations = content.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10)
      setAiRecommendations(recommendations)
      setActiveField(null)
    }
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
      
      // Generate insights and recommendations
      await generateAIInsights()
      await generateAIRecommendations()
      
      const generatedAvatar = {
        ...formData,
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        insights: aiInsights.length > 0 ? aiInsights : [
          'Primary audience: Small business owners aged 30-50',
          'Main pain point: Limited marketing budget and time',
          'Preferred communication: Email and social media',
          'Decision making: Research-driven, value-conscious'
        ],
        recommendations: aiRecommendations.length > 0 ? aiRecommendations : [
          'Focus on ROI and time-saving benefits',
          'Use case studies and testimonials',
          'Offer flexible pricing options',
          'Provide educational content'
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
                AI is generating content for: {activeField === 'insights' ? 'AI Insights' : activeField === 'recommendations' ? 'AI Recommendations' : activeField ? activeField.charAt(0).toUpperCase() + activeField.slice(1) : 'Customer Avatar'}
              </span>
              {activeField && activeField !== 'insights' && activeField !== 'recommendations' && (
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

      {/* AI Insights & Recommendations Panel */}
      {(activeField === 'insights' || activeField === 'recommendations') && content && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm text-purple-900 flex items-center gap-2">
              {activeField === 'insights' ? <Brain className="h-4 w-4" /> : <Target className="h-4 w-4" />}
              AI {activeField === 'insights' ? 'Insights' : 'Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded border border-purple-200">
              <pre className="text-sm text-purple-900 whitespace-pre-wrap">{content}</pre>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={activeField === 'insights' ? applyAIInsights : applyAIRecommendations}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Apply {activeField === 'insights' ? 'Insights' : 'Recommendations'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveField(null)}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={(e) => { e.preventDefault(); generateFullAvatar(); }} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Information */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name
                </Label>
                <Tooltip content="Your business name helps personalize the avatar and makes it easier to reference in your funnel building process">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                </Tooltip>
              </div>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Your business name"
                required
              />
              
              {/* Example Content */}
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>💡 Examples:</strong> &quot;Acme Corp&quot;, &quot;Smith Consulting&quot;, &quot;TechFlow Solutions&quot;
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  Industry
                </Label>
                <Tooltip content="Your industry helps us provide relevant examples and industry-specific insights for your customer avatar">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                </Tooltip>
              </div>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="e.g., E-commerce, SaaS, Consulting"
                required
              />
              
              {/* Example Content */}
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                <strong>💡 Examples:</strong> &quot;E-commerce&quot;, &quot;SaaS&quot;, &quot;Consulting&quot;, &quot;Real Estate&quot;, &quot;Health &amp; Wellness&quot;
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">
                  Target Audience
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('targetAudience')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g., Small business owners, 30-50 years old"
                required
              />
              
              {/* Example Content */}
              <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
                <strong>💡 Examples:</strong> &quot;Small business owners, 30-50 years old&quot;, &quot;Marketing managers at companies with 10-100 employees&quot;, &quot;Entrepreneurs in the tech industry&quot;
              </div>
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
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="budget" className="text-sm font-medium">
                  Typical Customer Budget
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('budget')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="e.g., $500-$2000, $50-200/month"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="painPoints" className="text-sm font-medium">
                  Main Pain Points
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('painPoints')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id="painPoints"
                value={formData.painPoints}
                onChange={(e) => handleInputChange('painPoints', e.target.value)}
                placeholder="What problems do your customers face?"
                rows={3}
                required
              />
              
              {/* Example Content */}
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                <strong>💡 Examples:</strong> &quot;High customer acquisition costs, difficulty scaling, inconsistent revenue, lack of time for marketing, competition challenges&quot;
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="goals" className="text-sm font-medium">
                  Customer Goals
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('goals')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
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

        {/* AI Generation Buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={generateAIInsights}
            disabled={isStreaming || !formData.industry}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Generate AI Insights
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={generateAIRecommendations}
            disabled={isStreaming || !formData.industry}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Generate AI Recommendations
          </Button>
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
