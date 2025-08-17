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
  CheckCircle2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CustomerAvatar, MainOffer } from '@/lib/types'

interface UpsellVSLFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingVSL?: UpsellVSL | null
  onVSLGenerated: (vsl: UpsellVSL) => void
}



interface UpsellVSL {
  hook: string
  problem: string
  solution: string
  proof: string
  offer: string
  close: string
  urgency: string
}

export function UpsellVSLForm({ 
  customerAvatar, 
  mainOffer, 
  existingVSL, 
  onVSLGenerated 
}: UpsellVSLFormProps) {
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
        hook: formData.hook || `Now that you have ${mainOffer.productName}, let me show you how to take your results to the next level.`,
        problem: formData.problem || `While ${mainOffer.productName} will give you great results, many people hit a plateau after the initial success. They're ready for the next level but don't know how to get there.`,
        solution: formData.solution || `That's why I've created an advanced training program specifically for people who are serious about maximizing their results. This isn't for beginners - it's for people ready to scale.`,
        proof: formData.proof || `Our advanced students typically see 3-5x better results than those who only use the basic system. One client went from $10k to $50k monthly revenue in just 90 days.`,
        offer: formData.offer || `Today, I'm offering you access to this advanced training for just $197. That's less than what most people spend on a single consultation.`,
        close: formData.close || `If you're serious about taking your business to the next level, click the button below now. This advanced training is only available to existing customers.`,
        urgency: formData.urgency || 'Limited Time: This offer expires in 24 hours'
      }
      
      setVSL(generatedVSL)
      onVSLGenerated(generatedVSL)
    } catch (error) {
      console.error('Error generating upsell VSL:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (vsl && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Upsell VSL Script Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Upsell VSL Script
            </CardTitle>
            <CardDescription>
              AI-optimized video sales letter script for upsell conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hook */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Label className="text-sm font-medium text-purple-800">Hook (0:00 - 0:15)</Label>
              <p className="text-purple-700 mt-1 font-medium">{vsl.hook}</p>
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
              Regenerate Upsell VSL Script
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="hook" className="text-sm font-medium">
            Hook (First 15 seconds)
          </Label>
          <Textarea
            id="hook"
            value={formData.hook}
            onChange={(e) => handleInputChange('hook', e.target.value)}
            placeholder="Transition from main offer to upsell opportunity"
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
            placeholder="Describe the next level challenges they'll face"
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
            placeholder="Introduce your upsell as the advanced solution"
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
            placeholder="Share advanced results and testimonials"
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
            placeholder="Present your upsell with pricing and value"
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
            placeholder="Final call to action for serious customers"
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
            placeholder="Create urgency for the upsell offer"
            rows={2}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will optimize your upsell VSL script for maximum conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Upsell VSL Script...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Upsell VSL Script
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
