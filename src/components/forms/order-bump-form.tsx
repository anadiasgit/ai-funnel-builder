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
  ShoppingCart, 
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { CustomerAvatar, MainOffer } from '@/lib/types'

interface OrderBumpFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingOrderBump?: OrderBump | null
  onOrderBumpGenerated: (orderBump: OrderBump) => void
}



interface OrderBump {
  title: string
  description: string
  price: string
  benefits: string[]
  urgency: string
}

export function OrderBumpForm({ 
  customerAvatar, 
  mainOffer, 
  existingOrderBump, 
  onOrderBumpGenerated 
}: OrderBumpFormProps) {
  const [formData, setFormData] = useState({
    title: existingOrderBump?.title || '',
    description: existingOrderBump?.description || '',
    price: existingOrderBump?.price || '',
    urgency: existingOrderBump?.urgency || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [orderBump, setOrderBump] = useState(existingOrderBump)

  // Smart defaults based on customer avatar and main offer
  useEffect(() => {
    if ((customerAvatar || mainOffer) && !existingOrderBump) {
      const smartDefaults = generateSmartDefaults(customerAvatar, mainOffer)
      setFormData(prev => ({
        ...prev,
        ...smartDefaults
      }))
    }
  }, [customerAvatar, mainOffer, existingOrderBump])

  const generateSmartDefaults = (avatar: CustomerAvatar | null, offer: MainOffer | null) => {
    const defaults: Partial<typeof formData> = {}
    
    // Industry-specific order bump suggestions
    if (avatar?.industry) {
      const industryDefaults = getIndustryDefaults(avatar.industry)
      defaults.title = industryDefaults.title
      defaults.description = industryDefaults.description
      defaults.urgency = industryDefaults.urgency
    }

    // Price-based on main offer pricing
    if (offer?.price) {
      defaults.price = getOrderBumpPricing(offer.price)
    }

    // Enhanced description using main offer context
    if (offer?.productName) {
      defaults.description = defaults.description || `Complete ${offer.productName} Package - Get everything you need to succeed!`
    }

    return defaults
  }

  const getIndustryDefaults = (industry: string) => {
    const industryMap: Record<string, {
      title: string
      description: string
      urgency: string
    }> = {
      'Technology': {
        title: 'Complete Tech Solution Suite',
        description: 'Get the full technology stack with implementation support and training',
        urgency: 'Limited Time: This upgrade expires when you leave this page'
      },
      'Marketing & Advertising': {
        title: 'Marketing Mastery Complete Package',
        description: 'Full marketing system with templates, scripts, and automation tools',
        urgency: 'Special Offer: 50% off when ordered with main product'
      },
      'E-commerce': {
        title: 'E-commerce Growth Accelerator',
        description: 'Complete store optimization with conversion tools and scaling strategies',
        urgency: 'Exclusive: Only available during checkout'
      },
      'Health & Wellness': {
        title: 'Wellness Business Complete System',
        description: 'Full practice management with client acquisition and retention tools',
        urgency: 'Limited Availability: Only 50 packages remaining'
      },
      'Finance': {
        title: 'Financial Freedom Complete Package',
        description: 'Comprehensive wealth building with ongoing support and updates',
        urgency: 'Special Launch Price: Regular price $497, today only $197'
      }
    }
    
    return industryMap[industry] || {
      title: 'Complete Success Package',
      description: 'Get everything you need to succeed with your business goals',
      urgency: 'Limited Time: This offer expires when you leave this page'
    }
  }

  const getOrderBumpPricing = (mainPrice: string) => {
    const price = parseFloat(mainPrice.replace(/[^0-9.]/g, ''))
    
    if (price < 50) return '27'
    if (price < 100) return '47'
    if (price < 200) return '97'
    if (price < 500) return '197'
    if (price < 1000) return '297'
    return '497'
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedOrderBump = {
        title: formData.title || `Complete ${mainOffer.productName} Package`,
        description: formData.description || `Get everything you need to succeed with ${mainOffer.productName}`,
        price: formData.price || '47',
        benefits: [
          'Instant access to bonus materials',
          'Exclusive templates and resources',
          'Priority customer support',
          'Lifetime updates and improvements'
        ],
        urgency: formData.urgency || 'Limited Time: This offer expires when you leave this page'
      }
      
      setOrderBump(generatedOrderBump)
      onOrderBumpGenerated(generatedOrderBump)
    } catch (error) {
      console.error('Error generating order bump:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (orderBump && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Order Bump Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {orderBump.title}
            </CardTitle>
            <CardDescription>
              AI-optimized order bump to increase your average order value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Bump Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{orderBump.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Price</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">${orderBump.price}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <p className="text-gray-700 mt-1">{orderBump.description}</p>
            </div>

            <Separator />

            {/* Benefits */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Key Benefits</Label>
              <div className="mt-2 space-y-2">
                {orderBump.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Urgency */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Label className="text-sm font-medium text-orange-800">Urgency Message</Label>
              <p className="text-orange-700 mt-1 font-medium">{orderBump.urgency}</p>
            </div>

            <Button 
              onClick={() => setOrderBump(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Order Bump
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
        {/* Order Bump Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Order Bump Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Complete Success Package"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What does this order bump include?"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Pricing & Urgency */}
        <div className="space-y-4">
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

          <div>
            <Label htmlFor="urgency" className="text-sm font-medium">
              Urgency Message
            </Label>
            <Textarea
              id="urgency"
              value={formData.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value)}
              placeholder="Create urgency to encourage immediate action"
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
          <span>AI will optimize your order bump for maximum conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Order Bump...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Order Bump
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
