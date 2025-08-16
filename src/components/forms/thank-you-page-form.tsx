'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  CheckCircle2, 
  Sparkles,
  Gift
} from 'lucide-react'
import { CustomerAvatar, MainOffer } from '@/lib/types'

interface ThankYouPageFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingThankYou?: ThankYouPage | null
  onThankYouGenerated: (thankYou: ThankYouPage) => void
}



interface ThankYouPage {
  headline: string
  message: string
  nextSteps: string[]
  bonus: string
}

export function ThankYouPageForm({ 
  customerAvatar, 
  mainOffer, 
  existingThankYou, 
  onThankYouGenerated 
}: ThankYouPageFormProps) {
  const [formData, setFormData] = useState({
    headline: existingThankYou?.headline || '',
    message: existingThankYou?.message || '',
    bonus: existingThankYou?.bonus || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [thankYou, setThankYou] = useState(existingThankYou)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const generatedThankYou = {
        headline: formData.headline || `Thank You! Your ${mainOffer.productName} is Ready`,
        message: formData.message || `Congratulations! You've just taken a huge step toward transforming your ${customerAvatar.industry} business. Your ${mainOffer.productName} is now available for immediate download.`,
        nextSteps: [
          'Check your email for download instructions',
          'Download your materials to your computer',
          'Review the quick-start guide first',
          'Join our exclusive customer community',
          'Schedule your first implementation session'
        ],
        bonus: formData.bonus || `As a special bonus, you'll also receive our exclusive "Advanced Implementation Checklist" worth $97 - completely FREE!`
      }
      
      setThankYou(generatedThankYou)
      onThankYouGenerated(generatedThankYou)
    } catch (error) {
      console.error('Error generating thank you page:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (thankYou && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Thank You Page Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Thank You Page Content
            </CardTitle>
            <CardDescription>
              AI-optimized content to keep customers engaged and excited
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Headline */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Main Headline</Label>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{thankYou.headline}</h2>
            </div>

            {/* Message */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Thank You Message</Label>
              <p className="text-gray-700 mt-1 text-lg">{thankYou.message}</p>
            </div>

            {/* Next Steps */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Next Steps</Label>
              <div className="mt-2 space-y-2">
                {thankYou.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                <Label className="text-sm font-medium text-yellow-800">Special Bonus</Label>
              </div>
              <p className="text-yellow-700 font-medium">{thankYou.bonus}</p>
            </div>

            <Button 
              onClick={() => setThankYou(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Thank You Page
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
          <Label htmlFor="headline" className="text-sm font-medium">
            Thank You Headline
          </Label>
          <Input
            id="headline"
            value={formData.headline}
            onChange={(e) => handleInputChange('headline', e.target.value)}
            placeholder="e.g., Thank You! Your Order is Complete"
            required
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium">
            Thank You Message
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Personalized message to welcome the customer"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="bonus" className="text-sm font-medium">
            Special Bonus
          </Label>
          <Textarea
            id="bonus"
            value={formData.bonus}
            onChange={(e) => handleInputChange('bonus', e.target.value)}
            placeholder="What bonus are you offering to increase excitement?"
            rows={3}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will create engaging content to keep customers excited</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Thank You Page...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Thank You Page
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
