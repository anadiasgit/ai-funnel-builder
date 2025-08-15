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
  TrendingUp, 
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight
} from 'lucide-react'

interface UpsellsFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingUpsells?: Upsells | null
  onUpsellsGenerated: (upsells: Upsells) => void
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

interface Upsells {
  upsell1: {
    title: string
    description: string
    price: string
    benefits: string[]
  }
  upsell2: {
    title: string
    description: string
    price: string
    benefits: string[]
  }
}

export function UpsellsForm({ 
  customerAvatar, 
  mainOffer, 
  existingUpsells, 
  onUpsellsGenerated 
}: UpsellsFormProps) {
  const [formData, setFormData] = useState({
    upsell1Title: existingUpsells?.upsell1.title || '',
    upsell1Description: existingUpsells?.upsell1.description || '',
    upsell1Price: existingUpsells?.upsell1.price || '',
    upsell2Title: existingUpsells?.upsell2.title || '',
    upsell2Description: existingUpsells?.upsell2.description || '',
    upsell2Price: existingUpsells?.upsell2.price || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [upsells, setUpsells] = useState(existingUpsells)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const generatedUpsells = {
        upsell1: {
          title: formData.upsell1Title || `Advanced ${mainOffer.productName} Training`,
          description: formData.upsell1Description || `Take your results to the next level with advanced strategies and techniques`,
          price: formData.upsell1Price || '97',
          benefits: [
            'Advanced implementation strategies',
            'Case studies and real examples',
            'Expert Q&A sessions',
            'Advanced templates and resources'
          ]
        },
        upsell2: {
          title: formData.upsell2Title || `${mainOffer.productName} Mastermind Group`,
          description: formData.upsell2Description || `Join an exclusive community of successful practitioners`,
          price: formData.upsell2Price || '197',
          benefits: [
            'Monthly group coaching calls',
            'Peer accountability and support',
            'Exclusive networking opportunities',
            'Direct access to industry experts'
          ]
        }
      }
      
      setUpsells(generatedUpsells)
      onUpsellsGenerated(generatedUpsells)
    } catch (error) {
      console.error('Error generating upsells:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (upsells && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Upsell Offers Generated Successfully!</span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upsell 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {upsells.upsell1.title}
              </CardTitle>
              <CardDescription>
                First upsell offer for immediate post-purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-gray-700 mt-1">{upsells.upsell1.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Price</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">${upsells.upsell1.price}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Key Benefits</Label>
                <div className="mt-2 space-y-2">
                  {upsells.upsell1.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upsell 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {upsells.upsell2.title}
              </CardTitle>
              <CardDescription>
                Second upsell offer for long-term value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-gray-700 mt-1">{upsells.upsell2.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Price</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">${upsells.upsell2.price}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Key Benefits</Label>
                <div className="mt-2 space-y-2">
                  {upsells.upsell2.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={() => setUpsells(null)}
          variant="outline"
          className="w-full"
        >
          Regenerate Upsells
        </Button>
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
        {/* Upsell 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-blue-900">First Upsell Offer</CardTitle>
            <CardDescription>Immediate post-purchase upsell</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="upsell1Title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="upsell1Title"
                value={formData.upsell1Title}
                onChange={(e) => handleInputChange('upsell1Title', e.target.value)}
                placeholder="e.g., Advanced Training Package"
                required
              />
            </div>

            <div>
              <Label htmlFor="upsell1Description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="upsell1Description"
                value={formData.upsell1Description}
                onChange={(e) => handleInputChange('upsell1Description', e.target.value)}
                placeholder="What does this upsell include?"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="upsell1Price" className="text-sm font-medium">
                Price
              </Label>
              <Input
                id="upsell1Price"
                type="number"
                value={formData.upsell1Price}
                onChange={(e) => handleInputChange('upsell1Price', e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Upsell 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-purple-900">Second Upsell Offer</CardTitle>
            <CardDescription>Long-term value upsell</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="upsell2Title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="upsell2Title"
                value={formData.upsell2Title}
                onChange={(e) => handleInputChange('upsell2Title', e.target.value)}
                placeholder="e.g., Mastermind Group Access"
                required
              />
            </div>

            <div>
              <Label htmlFor="upsell2Description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="upsell2Description"
                value={formData.upsell2Description}
                onChange={(e) => handleInputChange('upsell2Description', e.target.value)}
                placeholder="What does this upsell include?"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="upsell2Price" className="text-sm font-medium">
                Price
              </Label>
              <Input
                id="upsell2Price"
                type="number"
                value={formData.upsell2Price}
                onChange={(e) => handleInputChange('upsell2Price', e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4" />
          <span>AI will optimize your upsell offers for maximum conversions</span>
        </div>
        
        <Button 
          type="submit" 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Upsells...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Upsell Offers
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
