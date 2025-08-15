'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Mail, 
  Sparkles,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react'

interface EmailStrategyFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingStrategy?: EmailStrategy | null
  onStrategyGenerated: (strategy: EmailStrategy) => void
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

interface EmailStrategy {
  welcome: { subject: string; body: string }
  nurture: { subject: string; body: string }
  offer: { subject: string; body: string }
  followUp: { subject: string; body: string }
  abandonedCart: { subject: string; body: string }
}

export function EmailStrategyForm({ 
  customerAvatar, 
  mainOffer, 
  existingStrategy, 
  onStrategyGenerated 
}: EmailStrategyFormProps) {
  const [formData, setFormData] = useState({
    welcomeSubject: existingStrategy?.welcome.subject || '',
    welcomeBody: existingStrategy?.welcome.body || '',
    nurtureSubject: existingStrategy?.nurture.subject || '',
    nurtureBody: existingStrategy?.nurture.body || '',
    offerSubject: existingStrategy?.offer.subject || '',
    offerBody: existingStrategy?.offer.body || '',
    followUpSubject: existingStrategy?.followUp.subject || '',
    followUpBody: existingStrategy?.followUp.body || '',
    abandonedCartSubject: existingStrategy?.abandonedCart.subject || '',
    abandonedCartBody: existingStrategy?.abandonedCart.body || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [strategy, setStrategy] = useState(existingStrategy)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const generatedStrategy = {
        welcome: {
          subject: formData.welcomeSubject || `Welcome to ${mainOffer.productName}! Here's Your First Step`,
          body: formData.welcomeBody || `Hi there!\n\nWelcome to the ${mainOffer.productName} family! I'm so excited to have you on board.\n\nYour journey to transforming your ${customerAvatar.industry} business starts right now.\n\nIn the next few emails, I'll share:\n• The #1 mistake most ${customerAvatar.industry} business owners make\n• How to implement ${mainOffer.productName} for maximum results\n• Advanced strategies to scale your success\n\nStay tuned!\n\nBest regards,\n[Your Name]`
        },
        nurture: {
          subject: formData.nurtureSubject || `The #1 Mistake ${customerAvatar.industry} Business Owners Make`,
          body: formData.nurtureBody || `Hi!\n\nI've been thinking about what holds most ${customerAvatar.industry} business owners back from success.\n\nAfter working with 500+ businesses, I've identified the #1 mistake:\n\nThey try to do everything at once instead of focusing on what actually works.\n\n${mainOffer.productName} solves this by giving you a proven, step-by-step system.\n\nBut here's the thing - you need to implement it consistently.\n\nIn my next email, I'll show you exactly how to get started.\n\nBest regards,\n[Your Name]`
        },
        offer: {
          subject: formData.offerSubject || `Special Offer: Get ${mainOffer.productName} at 50% Off`,
          body: formData.offerBody || `Hi!\n\nI wanted to give you a special opportunity to get ${mainOffer.productName} at 50% off.\n\nThis system normally costs $${mainOffer.price}, but for the next 24 hours, you can get it for just $${Math.round(parseInt(mainOffer.price) * 0.5)}.\n\nHere's what you'll get:\n• Complete step-by-step system\n• Done-for-you implementation\n• 30-day money-back guarantee\n• Lifetime access to updates\n\nClick here to claim your discount: [LINK]\n\nThis offer expires in 24 hours.\n\nBest regards,\n[Your Name]`
        },
        followUp: {
          subject: formData.followUpSubject || `How's ${mainOffer.productName} Working for You?`,
          body: formData.followUpBody || `Hi!\n\nI hope you're getting great results with ${mainOffer.productName}!\n\nI wanted to check in and see how things are going.\n\nHave you started implementing the strategies?\n\nIf you have any questions or need help, just reply to this email.\n\nI'm here to support your success!\n\nBest regards,\n[Your Name]`
        },
        abandonedCart: {
          subject: formData.abandonedCartSubject || `Don't Miss Out on ${mainOffer.productName}!`,
          body: formData.abandonedCartBody || `Hi!\n\nI noticed you were interested in ${mainOffer.productName} but didn't complete your purchase.\n\nI wanted to make sure you didn't miss out on this opportunity.\n\n${mainOffer.productName} has helped 500+ ${customerAvatar.industry} businesses achieve breakthrough results.\n\nIf you have any questions or concerns, just reply to this email.\n\nI'm here to help!\n\nBest regards,\n[Your Name]`
        }
      }
      
      setStrategy(generatedStrategy)
      onStrategyGenerated(generatedStrategy)
    } catch (error) {
      console.error('Error generating email strategy:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (strategy && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Email Strategy Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Complete Email Strategy
            </CardTitle>
            <CardDescription>
              AI-optimized email sequences for maximum engagement and conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Welcome Email */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-500" />
                <Label className="text-sm font-medium text-blue-800">Welcome Email</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject Line</Label>
                  <p className="text-sm font-medium text-gray-900">{strategy.welcome.subject}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email Body</Label>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{strategy.welcome.body}</pre>
                </div>
              </div>
            </div>

            {/* Nurture Email */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-green-500" />
                <Label className="text-sm font-medium text-green-800">Nurture Email</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject Line</Label>
                  <p className="text-sm font-medium text-gray-900">{strategy.nurture.subject}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email Body</Label>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{strategy.nurture.body}</pre>
                </div>
              </div>
            </div>

            {/* Offer Email */}
            <div className="border rounded-lg p-4 bg-yellow-50">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-yellow-600" />
                <Label className="text-sm font-medium text-yellow-800">Special Offer Email</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject Line</Label>
                  <p className="text-sm font-medium text-gray-900">{strategy.offer.subject}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email Body</Label>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{strategy.offer.body}</pre>
                </div>
              </div>
            </div>

            {/* Follow Up Email */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-purple-500" />
                <Label className="text-sm font-medium text-purple-800">Follow Up Email</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject Line</Label>
                  <p className="text-sm font-medium text-gray-900">{strategy.followUp.subject}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email Body</Label>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{strategy.followUp.body}</pre>
                </div>
              </div>
            </div>

            {/* Abandoned Cart Email */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-red-500" />
                <Label className="text-sm font-medium text-red-800">Abandoned Cart Email</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Subject Line</Label>
                  <p className="text-sm font-medium text-gray-900">{strategy.abandonedCart.subject}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email Body</Label>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{strategy.abandonedCart.body}</pre>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStrategy(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Email Strategy
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Welcome Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-900">Welcome Email</h3>
          <div>
            <Label htmlFor="welcomeSubject" className="text-sm font-medium">
              Subject Line
            </Label>
            <Input
              id="welcomeSubject"
              value={formData.welcomeSubject}
              onChange={(e) => handleInputChange('welcomeSubject', e.target.value)}
              placeholder="Welcome subject line"
              required
            />
          </div>
          <div>
            <Label htmlFor="welcomeBody" className="text-sm font-medium">
              Email Body
            </Label>
            <Textarea
              id="welcomeBody"
              value={formData.welcomeBody}
              onChange={(e) => handleInputChange('welcomeBody', e.target.value)}
              placeholder="Welcome email content"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Nurture Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-green-900">Nurture Email</h3>
          <div>
            <Label htmlFor="nurtureSubject" className="text-sm font-medium">
              Subject Line
            </Label>
            <Input
              id="nurtureSubject"
              value={formData.nurtureSubject}
              onChange={(e) => handleInputChange('nurtureSubject', e.target.value)}
              placeholder="Nurture subject line"
              required
            />
          </div>
          <div>
            <Label htmlFor="nurtureBody" className="text-sm font-medium">
              Email Body
            </Label>
            <Textarea
              id="nurtureBody"
              value={formData.nurtureBody}
              onChange={(e) => handleInputChange('nurtureBody', e.target.value)}
              placeholder="Nurture email content"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Offer Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-yellow-900">Special Offer Email</h3>
          <div>
            <Label htmlFor="offerSubject" className="text-sm font-medium">
              Subject Line
            </Label>
            <Input
              id="offerSubject"
              value={formData.offerSubject}
              onChange={(e) => handleInputChange('offerSubject', e.target.value)}
              placeholder="Offer subject line"
              required
            />
          </div>
          <div>
            <Label htmlFor="offerBody" className="text-sm font-medium">
              Email Body
            </Label>
            <Textarea
              id="offerBody"
              value={formData.offerBody}
              onChange={(e) => handleInputChange('offerBody', e.target.value)}
              placeholder="Offer email content"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Follow Up Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-purple-900">Follow Up Email</h3>
          <div>
            <Label htmlFor="followUpSubject" className="text-sm font-medium">
              Subject Line
            </Label>
            <Input
              id="followUpSubject"
              value={formData.followUpSubject}
              onChange={(e) => handleInputChange('followUpSubject', e.target.value)}
              placeholder="Follow up subject line"
              required
            />
          </div>
          <div>
            <Label htmlFor="followUpBody" className="text-sm font-medium">
              Email Body
            </Label>
            <Textarea
              id="followUpBody"
              value={formData.followUpBody}
              onChange={(e) => handleInputChange('followUpBody', e.target.value)}
              placeholder="Follow up email content"
              rows={4}
              required
            />
          </div>
        </div>

        {/* Abandoned Cart Email */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium text-red-900">Abandoned Cart Email</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="abandonedCartSubject" className="text-sm font-medium">
                Subject Line
              </Label>
              <Input
                id="abandonedCartSubject"
                value={formData.abandonedCartSubject}
                onChange={(e) => handleInputChange('abandonedCartSubject', e.target.value)}
                placeholder="Abandoned cart subject line"
                required
              />
            </div>
            <div>
              <Label htmlFor="abandonedCartBody" className="text-sm font-medium">
                Email Body
              </Label>
              <Textarea
                id="abandonedCartBody"
                value={formData.abandonedCartBody}
                onChange={(e) => handleInputChange('abandonedCartBody', e.target.value)}
                placeholder="Abandoned cart email content"
                rows={4}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will optimize your email strategy for maximum engagement and conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Email Strategy...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Email Strategy
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
