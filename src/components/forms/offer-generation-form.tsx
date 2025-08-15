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
  Target, 
  DollarSign, 
  Package, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Star
} from 'lucide-react'

interface OfferGenerationFormProps {
  projectId: string
  customerAvatar: any
  existingOffer?: any
  onOfferGenerated: (offer: any) => void
}

interface OfferFormData {
  productName: string
  productDescription: string
  price: string
  valueProposition: string
  features: string
  guarantee: string
}

export function OfferGenerationForm({ 
  projectId, 
  customerAvatar, 
  existingOffer, 
  onOfferGenerated 
}: OfferGenerationFormProps) {
  const [formData, setFormData] = useState<OfferFormData>({
    productName: existingOffer?.productName || '',
    productDescription: existingOffer?.productDescription || '',
    price: existingOffer?.price || '',
    valueProposition: existingOffer?.valueProposition || '',
    features: existingOffer?.features || '',
    guarantee: existingOffer?.guarantee || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [offer, setOffer] = useState(existingOffer)

  const handleInputChange = (field: keyof OfferFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const generatedOffer = {
        ...formData,
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        aiOptimizations: {
          headline: `Transform Your ${customerAvatar.industry} Business in 30 Days`,
          subheadline: `The proven system that helped 500+ businesses like yours increase revenue by 300%`,
          urgency: 'Limited Time: Only 47 spots available this month',
          socialProof: [
            'Trusted by 500+ business owners',
            '4.9/5 star rating from 200+ reviews',
            'Featured in Business Insider, Forbes'
          ],
          objections: [
            'What if it doesn\'t work for my business?',
            'I don\'t have time to implement this',
            'It sounds too good to be true'
          ],
          responses: [
            '30-day money-back guarantee, no questions asked',
            'Done-for-you implementation included',
            'Real results from real businesses - see case studies'
          ]
        },
        pricing: {
          originalPrice: parseFloat(formData.price) * 1.5,
          currentPrice: parseFloat(formData.price),
          savings: parseFloat(formData.price) * 0.5,
          paymentOptions: ['One-time payment', '3 monthly payments']
        }
      }
      
      setOffer(generatedOffer)
      onOfferGenerated(generatedOffer)
    } catch (error) {
      console.error('Error generating offer:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (offer && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Main Offer Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {offer.productName}
            </CardTitle>
            <CardDescription>
              AI-optimized offer with conversion-focused copy and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Headlines */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">AI-Generated Headline</Label>
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                {offer.aiOptimizations.headline}
              </h3>
              <p className="text-gray-600 mt-1">
                {offer.aiOptimizations.subheadline}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Optimized Pricing</Label>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-green-600">
                  ${offer.pricing.currentPrice}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${offer.pricing.originalPrice}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Save ${offer.pricing.savings}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {offer.pricing.paymentOptions.join(' • ')}
              </p>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Product Description</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.productDescription}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Value Proposition</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.valueProposition}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Key Features</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.features}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Guarantee</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.guarantee}</p>
              </div>
            </div>

            <Separator />

            {/* Social Proof */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Social Proof Elements</Label>
              <div className="mt-2 space-y-2">
                {offer.aiOptimizations.socialProof.map((proof: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-gray-700">{proof}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Objection Handling */}
            <div>
              <Label className="text-sm font-medium text-gray-700">AI Objection Handling</Label>
              <div className="mt-2 space-y-3">
                {offer.aiOptimizations.objections.map((objection: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Objection: {objection}
                    </p>
                    <p className="text-sm text-gray-700">
                      Response: {offer.aiOptimizations.responses[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setOffer(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Offer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Avatar Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-900">Customer Avatar Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Industry:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Target Audience:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.targetAudience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Budget Range:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.budget}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-sm font-medium">
              Product/Service Name
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              placeholder="Your main product or service"
              required
            />
          </div>

          <div>
            <Label htmlFor="productDescription" className="text-sm font-medium">
              Product Description
            </Label>
            <Textarea
              id="productDescription"
              value={formData.productDescription}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              placeholder="What does your product/service do?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-sm font-medium">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Offer Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="valueProposition" className="text-sm font-medium">
              Value Proposition
            </Label>
            <Textarea
              id="valueProposition"
              value={formData.valueProposition}
              onChange={(e) => handleInputChange('valueProposition', e.target.value)}
              placeholder="What's the main benefit for customers?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="features" className="text-sm font-medium">
              Key Features
            </Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              placeholder="What features make your offer unique?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="guarantee" className="text-sm font-medium">
              Guarantee/Refund Policy
            </Label>
            <Textarea
              id="guarantee"
              value={formData.guarantee}
              onChange={(e) => handleInputChange('guarantee', e.target.value)}
              placeholder="What's your guarantee to customers?"
              rows={2}
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will optimize your offer for maximum conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Offer...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Optimized Offer
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
