'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  User, 
  Sparkles,
  CheckCircle2
} from 'lucide-react'

interface CustomerAvatarFormProps {
  existingAvatar?: CustomerAvatar | null
  onAvatarGenerated: (avatar: CustomerAvatar) => void
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
  onAvatarGenerated 
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

  const handleInputChange = (field: keyof AvatarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedAvatar = {
        ...formData,
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        insights: [
          'Primary audience: Small business owners aged 30-50',
          'Main pain point: Limited marketing budget and time',
          'Preferred communication: Email and social media',
          'Decision making: Research-driven, value-conscious'
        ],
        recommendations: [
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            <Input
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              placeholder="e.g., Small business owners, 30-50 years old"
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
        
        <Button 
          type="submit" 
          disabled={isGenerating}
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
              Generate Customer Avatar
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
