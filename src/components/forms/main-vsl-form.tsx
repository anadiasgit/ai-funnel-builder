'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Video, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface MainVSLFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingVSL?: MainVSL | null
  onVSLGenerated: (vsl: MainVSL) => void
}

interface CustomerAvatar {
  id: string
  businessName: string
  industry: string
  targetAudience: string
}

interface MainOffer {
  id: string
  productName: string
  price: string
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 4000))
      
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
                <span className="text-blue-900 font-medium">{customerAvatar.targetAudience}</span>
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="hook" className="text-sm font-medium">
            Hook (First 15 seconds)
          </Label>
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
          <Label htmlFor="problem" className="text-sm font-medium">
            Problem (45 seconds)
          </Label>
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
          <Label htmlFor="solution" className="text-sm font-medium">
            Solution (1 minute)
          </Label>
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
          <Label htmlFor="proof" className="text-sm font-medium">
            Proof (1 minute)
          </Label>
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
          <Label htmlFor="offer" className="text-sm font-medium">
            Offer (30 seconds)
          </Label>
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
          <Label htmlFor="close" className="text-sm font-medium">
            Close (30 seconds)
          </Label>
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
          <Label htmlFor="urgency" className="text-sm font-medium">
            Urgency Message
          </Label>
          <Textarea
            id="urgency"
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            placeholder="Create urgency to encourage immediate action"
            rows={2}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will optimize your VSL script for maximum engagement and conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating VSL Script...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate VSL Script
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
