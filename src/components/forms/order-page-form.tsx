'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  FileText, 
  Sparkles,
  CheckCircle2,
  Star
} from 'lucide-react'
import { CustomerAvatar, MainOffer } from '@/lib/types'

interface OrderPageFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingOrderPage?: OrderPage | null
  onOrderPageGenerated: (orderPage: OrderPage) => void
}



interface OrderPage {
  headline: string
  subheadline: string
  benefits: string[]
  socialProof: string[]
  callToAction: string
  guarantee: string
}

export function OrderPageForm({ 
  customerAvatar, 
  mainOffer, 
  existingOrderPage, 
  onOrderPageGenerated 
}: OrderPageFormProps) {
  const [formData, setFormData] = useState({
    headline: existingOrderPage?.headline || '',
    subheadline: existingOrderPage?.subheadline || '',
    callToAction: existingOrderPage?.callToAction || '',
    guarantee: existingOrderPage?.guarantee || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [orderPage, setOrderPage] = useState(existingOrderPage)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3500))
      
      const generatedOrderPage = {
        headline: formData.headline || `Get ${mainOffer.productName} Today & Transform Your ${customerAvatar.industry} Business`,
        subheadline: formData.subheadline || `Join thousands of successful ${customerAvatar.industry} professionals who have already achieved breakthrough results`,
        benefits: [
          'Step-by-step implementation guide',
          'Proven strategies that work in any market',
          'Instant access to all materials',
          'Lifetime updates and improvements',
          '30-day money-back guarantee'
        ],
        socialProof: [
          'Over 2,500+ satisfied customers',
          'Featured in major industry publications',
          'Used by Fortune 500 companies',
          '4.9/5 star customer rating'
        ],
        callToAction: formData.callToAction || `Click the button below to get instant access to ${mainOffer.productName} for just $${mainOffer.price}`,
        guarantee: formData.guarantee || '30-Day Money-Back Guarantee: If you\'re not completely satisfied, we\'ll refund your purchase, no questions asked.'
      }
      
      setOrderPage(generatedOrderPage)
      onOrderPageGenerated(generatedOrderPage)
    } catch (error) {
      console.error('Error generating order page:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (orderPage && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Order Page Copy Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Page Copy
            </CardTitle>
            <CardDescription>
              AI-optimized copy for maximum conversions on your order page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Headlines */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Main Headline</Label>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{orderPage.headline}</h2>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Subheadline</Label>
                <p className="text-lg text-gray-700 mt-1">{orderPage.subheadline}</p>
              </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Key Benefits</Label>
              <div className="mt-2 space-y-2">
                {orderPage.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Social Proof */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Social Proof</Label>
              <div className="mt-2 space-y-2">
                {orderPage.socialProof.map((proof, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{proof}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Call to Action */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium text-blue-800">Call to Action</Label>
              <p className="text-blue-700 mt-1 font-medium">{orderPage.callToAction}</p>
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-medium text-green-800">Guarantee</Label>
              <p className="text-green-700 mt-1 font-medium">{orderPage.guarantee}</p>
            </div>

            <Button 
              onClick={() => setOrderPage(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Order Page Copy
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Headlines */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="headline" className="text-sm font-medium">
              Main Headline
            </Label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              placeholder="e.g., Transform Your Business Today"
              required
            />
          </div>

          <div>
            <Label htmlFor="subheadline" className="text-sm font-medium">
              Subheadline
            </Label>
            <Textarea
              id="subheadline"
              value={formData.subheadline}
              onChange={(e) => handleInputChange('subheadline', e.target.value)}
              placeholder="Supporting text that builds interest"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Call to Action & Guarantee */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="callToAction" className="text-sm font-medium">
              Call to Action
            </Label>
            <Textarea
              id="callToAction"
              value={formData.callToAction}
              onChange={(e) => handleInputChange('callToAction', e.target.value)}
              placeholder="What should the customer do next?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="guarantee" className="text-sm font-medium">
              Guarantee
            </Label>
            <Textarea
              id="guarantee"
              value={formData.guarantee}
              onChange={(e) => handleInputChange('guarantee', e.target.value)}
              placeholder="What guarantee do you offer?"
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
          <span>AI will optimize your order page copy for maximum conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Order Page Copy...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Order Page Copy
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
