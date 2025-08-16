'use client'

import { useState, useEffect } from 'react'
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
  Sparkles,
  CheckCircle2,
  Star,
  Download
} from 'lucide-react'

interface OfferGenerationFormProps {
  customerAvatar: CustomerAvatar
  existingOffer?: MainOffer | null
  onOfferGenerated: (offer: MainOffer) => void
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
}

interface MainOffer {
  id: string
  productName: string
  productDescription: string
  price: string
  valueProposition: string
  features: string
  guarantee: string
  aiOptimizations?: {
    headline: string
    subheadline: string
    urgency: string
    socialProof: string[]
    objections: string[]
    responses: string[]
  }
  pricing?: {
    originalPrice: number
    currentPrice: number
    savings: number
    paymentOptions: string[]
  }
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
  customerAvatar, 
  existingOffer, 
  onOfferGenerated 
}: OfferGenerationFormProps) {
  const [formData, setFormData] = useState({
    productName: existingOffer?.productName || '',
    productDescription: existingOffer?.productDescription || '',
    price: existingOffer?.price || '',
    valueProposition: existingOffer?.valueProposition || '',
    features: existingOffer?.features || '',
    guarantee: existingOffer?.guarantee || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [offer, setOffer] = useState(existingOffer)

  // Smart defaults based on customer avatar
  useEffect(() => {
    if (customerAvatar && !existingOffer) {
      const smartDefaults = generateSmartDefaults(customerAvatar)
      setFormData(prev => ({
        ...prev,
        ...smartDefaults
      }))
    }
  }, [customerAvatar, existingOffer])

  const generateSmartDefaults = (avatar: CustomerAvatar) => {
    const defaults: Partial<typeof formData> = {}
    
    // Industry-specific product suggestions
    if (avatar.industry) {
      const industryDefaults = getIndustryDefaults(avatar.industry)
      defaults.productName = industryDefaults.productName
      defaults.productDescription = industryDefaults.productDescription
      defaults.valueProposition = industryDefaults.valueProposition
      defaults.guarantee = industryDefaults.guarantee
    }

    // Industry-specific features (using industry instead of businessType)
    if (avatar.industry) {
      const industryFeatures = getIndustryFeatures(avatar.industry)
      defaults.features = industryFeatures
    }

    // Budget-aware pricing suggestions
    if (avatar.budget) {
      defaults.price = getBudgetBasedPricing(avatar.budget)
    }

    return defaults
  }

  const getIndustryDefaults = (industry: string) => {
    const industryMap: Record<string, {
      productName: string
      productDescription: string
      valueProposition: string
      guarantee: string
    }> = {
      'Technology': {
        productName: 'Complete Tech Solution Suite',
        productDescription: 'End-to-end technology solution for modern businesses',
        valueProposition: 'Transform your business with cutting-edge technology',
        guarantee: '30-day money-back guarantee with full support'
      },
      'Marketing & Advertising': {
        productName: 'Marketing Mastery System',
        productDescription: 'Comprehensive marketing strategy and implementation guide',
        valueProposition: 'Generate consistent leads and increase conversions',
        guarantee: 'Double your ROI or get your money back'
      },
      'E-commerce': {
        productName: 'E-commerce Growth Blueprint',
        productDescription: 'Proven system to scale your online store',
        valueProposition: 'Increase sales and reduce customer acquisition costs',
        guarantee: 'See results in 90 days or full refund'
      },
      'Health & Wellness': {
        productName: 'Wellness Business Builder',
        productDescription: 'Complete system for health and wellness entrepreneurs',
        valueProposition: 'Help more people while building a profitable business',
        guarantee: 'Transform your practice or 100% refund'
      },
      'Finance': {
        productName: 'Financial Freedom Framework',
        productDescription: 'Step-by-step guide to building wealth',
        valueProposition: 'Secure your financial future with proven strategies',
        guarantee: 'Achieve your first milestone or money back'
      }
    }
    
    return industryMap[industry] || {
      productName: 'Business Success System',
      productDescription: 'Complete solution for your business needs',
      valueProposition: 'Transform your business and achieve your goals',
      guarantee: '30-day satisfaction guarantee'
    }
  }

  const getIndustryFeatures = (industry: string) => {
    const featureMap: Record<string, string> = {
      'Technology': 'Cloud infrastructure, automation tools, security protocols, scalability solutions, integration capabilities',
      'Marketing & Advertising': 'Lead generation systems, conversion optimization, customer journey mapping, analytics tools, campaign management',
      'E-commerce': 'Product optimization, conversion tactics, customer retention, scaling strategies, inventory management',
      'Health & Wellness': 'Client management systems, appointment scheduling, wellness tracking, outcome measurement, practice growth',
      'Finance': 'Investment strategies, risk management, portfolio optimization, tax planning, retirement planning',
      'Real Estate': 'Lead generation, client management, market analysis, transaction coordination, team building',
      'Professional Services': 'Client acquisition, service delivery, pricing models, business scaling, team management'
    }
    
    return featureMap[industry] || 'Core business strategies, growth tactics, operational efficiency, customer success'
  }

  const getBudgetBasedPricing = (budget: string) => {
    const budgetMap: Record<string, string> = {
      'Under $1,000': '97',
      '$1,000 - $5,000': '297',
      '$5,000 - $10,000': '497',
      '$10,000 - $25,000': '997',
      '$25,000+': '1,997'
    }
    
    return budgetMap[budget] || '197'
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Helper function to handle offer download
  const handleDownload = (offerData: MainOffer) => {
    try {
      const timestamp = new Date().toLocaleString()
      const content = `MAIN OFFER - ${offerData.productName}\n${'='.repeat(50)}\n\n` +
        `Generated on: ${timestamp}\n\n` +
        `PRODUCT DETAILS:\n` +
        `Product Name: ${offerData.productName}\n` +
        `Product Description: ${offerData.productDescription}\n` +
        `Price: $${offerData.price}\n` +
        `Value Proposition: ${offerData.valueProposition}\n\n` +
        `FEATURES:\n${offerData.features}\n\n` +
        `GUARANTEE:\n${offerData.guarantee}\n\n` +
        `AI OPTIMIZATIONS:\n` +
        `Headline: ${offerData.aiOptimizations?.headline || 'Not available'}\n` +
        `Subheadline: ${offerData.aiOptimizations?.subheadline || 'Not available'}\n` +
        `Urgency: ${offerData.aiOptimizations?.urgency || 'Not available'}\n\n` +
        `SOCIAL PROOF:\n${offerData.aiOptimizations?.socialProof?.map(proof => `• ${proof}`).join('\n') || 'Not available'}\n\n` +
        `OBJECTIONS & RESPONSES:\n` +
        `${offerData.aiOptimizations?.objections?.map((obj, index) => 
          `Objection ${index + 1}: ${obj}\nResponse: ${offerData.aiOptimizations?.responses?.[index] || 'Not available'}\n`
        ).join('\n') || 'Not available'}\n\n` +
        `PRICING:\n` +
        `Original Price: $${offerData.pricing?.originalPrice || 'Not set'}\n` +
        `Current Price: $${offerData.pricing?.currentPrice || offerData.price}\n` +
        `Savings: $${offerData.pricing?.savings || '0'}\n` +
        `Payment Options: ${offerData.pricing?.paymentOptions?.join(', ') || 'Not specified'}\n\n` +
        `Generated by AI Funnel Builder`

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const timestamp2 = new Date().toISOString().split('T')[0]
      const filename = `${offerData.productName.replace(/[^a-zA-Z0-9]/g, '_')}_Main_Offer_${timestamp2}.txt`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Show success feedback
      alert('Main offer downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
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
                  {offer.aiOptimizations?.headline}
                </h3>
                <p className="text-gray-600 mt-1">
                  {offer.aiOptimizations?.subheadline}
                </p>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Optimized Pricing</Label>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-green-600">
                  ${offer.pricing?.currentPrice || offer.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${offer.pricing?.originalPrice || offer.price}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Save ${offer.pricing?.savings || '0'}
                </Badge>
              </div>
                              <p className="text-sm text-gray-600 mt-1">
                  {offer.pricing?.paymentOptions?.join(' • ') || 'One-time payment'}
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
                {offer.aiOptimizations?.socialProof?.map((proof: string, index: number) => (
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
                {offer.aiOptimizations?.objections?.map((objection: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Objection: {objection}
                    </p>
                    <p className="text-sm text-gray-700">
                      Response: {offer.aiOptimizations?.responses?.[index]}
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

            <Button 
              onClick={() => handleDownload(offer)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Main Offer
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
        
        <div className="flex gap-2">
          {existingOffer && (
            <Button 
              variant="outline"
              onClick={() => handleDownload(existingOffer)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Existing Offer
            </Button>
          )}
          
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
      </div>
    </form>
  )
}
